import { useEffect, useState } from "react";
import { getUserAddress } from "@/app/utils/userAddress";

export function useUserAddress(fid: number | null) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  console.log({
    fid, userAddress, isLoading, error
  })

  useEffect(() => {
    const fetchAddress = async () => {
      if (!fid) {
        setUserAddress(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const address = await getUserAddress(fid);
        console.log({
          address
        })
        setUserAddress(address);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user address'));
        setUserAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [fid]);

  return { userAddress, isLoading, error };
} 