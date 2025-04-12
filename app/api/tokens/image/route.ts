import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/app/services/redis';

const COINGECKO_UNKNOWN_IMG = "https://static.coingecko.com/s/missing_thumb_2x-38c6e63b2e37f3b16510adf55368db6d8d8e6385629f6e9d41557762b25a6eeb.png";

// Cache key prefix for token images
const TOKEN_IMAGE_CACHE_PREFIX = 'token_image:';

// Token image overrides (lowercase address to image URL)
const TOKEN_IMAGE_OVERRIDES = new Map<string, string>([
  ['0xdc471c5c72de413e4877ced49b8bd0ce72796722', 'https://s2.coinmarketcap.com/static/img/coins/64x64/31916.png'],
]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainName = searchParams.get('chain');
    const tokenAddress = searchParams.get('address');

    if (!chainName || !tokenAddress) {
      return NextResponse.json({ error: 'Missing chain or address parameter' }, { status: 400 });
    }

    const normalizedAddress = tokenAddress.toLowerCase();

    // Check for override first
    if (TOKEN_IMAGE_OVERRIDES.has(normalizedAddress)) {
      return NextResponse.json({ image: TOKEN_IMAGE_OVERRIDES.get(normalizedAddress) });
    }

    // Create a cache key from chain and address
    const cacheKey = `${TOKEN_IMAGE_CACHE_PREFIX}${chainName}:${normalizedAddress}`;
    
    // Check if we have cached data in Redis
    const cachedData = await getCachedData<{ image: string }>(cacheKey);
    if (cachedData) {
      console.log('Using cached token image');
      return NextResponse.json(cachedData);
    }

    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${chainName}/contract/${tokenAddress}`);
    
    if (!res.ok) {
      // Cache the unknown image result
      const data = { image: COINGECKO_UNKNOWN_IMG };
      await setCachedData(cacheKey, data);
      return NextResponse.json(data);
    }

    const json = await res.json();
    const data = { image: json.image?.large ?? COINGECKO_UNKNOWN_IMG };

    // Cache the successful result in Redis
    await setCachedData(cacheKey, data);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching token image:', error);
    return NextResponse.json({ image: COINGECKO_UNKNOWN_IMG });
  }
}
