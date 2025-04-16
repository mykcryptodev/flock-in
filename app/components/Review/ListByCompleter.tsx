import { ReviewerInfo } from "@/app/api/reviews/route";
import { useUserStore } from "@/app/store/userStore";
import { FC, useEffect, useState } from "react";

interface Review {
  id: string;
  requestId: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  revieweeComment: string;
  reviewCreatedBeforeCompletion: boolean;
  reviewerInfo: ReviewerInfo;
}

export const ReviewListByCompleter: FC = () => {
  const { selectedUser } = useUserStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviews([]);
      if (!selectedUser) {
        setIsLoading(false);
        return;
      }
      
      const address = selectedUser.verified_addresses?.primary?.eth_address ?? selectedUser.custody_address;
      if (!address) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/reviews?address=${address}`);
        const data = await response.json();
        setReviews(data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [selectedUser]);

  if (!selectedUser) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1>Reviews of {selectedUser.display_name ?? selectedUser.username}</h1>
        <span className="text-sm text-gray-500">See what others have said about requests they made for {selectedUser.display_name ?? selectedUser.username}</span>
      </div>

      {isLoading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-gray-500">No reviews yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {review.reviewerInfo?.pfp_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={review.reviewerInfo.pfp_url} 
                      alt={`${review.reviewerInfo.display_name}'s profile`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {review.reviewerInfo?.display_name || review.reviewerInfo?.username || 'Anonymous'}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            {i < review.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {review.reviewCreatedBeforeCompletion && (
                <div className="text-xs text-gray-500 mt-2">
                  Review written before request completion
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
