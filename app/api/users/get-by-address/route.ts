import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/app/services/redis';

// Neynar API endpoint for user bulk lookup by address
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/bulk-by-address';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// Cache key prefix for user data
const USER_CACHE_PREFIX = 'user_by_address:';

interface NeynarUser {
  object: string;
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
    primary: {
      eth_address: string;
      sol_address: string | null;
    };
  };
}

interface NeynarResponse {
  [key: string]: NeynarUser[];
}

interface TransformedUser {
  address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  fid: number;
}

/**
 * GET handler for fetching user information from Neynar bulk API by address
 * @param request The incoming request object
 * @returns NextResponse with user data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Get the addresses from the URL
    const searchParams = request.nextUrl.searchParams;
    const addresses = searchParams.get('addresses');
    
    // Validate the addresses parameter
    if (!addresses) {
      return NextResponse.json(
        { error: 'Addresses parameter is required' },
        { status: 400 }
      );
    }

    // Get the API key from environment variables
    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        { error: 'Neynar API key is not configured' },
        { status: 500 }
      );
    }

    // Create a cache key based on the addresses
    const cacheKey = `${USER_CACHE_PREFIX}${addresses}`;
    
    // Check if we have cached data for these addresses
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Make a single request to Neynar API with all addresses
    const response = await fetch(`${NEYNAR_API_URL}?addresses=${encodeURIComponent(addresses)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Neynar API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch user data', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json() as NeynarResponse;
    
    console.log('Raw Neynar response:', JSON.stringify(data));
    
    // Transform the response into our expected format
    const users: TransformedUser[] = Object.values(data).flat().map((user) => {
      console.log('Processing user:', JSON.stringify(user));
      return {
        address: user.verified_addresses.primary.eth_address || user.custody_address,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
        fid: user.fid,
      };
    });

    console.log('Transformed users:', JSON.stringify(users));

    const responseData = { users };
    
    // Cache the transformed response data
    await setCachedData(cacheKey, responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 