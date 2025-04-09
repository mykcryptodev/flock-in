import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache duration in seconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60;

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T): Promise<void> {
  try {
    await redis.set(key, data, { ex: CACHE_DURATION });
  } catch (error) {
    console.error('Error setting cached data:', error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
} 