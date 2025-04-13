import { Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from "@coinbase/onchainkit/transaction";
import { FC, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { requestFlockIn } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { useUserStore } from "../store/userStore";
import { createThirdwebClient, encode, getContract, toTokens, ZERO_ADDRESS } from "thirdweb";
import { CHAIN, CONTRACT, USDC } from "../constants";
import { approve, getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { TokenPicker } from "./TokenPicker";
import { Token } from "@coinbase/onchainkit/token";
import { isAddress, parseUnits } from "viem";
import { SuggestedPaymentAmountsList } from "./SuggestedPaymentAmounts/List";
import { useReadContract } from "thirdweb/react";
import { sendFrameNotification } from "@/app/lib/notification-client";

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
  const [token, setToken] = useState<Token | null>(null);
  const [amountInput, setAmountInput] = useState<string>("");
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [requestId, setRequestId] = useState<string>("");
  const hasSeenSuccessRef = useRef(false);

  // Generate UUID only on client side
  useEffect(() => {
    setRequestId(crypto.randomUUID());
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setVideoDescription(text);
    }
  };

  const completerAddress = useMemo(() => {
    return selectedUser?.verified_addresses?.primary?.eth_address ?? selectedUser?.custody_address;
  }, [selectedUser]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    contract: getContract({
      address: token?.address ?? USDC,
      client,
      chain: CHAIN,
    }),
    method: "function allowance(address owner, address spender) public view returns (uint256)",
    params: [address ?? ZERO_ADDRESS, CONTRACT],
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    contract: getContract({
      address: token?.address ?? USDC,
      client,
      chain: CHAIN,
    }),
    method: "function balanceOf(address account) public view returns (uint256)",
    params: [address ?? ZERO_ADDRESS],
  });

  const approvalRequired = useMemo(() => {
    return allowance !== undefined && allowance < amount;
  }, [allowance, amount]);

  const getApprovalCalls = useCallback(async () => {
    if (!address || !token || !amount) {
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
  }, [address, token, amount]);

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
      amount,
    });
    const encodedTx = await encode(tx);
    return [
      {
        to: CONTRACT,
        data: encodedTx,
      },
    ];
  }, [selectedUser, videoDescription, completerAddress, token, amount]);

  // Function to send notification to the completer
  const sendNotification = useCallback(async () => {
    if (!completerAddress || !context?.user.username || !videoDescription || !selectedUser?.fid || !requestId) {
      return;
    }

    try {
      const result = await sendFrameNotification({
        fids: [selectedUser.fid],
        title: "New video request!",
        body: `${context.user.username} paid ${toTokens(amount, token?.decimals ?? 18)} ${token?.symbol} for a video from you`,
        uuid: requestId,
      });

      if (result.state === "error") {
        console.error('Failed to send notification:', result.error);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    } finally {
      // new request ID
      setRequestId(crypto.randomUUID());
    }
  }, [completerAddress, context?.user.username, videoDescription, selectedUser?.fid, amount, token, requestId]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!token) return;
    const value = e.target.value;
    if (value === '') {
      setAmount(BigInt(0));
      setAmountInput("");
    } else {
      setAmount(parseUnits(value, token.decimals));
      setAmountInput(value);
    }
  };

  const handleSuggestedPaymentAmountClick = async (amount: bigint, token: string) => {
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

  const isValidRequest = useMemo(() => {
    const amountIsGreaterThanZero = amount > BigInt(0);
    const tokenIsSet = !!token;
    const completerAddressIsSet = !!completerAddress;
    const addressIsSet = !!address;
    const allowanceIsGreaterThanAmount = allowance && allowance >= amount;
    return amountIsGreaterThanZero && tokenIsSet && completerAddressIsSet && addressIsSet && allowanceIsGreaterThanAmount;
  }, [amount, token, completerAddress, address, allowance]);

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
            refetchAllowance();
          }}
        >
          <TransactionToast>
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
          <TransactionButton className="bg-blue-500 text-white p-2 rounded-md mt-4" text="Approve" />
        </Transaction>
      )}

      {!approvalRequired && (
        <Transaction
          calls={getTxCalls}
          onStatus={(status) => {
            if (status.statusName === "success" && !hasSeenSuccessRef.current) {
              hasSeenSuccessRef.current = true;
              sendNotification();
              onSuccess();
            }
          }}
        >
          <TransactionToast>
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
          <TransactionButton
            className="bg-blue-500 text-white p-2 rounded-md mt-4"
            text="Request Video"
            disabled={!isValidRequest}
          />
        </Transaction>
      )}
      <div className="text-sm text-gray-500 mt-2 text-right">
        Your balance: {(token?.address && balance) ? toTokens(balance, token?.decimals ?? 18).toString() : "0"}
      </div>
    </div>
  );
};