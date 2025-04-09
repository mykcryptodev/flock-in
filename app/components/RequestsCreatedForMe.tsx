import { FC, useEffect, useState } from "react";
import { getRequestsReceivedByFid } from "@/thirdweb/8453/0xbe0463eee6e6b0c290ab6b310317a68829254546";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { CONTRACT } from "../constants";
import { createThirdwebClient, getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { Request } from "./Request";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const RequestsCreatedForMe: FC = () => {
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
          chain: base,
        }),
        completerFid: BigInt(context.user.fid),
      });
      const reversedRequests = [...requests].reverse();
      setRequests(reversedRequests);
    };
    fetchRequests();
  }, [context, lastSuccess]);

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