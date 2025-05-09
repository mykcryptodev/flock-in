import { removeSuggestedAmount } from "@/thirdweb/8453/0x72503a680c540fb3500561aaa288deb939a24b20";
import { Transaction, TransactionButton, TransactionToastAction, TransactionToast, TransactionToastIcon, TransactionToastLabel } from "@coinbase/onchainkit/transaction";
import { FC, useCallback } from "react";
import { getContract } from "thirdweb/contract";
import { encode } from "thirdweb/transaction";
import { CHAIN, SUGGESTED_PAYMENT_AMOUNTS_CONTRACT } from "@/app/constants";
import { createThirdwebClient } from "thirdweb";
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  token: string;
  onRemove: () => void;
}

export const Remove: FC<Props> = ({ token, onRemove }) => {
  const getRemoveCalls = useCallback(async () => {
    if (!token) {
      return [];
    }
    const tx = removeSuggestedAmount({
      contract: getContract({
        address: SUGGESTED_PAYMENT_AMOUNTS_CONTRACT,
        client,
        chain: CHAIN,
      }),
      token,
    });
    const encodedTx = await encode(tx);
    return [{
      to: SUGGESTED_PAYMENT_AMOUNTS_CONTRACT,
      data: encodedTx,
    }];
  }, [token]);

  return (
    <Transaction 
      calls={getRemoveCalls}
      onSuccess={onRemove}
    >
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
      <TransactionButton className="text-red-500 p-2 rounded-md w-fit bg-transparent" text={"x"} />
    </Transaction>
  )
}