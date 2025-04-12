import { cancelRequest } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { FC } from "react";
import { encode, getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";
import { Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from "@coinbase/onchainkit/transaction";

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
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
      <TransactionButton className="bg-red-500 text-white p-2 rounded-md" text="Cancel" />
    </Transaction>
  )
};
