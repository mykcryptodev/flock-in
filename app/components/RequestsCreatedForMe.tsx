import { FC, useEffect, useState } from "react";
import { getRequestsReceivedByFid } from "@/thirdweb/8453/0x93f36b72db1dc47e3ad50e126d75b6d3a39c21d6";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { CHAIN, CONTRACT } from "../constants";
import { createThirdwebClient, getContract } from "thirdweb";
import { Request } from "./Request";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  refreshTrigger?: string | null;
}

export const RequestsCreatedForMe: FC<Props> = ({ refreshTrigger }) => {
  const { context } = useMiniKit();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof getRequestsReceivedByFid>>>([]);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  useEffect(() => {
    const fetchRequests = async () => {
      if (!context) {
        return;
      }
      const requests = await getRequestsReceivedByFid({
        contract: getContract({
          address: CONTRACT,
          client,
          chain: CHAIN,
        }),
        completerFid: BigInt(context.user.fid),
      });
      const reversedRequests = [...requests].reverse();
      setRequests(reversedRequests);
    };
    fetchRequests();
  }, [context, lastSuccess, refreshTrigger]);

  return (
    <div className="flex flex-col gap-2">
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