import { CHAIN } from "@/app/constants";
import { REVIEW_CONTRACT } from "@/app/constants";
import { getReviewByRequestId } from "@/thirdweb/8453/0x3fe1eb3912ea77230876eebd133a6a3467e2f93b";
import { FC, useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import WriteReview from "./WriteReview";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import { NeynarUser } from "../Request";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
  requester: string;
  completer: string;
  requesterUser: NeynarUser | null;
  completerUser: NeynarUser | null;
}

export const Review: FC<Props> = ({ requestId, requester, completer, requesterUser, completerUser }) => {
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [review, setReview] = useState<Awaited<ReturnType<typeof getReviewByRequestId>> | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    const fetchReview = async () => {
      setIsReviewLoading(true);
      try {
        const review = await getReviewByRequestId({
          contract: getContract({
            address: REVIEW_CONTRACT,
            client,
            chain: CHAIN,
          }),
          requestId: BigInt(requestId),
        });
        setReview(review);
      } catch (error) {
        console.error(error);
      } finally {
        setIsReviewLoading(false);
      }
    };
    fetchReview();
  }, [requestId]);

  if (isReviewLoading) {
    return <div>Loading...</div>;
  }

  if (!review?.id && isAddressEqual(address ?? "", requester)) {
    return <WriteReview requestId={requestId} completer={completer} />;
  }

  if (!review?.id) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center space-x-2 text-xs">
        <span className="font-medium">Rating: {Number(review.rating)}/5</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-xs">
              {i < Number(review.rating) ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>

      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
          Show Review
        </summary>
        <div className="flex flex-col mt-2">
          {requesterUser && (
            <div className="text-xs text-gray-600 flex items-center gap-1">
              {requesterUser.pfp_url && (
                <img src={requesterUser.pfp_url} alt={requesterUser.username} className="w-4 h-4 rounded-full" />
              )}
              <div>{requesterUser.username}</div>
            </div>
          )}
          <div className="text-sm text-gray-700">
            {review.comment}
          </div>
          {review.reviewCreatedBeforeCompletion && (
            <div className="text-xs text-gray-600 opacity-50">
              Review written before request completion
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default Review;