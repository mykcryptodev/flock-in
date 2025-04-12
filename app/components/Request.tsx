import { getRequestsReceivedByAddress } from "@/thirdweb/8453/0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6";
import { FC, useEffect, useMemo, useState } from "react";
import { CancelRequest } from "./CancelRequest";
import { CompleteRequest } from "./CompleteRequest";
import { toTokens } from "thirdweb";
import { Review } from "./Review";
import { useAccount } from "wagmi";
import { isAddressEqual } from "viem";
import { useReadContract } from "thirdweb/react";
import { CHAIN } from "../constants";
import { getContract } from "thirdweb/contract";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

interface NeynarUser {
  address: string;
  username: string;
  display_name: string;
  pfp_url: string;
}

type Props = {
  request: Awaited<ReturnType<typeof getRequestsReceivedByAddress>>[number];
  onSuccess: () => void;
}

export const Request: FC<Props> = ({ request, onSuccess }) => {
  const { address } = useAccount();
  const [requesterUser, setRequesterUser] = useState<NeynarUser | null>(null);
  const [completerUser, setCompleterUser] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestCanBeCancelledByCurrentUser = useMemo(() => {
    const currentUserIsCompleter = isAddressEqual(address ?? '', request.completer);
    const currentUserIsRequester = isAddressEqual(address ?? '', request.requester);
    const requestIsNotCompleted = !request.isCompleted;
    const requestIsNotCancelled = !request.isCancelled;
    return (currentUserIsCompleter || currentUserIsRequester) && requestIsNotCompleted && requestIsNotCancelled;
  }, [request.completer, address, request.isCompleted, request.isCancelled]);

  const requestCanBeCompletedByCurrentUser = useMemo(() => {
    const currentUserIsRequester = isAddressEqual(address ?? '', request.requester);
    const requestIsNotCompleted = !request.isCompleted;
    const requestIsNotCancelled = !request.isCancelled;
    return currentUserIsRequester && requestIsNotCompleted && requestIsNotCancelled;
  }, [address, request]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Create a comma-separated string of addresses
        const addresses = `${request.requester},${request.completer}`;
        
        // Fetch user data from our API endpoint
        const response = await fetch(`/api/users/get-by-address?addresses=${addresses}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        // Find the requester and completer in the response
        const users = data.users || [];
        const requester = users.find((user: NeynarUser) => isAddressEqual(user.address, request.requester));
        const completer = users.find((user: NeynarUser) => isAddressEqual(user.address, request.completer));
        
        setRequesterUser(requester || null);
        setCompleterUser(completer || null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [request.requester, request.completer]);

  const tokenContract = getContract({
    client,
    address: request.token,
    chain: CHAIN,
  });
  const { data: decimals } = useReadContract({
    contract: tokenContract,
    method: "function decimals() public view returns (uint8)",
  });
  const { data: symbol } = useReadContract({
    contract: tokenContract,
    method: "function symbol() public view returns (string)",
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Convert bigint to number for display
  const amountInToken = toTokens(request.amount, decimals ?? 18);

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Requester section */}
        <div className="flex items-center space-x-2">
          {requesterUser?.pfp_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={requesterUser.pfp_url} 
              alt={requesterUser.username || 'Requester'} 
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">
              {requesterUser?.display_name || requesterUser?.username || `User ${request.requester}`}
            </p>
            <p className="text-sm text-gray-500">
              Requested by {requesterUser?.username || `@user${request.requester}`}
            </p>
          </div>
        </div>
        
        {/* Completer section */}
        <div className="flex items-center space-x-2">
          {completerUser?.pfp_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={completerUser.pfp_url} 
              alt={completerUser.username || 'Completer'} 
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">
              {completerUser?.display_name || completerUser?.username || `User ${request.completer}`}
            </p>
            <p className="text-sm text-gray-500">
              Requested for {completerUser?.username || `@user${request.completer}`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-gray-700">{request.message || 'No message provided'}</p>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium">
          Amount: {amountInToken} {symbol ?? ''}
        </span>
        
        <div className="flex space-x-2">
          {requestCanBeCompletedByCurrentUser && (
            <CompleteRequest 
              requestId={request.id.toString()} 
              requester={request.requester}
              onSuccess={onSuccess} 
            />
          )}
          {requestCanBeCancelledByCurrentUser && (
            <CancelRequest requestId={request.id.toString()} onSuccess={onSuccess} />
          )}
          
          {request.isCompleted && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
              Completed
            </span>
          )}
          
          {request.isCancelled && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded">
              Cancelled
            </span>
          )}
        </div>
      </div>
      <div className="mt-1">
        <Review 
          requestId={request.id.toString()} 
          requester={request.requester}
          completer={request.completer}
        />
      </div>
    </div>
  );
}