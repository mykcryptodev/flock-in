import { completeRequest } from "@/thirdweb/8453/0x93f36b72db1dc47e3ad50e126d75b6d3a39c21d6";
import { Transaction } from "@coinbase/onchainkit/transaction";
import { TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC } from "react";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
  onSuccess: () => void;
}
export const CompleteRequest: FC<Props> = ({ requestId, onSuccess }) => {
  const getCalls = async () => {
    const tx = completeRequest({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: CHAIN,
      }),
      requestId: BigInt(requestId),
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
      onSuccess={onSuccess}
    >
      <TransactionButton className="bg-green-500 text-white p-2 rounded-md" text="Complete" />
    </Transaction>
  )
};