export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/app/services/redis';

// Neynar API endpoint for user bulk lookup
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/bulk';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

// Cache key prefix for user data
const USER_CACHE_PREFIX = 'user:';

/**
 * GET handler for fetching user information from Neynar bulk API
 * @param request The incoming request object
 * @returns NextResponse with user data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Get the FIDs from the URL
    const searchParams = request.nextUrl.searchParams;
    const fids = searchParams.get('fids');
    
    // Validate the fids parameter
    if (!fids) {
      return NextResponse.json(
        { error: 'FIDs parameter is required' },
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

    // Create a cache key based on the FIDs
    const cacheKey = `${USER_CACHE_PREFIX}${fids}`;
    
    // Check if we have cached data for these FIDs
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached user data');
      return NextResponse.json(cachedData);
    }

    // Make the request to Neynar API
    const response = await fetch(`${NEYNAR_API_URL}?fids=${encodeURIComponent(fids)}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-neynar-experimental': 'false',
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch user data', details: errorData },
        { status: response.status }
      );
    }

    // Parse the response
    const data = await response.json();
    
    // Cache the response data
    await setCachedData(cacheKey, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
