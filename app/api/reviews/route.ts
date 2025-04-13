import { CHAIN, REVIEW_CONTRACT } from "@/app/constants";
import { getFullReviewByReviewee } from "@/thirdweb/8453/0x3fe1eb3912ea77230876eebd133a6a3467e2f93b";
import { NextResponse } from "next/server";
import { createThirdwebClient, getContract } from "thirdweb";
import { getCachedData, setCachedData } from "@/app/services/redis";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Cache key prefix for reviews
const REVIEWS_CACHE_PREFIX = 'reviews:';

const appUrl = process.env.NEXT_PUBLIC_URL;

export interface ReviewerInfo {
  address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  fid: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  // Normalize address to lowercase for consistent cache keys
  const normalizedAddress = address.toLowerCase();
  
  // Create a cache key based on the normalized address
  const cacheKey = `${REVIEWS_CACHE_PREFIX}${normalizedAddress}`;
  
  // Check if we have cached data for this address
  // const cachedData = await getCachedData(cacheKey);
  // if (cachedData) {
  //   return NextResponse.json(cachedData);
  // }

  const reviews = await getFullReviewByReviewee({
    contract: getContract({
      address: REVIEW_CONTRACT,
      client,
      chain: CHAIN,
    }),
    reviewee: address,
  });

  // Get unique reviewer addresses
  const reviewerAddresses = Array.from(new Set(reviews.map(review => review.reviewer)));
  console.log(JSON.stringify(reviewerAddresses, null, 2));
  
  // Fetch reviewer information
  const reviewerResponse = await fetch(`${appUrl}/api/users/get-by-address?addresses=${reviewerAddresses.join(',')}`)
  console.log(`${appUrl}/api/users/get-by-address?addresses=${reviewerAddresses.join(',')}`)
  const reviewerData = await reviewerResponse.json();
  console.log(JSON.stringify(reviewerData, null, 2));
  
  // Convert the users array to a Map
  const reviewersMap = new Map<string, ReviewerInfo>();
  reviewerData.users.forEach((user: ReviewerInfo) => {
    reviewersMap.set(user.address.toLowerCase(), user);
  });

  // Log the Map contents in a readable format
  console.log('Reviewers Map:', Object.fromEntries(reviewersMap));

  const reviewsMappedBigInts = reviews.map((review) => {
    const reviewerInfo = reviewersMap.get(review.reviewer.toLowerCase());
    return {
      ...review,
      id: review.id.toString(),
      requestId: review.requestId.toString(),
      rating: review.rating.toString(),
      reviewerInfo: reviewerInfo || null,
    };
  });

  console.log(JSON.stringify(reviewsMappedBigInts, null, 2));

  const responseData = { reviews: reviewsMappedBigInts };
  
  // Cache the response data for 5 minutes (300 seconds)
  // await setCachedData(cacheKey, responseData, 300);
  
  return NextResponse.json(responseData);
}