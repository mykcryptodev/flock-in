import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { requestFlockIn } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { useUserStore } from "../store/userStore";
import { createThirdwebClient, encode, getContract, toTokens } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";
import { allowance, approve, balanceOf, getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { TokenPicker } from "./TokenPicker";
import { Token } from "@coinbase/onchainkit/token";
import { isAddress, parseUnits } from "viem";
import { SuggestedPaymentAmountsList } from "./SuggestedPaymentAmounts/List";

const MAX_CHARS = 300;

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  onSuccess: () => void;
}

export const CreateRequest: FC<Props> = ({ onSuccess }) => {
  const { address } = useAccount();
  const { selectedUser } = useUserStore();
  const { context } = useMiniKit();
  const [videoDescription, setVideoDescription] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [token, setToken] = useState<Token | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setVideoDescription(text);
    }
  };

  const completerAddress = useMemo(() => {
    return selectedUser?.verified_addresses?.primary?.eth_address ?? selectedUser?.custody_address;
  }, [selectedUser]);

  useEffect(() => {
    const checkApproval = async () => {
      if (!address || !token || approvalRequired) {
        return false;
      }
      const [allowanceAmount, balance] = await Promise.all([
        allowance({
          contract: getContract({
            address: token.address,
            client,
            chain: CHAIN,
          }),
          spender: CONTRACT,
          owner: address,
        }),
        balanceOf({
          contract: getContract({
            address: token.address,
            client,
            chain: CHAIN,
          }),
          address,
        }),
      ]);
      setBalance(balance);
      setApprovalRequired(allowanceAmount < amount);
    };
    checkApproval();
  }, [address, approvalRequired, amount, token]);

  const getApprovalCalls = useCallback(async () => {
    if (!address || !token) {
      return [];
    }
    const approvalTx = approve({
      contract: getContract({
        address: token.address as `0x${string}`,
        client,
        chain: CHAIN,
      }),
      amount: amount.toString(),
      spender: CONTRACT,
    });
    const encodedApprovalTx = await encode(approvalTx);
    return [
      {
        to: token.address as `0x${string}`,
        data: encodedApprovalTx,
      },
    ];
  }, [address, token]);

  const getTxCalls = useCallback(async () => {
    if (!completerAddress || !token || !amount) {
      return [];
    }
    const tx = requestFlockIn({
      contract: getContract({
        address: CONTRACT,
        client,
        chain: CHAIN,
      }),
      completer: completerAddress,
      message: videoDescription,
      token: token.address,
      amount: amount,
    });
    const encodedTx = await encode(tx);
    return [
      {
        to: CONTRACT,
        data: encodedTx,
      },
    ];
  }, [selectedUser, videoDescription]);

  // Function to send notification to the completer
  const sendNotification = useCallback(async () => {
    if (!completerAddress || !context?.user.username || !videoDescription) {
      return;
    }

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completerAddress,
          requesterUsername: context.user.username,
          message: videoDescription,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [selectedUser, context, videoDescription]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setAmount(BigInt(0));
      setAmountInput("");
    } else {
      setAmount(parseUnits(value, token?.decimals ?? 18));
      setAmountInput(value);
    }
  };

  const handleSuggestedPaymentAmountClick = async (amount: bigint, token: string) => {
    console.log("clicked", amount, token);
    const tokenContract = getContract({
      address: token,
      client,
      chain: CHAIN,
    });
    const currencyMetadata = await getCurrencyMetadata({
      contract: tokenContract,
    });
    setToken({
      address: token,
      chainId: CHAIN.id,
      decimals: currencyMetadata.decimals,
      image: "",
      name: currencyMetadata.name,
      symbol: currencyMetadata.symbol,
    });
    setAmount(amount);
    setAmountInput(toTokens(amount, currencyMetadata.decimals).toString());
  }; 

  return (
    <div>
      <h1>Describe Your Video Request</h1>
      <textarea
        value={videoDescription}
        onChange={handleDescriptionChange}
        placeholder={`Describe what you want to see (max ${MAX_CHARS} characters)`}
        className="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="text-sm text-gray-500 mb-2 text-right">
        {videoDescription.length}/{MAX_CHARS} characters
      </div>
      <h1>Select a Payment Token</h1>
      {completerAddress && isAddress(completerAddress, { strict: false }) && (
        <SuggestedPaymentAmountsList 
          address={completerAddress} 
          onClick={handleSuggestedPaymentAmountClick} 
          showTitle={true}
          className="flex flex-col gap-2 p-4 bg-gray-300 rounded-md"
          message={`${selectedUser?.display_name ?? selectedUser?.username} suggests these prices for requests`}
        /> 
      )}
      <div className="my-2">
        <TokenPicker selectedToken={token} onTokenChange={setToken} />
      </div>
      {token && (
        <input 
          type="number" 
          value={amountInput} 
          disabled={!token}
          onChange={handleAmountChange} 
          placeholder={`Enter amount ${token?.symbol ? `in ${token.symbol}` : ""}`}
          className="text-center w-full my-2 p-2 bg-white border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
      )}
      {approvalRequired && (
        <Transaction
          calls={getApprovalCalls}
          onSuccess={() => {
            setApprovalRequired(false);
          }}
        >
          <TransactionButton className="bg-blue-500 text-white p-2 rounded-md mt-4" text="Approve" />
        </Transaction>
      )}

      {!approvalRequired && (
        <Transaction
          calls={getTxCalls}
          onSuccess={() => {
            // Send notification after successful request creation
            sendNotification();
            onSuccess();
          }}
        >
          <TransactionButton
            className="bg-blue-500 text-white p-2 rounded-md mt-4"
            text="Request Video"
            disabled={!selectedUser}
          />
        </Transaction>
      )}
      <div className="text-sm text-gray-500 mt-2 text-right">
        Your balance: {toTokens(balance, token?.decimals ?? 18).toString()}
      </div>
    </div>
  );
};