import { completeRequest } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
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
      completionProof: "",
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
    <Transaction
      calls={getCalls}
      onStatus={(status) => {
        console.log('Transaction status:', status.statusName);
        if (status.statusName === "success") {
          sendCompletionNotification();
          onSuccess();
        }
      }}
    >
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
      <TransactionButton className="bg-green-500 text-white p-2 rounded-md" text="Complete" />
    </Transaction>
  )
};