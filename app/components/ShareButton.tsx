import { FC } from "react";
import { useMiniKit, useOpenUrl } from "@coinbase/onchainkit/minikit";

export const ShareButton: FC = () => {
  const { context } = useMiniKit();
  const openUrl = useOpenUrl();
  if (!context) return null;

  const appUrl = window.location.origin;
  const shareUrl = `${appUrl}?fid=${context.user.fid}`;
  const warpcastUrl = `https://warpcast.com/~/compose?text=Request%20a%20video%20from%20me%20on%20Flock%20In!%20${encodeURIComponent(shareUrl)}`;

  return (
    <button 
      className="px-2 py-1 flex justify-start rounded-2xl font-semibold opacity-70 border border-blue-500 text-blue-500 text-xs"
      onClick={() => openUrl(warpcastUrl)}
    >
      Share My Flock In Link
    </button>
  );
}; 