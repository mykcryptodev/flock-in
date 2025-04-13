import { encode, getContract, toUnits } from "thirdweb";
import { FC, useCallback, useState } from "react";
import { addSuggestedAmount } from "@/thirdweb/8453/0xf0af2c550b51f3e4fe1b7dcfd4ac8a7093f54b94";
import { createThirdwebClient } from "thirdweb";
import { SUGGESTED_PAYMENT_AMOUNTS_CONTRACT } from "@/app/constants";
import { CHAIN } from "@/app/constants";
import { Token } from "@coinbase/onchainkit/token";
import { TokenPicker } from "../TokenPicker";
import { Transaction, TransactionButton, TransactionToastAction, TransactionToastLabel, TransactionToast, TransactionToastIcon } from "@coinbase/onchainkit/transaction";
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  onSuccess: () => void;
}

export const AddSuggestedPaymentAmount: FC<Props> = ({ onSuccess }) => {
  const [token, setToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>("");

  const getAddCalls = useCallback(async () => {
    if (!token || !amount) {
      return [];
    }
    const tx = addSuggestedAmount({
      contract: getContract({
        address: SUGGESTED_PAYMENT_AMOUNTS_CONTRACT,
        client,
        chain: CHAIN,
      }),
      token: token.address,
      amount: toUnits(amount, token.decimals),
    });
    const encodedTx = await encode(tx);
    return [{
      to: SUGGESTED_PAYMENT_AMOUNTS_CONTRACT,
      data: encodedTx,
    }];
  }, [token, amount]);

  return (
    <div>
      <h1>Add Suggested Payment Amount</h1>
      <TokenPicker selectedToken={token} onTokenChange={setToken} />
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        className="w-full my-2 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <Transaction calls={getAddCalls} onSuccess={onSuccess}>
        <TransactionToast>
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </TransactionToast>
        <TransactionButton className="bg-blue-500 text-white p-2 rounded-md" text="Add" />
      </Transaction>
    </div>
  );
};