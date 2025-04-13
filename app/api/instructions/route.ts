import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const key = `instructions:${address.toLowerCase()}`;
  const value = await redis.get(key);
  
  // Handle both string and boolean values from Redis
  const hasSeen = value === true || value === 'true';
  
  return NextResponse.json({ hasSeen });
}

export async function POST(request: Request) {
  const { address } = await request.json();

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const key = `instructions:${address.toLowerCase()}`;
  console.log('Saving to Redis with key:', key);
  await redis.set(key, 'true');
  const savedValue = await redis.get(key);
  console.log('Verified saved value:', savedValue);
  return NextResponse.json({ success: true });
} 