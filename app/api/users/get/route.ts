import { NextRequest, NextResponse } from 'next/server';

// Neynar API endpoint for user bulk lookup
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/bulk';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

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

    // Parse and return the response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
