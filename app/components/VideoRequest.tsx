import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useCallback, useState } from "react";
import { requestFlockIn } from "@/thirdweb/8453/0x6a89bdbe3599ffde6c7e98549d736171c7f8c82f";
import { useUserStore } from "../store/userStore";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { CONTRACT } from "../constants";
import { base } from "thirdweb/chains";

const MAX_CHARS = 300;

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const VideoRequest: FC = () => {
  const { selectedUser } = useUserStore();
  const [videoDescription, setVideoDescription] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setVideoDescription(text);
    }
  };

  const getCalls = useCallback(async () => {
    const completerAddress = selectedUser?.verified_addresses?.primary?.eth_address ?? selectedUser?.custody_address;
    if (!completerAddress) {
      return [];
    }
    const tx = requestFlockIn({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: base,
      }),
      requesterFid: BigInt(selectedUser?.fid ?? 0),
      completer: completerAddress,
      completerFid: BigInt(selectedUser?.fid ?? 0),
    });
    const encoded = await encode(tx);
    return [{
      to: CONTRACT as `0x${string}`,
      data: encoded,
    }];
  }, [selectedUser]);

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

      <Transaction
        calls={getCalls}
      >
        <TransactionButton
          className="bg-blue-500 text-white p-2 rounded-md"
          text="Request Video"
        />
      </Transaction>

    </div>
  );
};