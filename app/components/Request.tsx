import { getRequestsReceivedByFid } from "@/thirdweb/8453/0xbe0463eee6e6b0c290ab6b310317a68829254546";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { FC, useEffect, useMemo, useState } from "react";
import { CancelRequest } from "./CancelRequest";
import { CompleteRequest } from "./CompleteRequest";
import { TOKEN_DECIMALS, TOKEN_SYMBOL } from "../constants";
import { toTokens } from "thirdweb";
// Define the user type based on Neynar API response
interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  // Add other fields as needed
}

type Props = {
  request: Awaited<ReturnType<typeof getRequestsReceivedByFid>>[number];
  onSuccess: () => void;
}

export const Request: FC<Props> = ({ request, onSuccess }) => {
  const { context } = useMiniKit();
  const [requesterUser, setRequesterUser] = useState<NeynarUser | null>(null);
  const [completerUser, setCompleterUser] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestCanBeCancelledByCurrentUser = useMemo(() => {
    const currentUserIsCompleter = context?.user.fid === Number(request.completerFid);
    const requestIsNotCompleted = !request.isCompleted;
    const requestIsNotCancelled = !request.isCancelled;
    return currentUserIsCompleter && requestIsNotCompleted && requestIsNotCancelled;
  }, [request.completerFid, context?.user.fid, request.isCompleted, request.isCancelled]);

  const requestCanBeCompletedByCurrentUser = useMemo(() => {
    const currentUserIsRequester = context?.user.fid === Number(request.requesterFid);
    const requestIsNotCompleted = !request.isCompleted;
    const requestIsNotCancelled = !request.isCancelled;
    return currentUserIsRequester && requestIsNotCompleted && requestIsNotCancelled;
  }, [request.requesterFid, context?.user.fid, request.isCompleted, request.isCancelled]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Create a comma-separated string of FIDs
        const fids = `${Number(request.requesterFid)},${Number(request.completerFid)}`;
        
        // Fetch user data from our API endpoint
        const response = await fetch(`/api/users/get?fids=${fids}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        
        // Find the requester and completer in the response
        const users = data.users || [];
        const requester = users.find((user: NeynarUser) => user.fid === Number(request.requesterFid));
        const completer = users.find((user: NeynarUser) => user.fid === Number(request.completerFid));
        
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
  }, [request.requesterFid, request.completerFid]);

  if (loading) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Convert bigint to number for display
  const amountInToken = toTokens(request.amount, TOKEN_DECIMALS);

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Requester section */}
        <div className="flex items-center space-x-2">
          {requesterUser?.pfp_url && (
            <img 
              src={requesterUser.pfp_url} 
              alt={requesterUser.username || 'Requester'} 
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">
              {requesterUser?.display_name || requesterUser?.username || `User ${request.requesterFid}`}
            </p>
            <p className="text-sm text-gray-500">
              Requested by {requesterUser?.username || `@user${request.requesterFid}`}
            </p>
          </div>
        </div>
        
        {/* Completer section */}
        <div className="flex items-center space-x-2">
          {completerUser?.pfp_url && (
            <img 
              src={completerUser.pfp_url} 
              alt={completerUser.username || 'Completer'} 
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">
              {completerUser?.display_name || completerUser?.username || `User ${request.completerFid}`}
            </p>
            <p className="text-sm text-gray-500">
              Requested for {completerUser?.username || `@user${request.completerFid}`}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-gray-700">{request.message || 'No message provided'}</p>
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-medium">
          Amount: {amountInToken} ${TOKEN_SYMBOL}
        </span>
        
        <div className="flex space-x-2">
          {requestCanBeCompletedByCurrentUser && (
            <CompleteRequest requestId={request.id.toString()} onSuccess={onSuccess} />
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
    </div>
  );
}