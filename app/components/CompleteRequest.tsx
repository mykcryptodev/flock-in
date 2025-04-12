import { completeRequest } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { Transaction } from "@coinbase/onchainkit/transaction";
import { TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useCallback } from "react";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
  requester: string;
  onSuccess: () => void;
}

export const CompleteRequest: FC<Props> = ({ requestId, requester, onSuccess }) => {
  const { context } = useMiniKit();

  const sendCompletionNotification = useCallback(async () => {
    if (!context?.user.username) {
      return;
    }

    try {
      const response = await fetch('/api/notifications/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requester,
          completerUsername: context.user.username,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send completion notification');
      }
    } catch (error) {
      console.error('Error sending completion notification:', error);
    }
  }, [context, requester]);

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
      onSuccess={() => {
        // Send notification after successful completion
        sendCompletionNotification();
        onSuccess();
      }}
    >
      <TransactionButton className="bg-green-500 text-white p-2 rounded-md" text="Complete" />
    </Transaction>
  )
};