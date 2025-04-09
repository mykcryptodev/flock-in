import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useCallback, useEffect, useState } from "react";
import { REQUEST_AMOUNT, requestFlockIn } from "@/thirdweb/8453/0x93f36b72db1dc47e3ad50e126d75b6d3a39c21d6";
import { useUserStore } from "../store/userStore";
import { createThirdwebClient, encode, getContract, toTokens } from "thirdweb";
import { CHAIN, CONTRACT, TOKEN, TOKEN_DECIMALS } from "../constants";
import { allowance, approve, balanceOf } from "thirdweb/extensions/erc20";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

const MAX_CHARS = 300;

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  onSuccess: () => void;
}

export const CreateRequest: FC<Props> = ({ onSuccess }) => {
  const { address } = useAccount();
  const { selectedUser } = useUserStore();
  const { context } = useMiniKit();
  const [videoDescription, setVideoDescription] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setVideoDescription(text);
    }
  };

  useEffect(() => {
    const checkApproval = async () => {
      if (!address || approvalRequired) {
        return false;
      }
      const requestAmount = await REQUEST_AMOUNT({
        contract: getContract({
          address: CONTRACT,
          client,
          chain: CHAIN,
        }),
      });
      const [allowanceAmount, balance] = await Promise.all([
        allowance({
          contract: getContract({
            address: TOKEN,
            client,
            chain: CHAIN,
          }),
          spender: CONTRACT,
          owner: address,
        }),
        balanceOf({
          contract: getContract({
            address: TOKEN,
            client,
            chain: CHAIN,
          }),
          address,
        }),
      ]);
      setBalance(balance);
      setApprovalRequired(allowanceAmount < requestAmount);
    };
    checkApproval();
  }, [address, approvalRequired]);

  const getApprovalCalls = useCallback(async () => {
    if (!address) {
      return [];
    }
    const requestAmount = await REQUEST_AMOUNT({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: CHAIN,
      }),
    });
    const approvalTx = approve({
      contract: getContract({
        address: TOKEN,
        client,
        chain: CHAIN,
      }),
      amount: requestAmount.toString(),
      spender: CONTRACT,
    });
    const encodedApprovalTx = await encode(approvalTx);
    return [
      {
        to: TOKEN,
        data: encodedApprovalTx,
      },
    ];
  }, [address]);

  const getTxCalls = useCallback(async () => {
    const completerAddress = selectedUser?.verified_addresses?.primary?.eth_address ?? selectedUser?.custody_address;
    const requesterFid = context?.user.fid;
    const completerFid = selectedUser?.fid;
    if (!completerAddress || !requesterFid || !completerFid) {
      return [];
    }
    const tx = requestFlockIn({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: CHAIN,
      }),
      requesterFid: BigInt(requesterFid),
      completer: completerAddress,
      completerFid: BigInt(completerFid),
      message: videoDescription,
    });
    const encodedTx = await encode(tx);
    return [
      {
        to: CONTRACT,
        data: encodedTx,
      },
    ];
  }, [selectedUser, context, videoDescription]);

  // Function to send notification to the completer
  const sendNotification = useCallback(async () => {
    if (!selectedUser?.fid || !context?.user.username || !videoDescription) {
      return;
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completerFid: selectedUser.fid,
          requesterUsername: context.user.username,
          message: videoDescription,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [selectedUser, context, videoDescription]);

  return (
    <div>
      <h1>Describe Your Video Request</h1>
      <textarea
        value={videoDescription}
        onChange={handleDescriptionChange}
        placeholder={`Describe what you want to see (max ${MAX_CHARS} characters)`}
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="text-sm text-gray-500 mb-2 text-right">
        {videoDescription.length}/{MAX_CHARS} characters
      </div>
      {approvalRequired && (
        <Transaction
          calls={getApprovalCalls}
          onSuccess={() => {
            setApprovalRequired(false);
          }}
        >
          <TransactionButton className="bg-blue-500 text-white p-2 rounded-md" text="Approve" />
        </Transaction>
      )}

      {!approvalRequired && (
        <Transaction
          calls={getTxCalls}
          onSuccess={() => {
            // Send notification after successful request creation
            sendNotification();
            onSuccess();
          }}
        >
          <TransactionButton
            className="bg-blue-500 text-white p-2 rounded-md"
            text="Request Video"
            disabled={!selectedUser}
          />
        </Transaction>
      )}
      <div className="text-sm text-gray-500 mt-2 text-right">
        Your balance: {toTokens(balance, TOKEN_DECIMALS).toString()}
      </div>
    </div>
  );
};