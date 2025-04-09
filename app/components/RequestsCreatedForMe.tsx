import { FC, useEffect, useState } from "react";
import { getRequestsReceivedByFid } from "@/thirdweb/8453/0x2f530532213d5c1a8c80d7d69438751116ff6af1";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { CONTRACT } from "../constants";
import { createThirdwebClient, getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { CompleteRequest } from "./CompleteRequest";
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const RequestsCreatedForMe: FC = () => {
  const { context } = useMiniKit();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof getRequestsReceivedByFid>>>([]);

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
      setRequests(requests);
    };
    fetchRequests();
  }, [context]);


  return (
    <div className="flex flex-col gap-2">
      <div>Requests Created For Me</div>
      <div>
        {requests.map((request) => (
          <div key={request.id.toString()}>
            <CompleteRequest requestId={request.id.toString()} />
          </div>
        ))}
      </div>
    </div>
  )
};