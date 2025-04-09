import { cancelRequest } from "@/thirdweb/8453/0x2f530532213d5c1a8c80d7d69438751116ff6af1";
import { FC } from "react";
import { encode, getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT } from "../constants";
import { base } from "thirdweb/chains";
import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  requestId: string;
}
export const CancelRequest: FC<Props> = ({ requestId }) => {
  const getCalls = async () => {
    const tx = cancelRequest({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: base,
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
    >
      <TransactionButton className="bg-red-500 text-white p-2 rounded-md" text="Cancel" />
    </Transaction>
  )
};
