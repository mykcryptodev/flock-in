import { CHAIN } from "@/app/constants";
import { REVIEW_CONTRACT } from "@/app/constants";
import { getReviewByRequestId } from "@/thirdweb/8453/0xbea64ccd92203b1c2dac1d395925cebf42f93be5";
import { FC, useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import WriteReview from "./WriteReview";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
  requesterFid: number;
  completerFid: number;
  completer: string;
}

export const Review: FC<Props> = ({ requestId, requesterFid, completerFid, completer }) => {
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [review, setReview] = useState<Awaited<ReturnType<typeof getReviewByRequestId>> | null>(null);

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

  if (!review?.id) {
    return <WriteReview requestId={requestId} requesterFid={requesterFid} completerFid={completerFid} completer={completer} />;
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
        <p className="mt-2 text-sm text-gray-700">
          {review.comment}
        </p>
      </details>
    </div>
  );
};

export default Review;