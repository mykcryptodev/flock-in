import { FC, useEffect, useMemo, useState } from "react";
import { getRequestsReceivedByAddress } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { CHAIN, CONTRACT } from "../constants";
import { createThirdwebClient, getContract } from "thirdweb";
import { Request } from "./Request";
import { SuggestedPaymentAmountsList } from "./SuggestedPaymentAmounts/List";
import { useUserAddress } from "../hooks/useUserAddress";
import { AddSuggestedPaymentAmount } from "./SuggestedPaymentAmounts/Add";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  refreshTrigger?: string | null;
}

export const RequestsCreatedForMe: FC<Props> = ({ refreshTrigger }) => {
  const { context } = useMiniKit();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof getRequestsReceivedByAddress>>>([]);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const userFid = useMemo(() => context?.user.fid ?? null, [context]);
  const {userAddress} = useUserAddress(userFid);
  const [showAddSuggestedPaymentAmount, setShowAddSuggestedPaymentAmount] = useState(false);
  useEffect(() => {
    const fetchRequests = async () => {
      if (!context) {
        return;
      }
      const requests = await getRequestsReceivedByAddress({
        contract: getContract({
          address: CONTRACT,
          client,
          chain: CHAIN,
        }),
        completer: userAddress ?? "",
      });
      const reversedRequests = [...requests].reverse();
      setRequests(reversedRequests);
    };
    fetchRequests();
  }, [context, lastSuccess, refreshTrigger]);

  const handleAddSuccess = () => {
    setShowAddSuggestedPaymentAmount(false);
    setLastSuccess(new Date().getTime().toString());
  }
  const handleRemoveSuccess = () => {
    setLastSuccess(new Date().getTime().toString());
  }

  return (
    <div className="flex flex-col gap-2">
      <div>My Suggested Rates</div>
      {userAddress && (
        <SuggestedPaymentAmountsList address={userAddress} onRemove={handleRemoveSuccess} />
      )}
      {showAddSuggestedPaymentAmount ? (
        <>
          <AddSuggestedPaymentAmount onSuccess={handleAddSuccess} />
          <button className="bg-gray-500 text-white p-2 rounded-md" onClick={() => setShowAddSuggestedPaymentAmount(false)}>Cancel</button>
        </>
      ) : (
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => setShowAddSuggestedPaymentAmount(true)}>Add Suggested Rate</button>
      )}
      <div>Requests Created For Me</div>
      {requests.length === 0 && (
        <div className="text-gray-500 text-sm">No requests created for you</div>
      )}
      <div>
        {requests.map((request) => (
          <Request key={request.id.toString()} request={request} onSuccess={() => setLastSuccess(new Date().getTime().toString())} />
        ))}
      </div>
    </div>
  )
};