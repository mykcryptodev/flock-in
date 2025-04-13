import { completeRequest } from "@/thirdweb/8453/0x298688df47fa6ab1e4479f60474d16ad7c37d024";
import { Transaction, TransactionToastAction, TransactionToastLabel, TransactionToast, TransactionToastIcon } from "@coinbase/onchainkit/transaction";
import { TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useCallback, useRef, useState, useEffect } from "react";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { toast } from "react-toastify";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
  requesterAddress: string;
  onSuccess: () => void;
}

export const CompleteRequest: FC<Props> = ({ requestId, requesterAddress, onSuccess }) => {
  const { context } = useMiniKit();
  const [notificationId, setNotificationId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofLink, setProofLink] = useState("");
  const hasSeenSuccessRef = useRef(false);
  const notificationInProgressRef = useRef(false);

  // Reset success ref when component mounts or requestId changes
  useEffect(() => {
    hasSeenSuccessRef.current = false;
    notificationInProgressRef.current = false;
    const newId = crypto.randomUUID();
    setNotificationId(newId);
  }, [requestId]);

  const sendCompletionNotification = useCallback(async () => {
    // Validate all required data is present
    if (!context?.user.username || !notificationId || !requesterAddress) {
      return false;
    }

    // Don't send if we've already seen success or notification is in progress
    if (hasSeenSuccessRef.current || notificationInProgressRef.current) {
      return false;
    }

    notificationInProgressRef.current = true;

    try {
      const response = await fetch('/api/notifications/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requesterAddress,
          completerUsername: context.user.username,
          uuid: notificationId,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to send completion notification');
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    } finally {
      notificationInProgressRef.current = false;
    }
  }, [context, requesterAddress, notificationId]);

  const getCalls = async () => {
    const tx = completeRequest({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: CHAIN,
      }),
      requestId: BigInt(requestId),
      completionProof: proofLink,
    });
    const encodedTx = await encode(tx);
    return [
      {
        to: CONTRACT,
        data: encodedTx,
      },
    ];
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        Complete
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Complete Request</h2>
            
            <div className="mb-4 flex flex-col w-full">
              <span className="text-sm text-gray-500 mb-2">
                Optionally include a link to the video. This helps other users know that you completed the request.
              </span>
              <input
                type="text"
                value={proofLink}
                onChange={(e) => setProofLink(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional link to your video"
              />
              <span className="text-xs text-gray-500 text-right w-full my-2">
                You can add this later.
              </span>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <Transaction
                calls={getCalls}
                onStatus={(status) => {
                  if (status.statusName === "success") {
                    sendCompletionNotification();
                    onSuccess();
                    setIsModalOpen(false);
                  }
                }}
              >
                <TransactionToast>
                  <TransactionToastIcon />
                  <TransactionToastLabel />
                  <TransactionToastAction />
                </TransactionToast>
                <TransactionButton 
                  className="bg-green-500 text-white p-2 rounded-md" 
                  text="Complete" 
                />
              </Transaction>
            </div>
          </div>
        </div>
      )}
    </>
  )
};