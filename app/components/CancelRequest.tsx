import { cancelRequest } from "@/thirdweb/8453/0x93f36b72db1dc47e3ad50e126d75b6d3a39c21d6";
import { FC } from "react";
import { encode, getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";
import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {  
  requestId: string;
  onSuccess: () => void;
}
export const CancelRequest: FC<Props> = ({ requestId, onSuccess }) => {
  const getCalls = async () => {
    const tx = cancelRequest({
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
      <TransactionButton className="bg-red-500 text-white p-2 rounded-md" text="Cancel" />
    </Transaction>
  )
};
