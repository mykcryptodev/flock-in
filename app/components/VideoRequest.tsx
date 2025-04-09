import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useCallback, useEffect, useState } from "react";
import { REQUEST_AMOUNT, requestFlockIn } from "@/thirdweb/8453/0x2f530532213d5c1a8c80d7d69438751116ff6af1";
import { useUserStore } from "../store/userStore";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { CONTRACT, TOKEN } from "../constants";
import { base } from "thirdweb/chains";
import { allowance, approve, balanceOf } from "thirdweb/extensions/erc20";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

const MAX_CHARS = 300;

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const VideoRequest: FC = () => {
  const { address } = useAccount();
  const { selectedUser } = useUserStore();
  const { context } = useMiniKit();
  const [videoDescription, setVideoDescription] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [allowanceAmount, setAllowanceAmount] = useState<bigint>(BigInt(0));
  const [requestAmount, setRequestAmount] = useState<bigint>(BigInt(0));
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
          chain: base,
        }),
      });
      setRequestAmount(requestAmount);
      const [allowanceAmount, balance] = await Promise.all([
        allowance({
          contract: getContract({
            address: TOKEN,
            client,
            chain: base,
          }),
          spender: CONTRACT,
          owner: address,
        }),
        balanceOf({
          contract: getContract({
            address: TOKEN,
            client,
            chain: base,
          }),
          address,
        }),
      ]);
      setApprovalRequired(allowanceAmount < requestAmount);
      setAllowanceAmount(allowanceAmount);
      setBalance(balance);
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
        chain: base,
      }),
    });
    const approvalTx = approve({
      contract: getContract({
        address: TOKEN,
        client,
        chain: base,
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
        chain: base,
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

  return (
    <div>
      <h1>Video Request</h1>
      <textarea
        value={videoDescription}
        onChange={handleDescriptionChange}
        placeholder="Describe what you want to see (max 1000 characters)"
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="text-sm text-gray-500 mt-1">
        {videoDescription.length}/{MAX_CHARS} characters
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500 mt-1">
        <div>
          {allowanceAmount.toString()}
        </div>
        <div>
          {requestAmount.toString()}
        </div>
        <div>
          {balance.toString()}
        </div>
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
        >
          <TransactionButton
            className="bg-blue-500 text-white p-2 rounded-md"
            text="Request Video"
          />
        </Transaction>
      )}
    </div>
  );
};