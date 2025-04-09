import { getRequestsMadeByFid } from "@/thirdweb/8453/0xbe0463eee6e6b0c290ab6b310317a68829254546";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { FC, useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT } from "../constants";
import { base } from "thirdweb/chains";
import { Request } from "./Request";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const RequestsCreatedByMe: FC = () => {
  const { context } = useMiniKit();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof getRequestsMadeByFid>>>([]);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!context) {
        return;
      }
      const requests = await getRequestsMadeByFid({
        contract: getContract({
          address: CONTRACT,
          client,
          chain: base,
        }),
        requesterFid: BigInt(context.user.fid),
      });
      const reversedRequests = [...requests].reverse();
      setRequests(reversedRequests);
    };
    fetchRequests();
  }, [context, lastSuccess]);

  return (
    <div className="flex flex-col gap-2">
      <div>Requests I Made</div>
      {requests.length === 0 && (
        <div className="text-gray-500 text-sm">No requests made</div>
      )}
      {requests.map((request) => (
        <div key={request.id.toString()}>
          <Request key={request.id.toString()} request={request} onSuccess={() => setLastSuccess(new Date().getTime().toString())} />
        </div>
      ))}
    </div>
  );
};