import { getRequestsMadeByAddress } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { FC, useEffect, useState } from "react";
import { getContract } from "thirdweb";
import { createThirdwebClient } from "thirdweb";
import { CHAIN, CONTRACT } from "../constants";
import { Request } from "./Request";
import { useAccount } from "wagmi";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  refreshTrigger?: string | null;
}

export const RequestsCreatedByMe: FC<Props> = ({ refreshTrigger }) => {
  const { address } = useAccount();
  const [requests, setRequests] = useState<Awaited<ReturnType<typeof getRequestsMadeByAddress>>>([]);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!address) {
        return;
      }
      const requests = await getRequestsMadeByAddress({
        contract: getContract({
          address: CONTRACT,
          client,
          chain: CHAIN,
        }),
        requester: address,
      });
      const reversedRequests = [...requests].reverse();
      setRequests(reversedRequests);
    };
    fetchRequests();
  }, [address, lastSuccess, refreshTrigger]);

  return (
    <div className="flex flex-col gap-2">
      <div>Requests I Made</div>
      {requests.length === 0 && (
        <div className="text-gray-500 text-sm">No requests made</div>
      )}
      {requests.map((request) => (
        <div key={request.id.toString()}>
          <Request 
            key={request.id.toString()} 
            request={request} 
            onSuccess={() => setLastSuccess(new Date().getTime().toString())} 
            hideRequester={true}
          />
        </div>
      ))}
    </div>
  );
};