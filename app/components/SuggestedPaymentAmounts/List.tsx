import { FC, useEffect } from "react";
import { getSuggestedAmountsByAddress } from "@/thirdweb/8453/0xf0af2c550b51f3e4fe1b7dcfd4ac8a7093f54b94";

import { createThirdwebClient, getContract, toTokens } from "thirdweb";
import { CHAIN, SUGGESTED_PAYMENT_AMOUNTS_CONTRACT } from "../../constants";
import { useState } from "react";
import { TokenName, TokenProvider, TokenSymbol } from "thirdweb/react";
import { TokenIcon } from "thirdweb/react";
import { useReadContract } from "thirdweb/react";
import { useAccount } from "wagmi";
import { Remove } from "./Remove";
import { isAddress, isAddressEqual } from "viem";
import { TokenImage } from "../Token/Image";
import Sparkle from "@/app/svg/Sparkle";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  address: string;
  onRemove?: () => void;
  showTitle?: boolean;
  message?: string;
  onClick?: (amount: bigint, token: string) => void;
  className?: string;
};

export const SuggestedPaymentAmountsList = ({ address, onRemove, showTitle, message, onClick, className }: Props) => {
  const { address: userAddress } = useAccount();
  const [userPreferredPaymentAmounts, setUserPreferredPaymentAmounts] = useState<{
    token: string;
    amount: bigint;
  }[]>([]);

  useEffect(() => {
    const fetchUserPreferredPaymentAmounts = async () => {
      const amounts = await getSuggestedAmountsByAddress({
        contract: getContract({
          client: client,
          chain: CHAIN,
          address: SUGGESTED_PAYMENT_AMOUNTS_CONTRACT,
        }),
        completer: address,
      });
      if (amounts.length > 0) {
        setUserPreferredPaymentAmounts(amounts.map((amount) => ({
          token: amount.token,
          amount: amount.amount,
        })));
      }
    };
    fetchUserPreferredPaymentAmounts();
  }, [address]);

  const TokenAmount: FC<{ amount: bigint, token: string }> = ({ amount, token }) => {
    const contract = getContract({
      client,
      address: token,
      chain: CHAIN,
    });
    const decimals = useReadContract({
      contract,
      method: "function decimals() public view returns (uint8)",
    });
    if (decimals.data) {
      return (
        <div>
          {Number(toTokens(amount, decimals.data)).toLocaleString()}
        </div>
      );
    }
    return null;
  };

  const getIcon = (token: string) => async () => {
    const response = await fetch(`/api/tokens/image?chain=${CHAIN}&address=${token}`);
    const data = await response.json();
    return data.image;
  };

  if (userPreferredPaymentAmounts.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showTitle && (
        <h2 className="text-sm flex items-center gap-2">
          <Sparkle />
          Suggested Payment Amounts
        </h2>
      )}
      {message && <p className="text-xs">{message}</p>}
      {userPreferredPaymentAmounts.map((amount, index) => (
        <div className="flex w-full justify-between items-center gap-2 bg-white p-3 rounded-md" key={`${amount.token}-${index}`}>
          <div onClick={() => onClick?.(amount.amount, amount.token)} className="flex gap-2 items-center w-full">
            <TokenProvider address={amount.token} client={client} chain={CHAIN}>
              <TokenIcon 
                className="w-10 h-10 rounded-full" 
                iconResolver={getIcon(amount.token)}
                fallbackComponent={<TokenImage token={amount.token} className="w-10 h-10 rounded-full" />} 
                loadingComponent={<div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />}
              />
              <div className="flex flex-col gap-1">
                <TokenSymbol />
              <TokenName />
              </div>
            </TokenProvider>
          </div>
          <div className="flex gap-2 items-center">
            <TokenAmount amount={amount.amount} token={amount.token} />
            {isAddress(address, { strict: false }) && isAddress(userAddress ?? "", { strict: false }) && isAddressEqual(address, userAddress ?? "") && (
              <Remove token={amount.token} onRemove={onRemove ?? (() => {})} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};