import { completeRequest } from "@/thirdweb/8453/0xbe0463eee6e6b0c290ab6b310317a68829254546";
import { Transaction } from "@coinbase/onchainkit/transaction";
import { TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC } from "react";
import { createThirdwebClient, encode, getContract } from "thirdweb";
import { CONTRACT } from "../constants";
import { base } from "thirdweb/chains";

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
      onSuccess={onSuccess}
    >
      <TransactionButton className="bg-green-500 text-white p-2 rounded-md" text="Complete" />
    </Transaction>
  )
};