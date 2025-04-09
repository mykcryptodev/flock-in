import { getRequestsMadeByFid } from "@/thirdweb/8453/0x2f530532213d5c1a8c80d7d69438751116ff6af1";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { FC, useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT } from "../constants";
import { base } from "thirdweb/chains";
import { CancelRequest } from "./CancelRequest";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const RequestsCreatedByMe: FC = () => {
  const { context } = useMiniKit();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof getRequestsMadeByFid>>>([]);

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
      setRequests(requests);
    };
    fetchRequests();
  }, [context]);

  return (
    <div className="flex flex-col gap-2">
      <div>Requests I Made</div>
      {requests.map((request) => (
        <div key={request.id.toString()}>
          <CancelRequest requestId={request.id.toString()} />
        </div>
      ))}
    </div>
  );
};