import { Transaction } from "@coinbase/onchainkit/transaction";
import { useState } from "react";
import { TransactionButton } from "@coinbase/onchainkit/transaction";
import { createReview } from "@/thirdweb/8453/0xbea64ccd92203b1c2dac1d395925cebf42f93be5";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { encode, getContract } from "thirdweb";
import { REVIEW_CONTRACT } from "../../constants";
import { CHAIN } from "../../constants";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
  requesterFid: number;
  completerFid: number;
  completer: string;
}

export default function WriteReview({ requestId, completerFid, completer }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { context } = useMiniKit();

  const handleSubmit = () => {
    setIsOpen(false);
    setReview("");
    setRating(0);
  };

  const getCalls = async () => {
    const tx = createReview({
      contract: getContract({
        address: REVIEW_CONTRACT,
        client,
        chain: CHAIN,
      }),
      requestId: BigInt(requestId),
      reviewerFid: BigInt(context?.user.fid || 0),
      reviewee: completer,
      revieweeFid: BigInt(completerFid),
      rating: BigInt(rating),
      comment: review,
      metadata: "0x",
    });
    const encodedTx = await encode(tx);
    return [
      {
        to: REVIEW_CONTRACT,
        data: encodedTx,
      },
    ];
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="underline text-xs"
      >
        Write Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Write a Review</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-2xl focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {star <= (hoverRating || rating) ? "★" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Write your review here..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <Transaction
                calls={getCalls()}
                onSuccess={() => {
                  handleSubmit();
                }}
              >
                <TransactionButton 
                  disabled={!rating || !review}
                  text="Submit"
                />
              </Transaction>
            </div>
          </div>
        </div>
      )}
    </>
  );
}