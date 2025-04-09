import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/app/services/redis';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster/user/search';

// Cache key prefix for user search results
const USER_SEARCH_CACHE_PREFIX = 'user_search:';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  if (!NEYNAR_API_KEY) {
    return NextResponse.json({ error: 'Neynar API key is not configured' }, { status: 500 });
  }

  try {
    // Create a cache key based on the search query
    const cacheKey = `${USER_SEARCH_CACHE_PREFIX}${query}`;
    
    // Check if we have cached data for this search query
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      console.log('Using cached search results');
      return NextResponse.json(cachedData);
    }

    const response = await fetch(`${NEYNAR_API_URL}?q=${encodeURIComponent(query)}`, {
      headers: {
        'accept': 'application/json',
        'x-api-key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache the response data
    await setCachedData(cacheKey, data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
} 