"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { Name, Identity, Badge } from "@coinbase/onchainkit/identity";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import Check from "./svg/Check";
import { UserSearch } from "./components/UserSearch";
import { CreateRequest } from "./components/CreateRequest";
import connector from "@farcaster/frame-wagmi-connector";
import { RequestsCreatedByMe } from "./components/RequestsCreatedByMe";
import { RequestsCreatedForMe } from "./components/RequestsCreatedForMe";

const SCHEMA_UID =
  "0x7889a09fb295b0a0c63a3d7903c4f00f7896cca4fa64d2c1313f8547390b7d39";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const { address } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    if (context && !address) {
      connect({ connector: connector() });
    }
  }, [context, connect, address]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame, setFrameAdded]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          type="button"
          onClick={handleAddFrame}
          className="cursor-pointer bg-transparent font-semibold text-sm"
        >
          + SAVE FRAME
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-semibold animate-fade-out">
          <Check />
          <span>SAVED</span>
        </div>
      );
    }

    return null;
  }, [context, handleAddFrame, frameAdded]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#E5E5E5] text-black snake-dark">
      <div className="w-full max-w-[520px] mx-auto flex flex-col h-full">
        <header className="flex justify-between items-center p-4">
          <div className="justify-start">
            {address ? (
              <Identity
                address={address}
                schemaId={SCHEMA_UID}
                className="!bg-inherit p-0 [&>div]:space-x-2"
              >
                <Name className="text-inherit">
                  <Badge
                    tooltip="High Scorer"
                    className="!bg-inherit high-score-badge"
                  />
                </Name>
              </Identity>
            ) : (
              <div className="text-gray-500 text-sm font-semibold">
                Connecting...
              </div>
            )}
          </div>
          <div className="justify-end">{saveFrameButton}</div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-20">
          <div className="flex flex-col gap-4">
            <UserSearch />          
            <CreateRequest onSuccess={() => setLastSuccess(new Date().getTime().toString())} />
            <RequestsCreatedByMe refreshTrigger={lastSuccess} />
            <RequestsCreatedForMe refreshTrigger={lastSuccess} />
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-center p-4 bg-[#E5E5E5]">
          <button
            type="button"
            className="px-2 py-1 flex justify-start rounded-2xl font-semibold opacity-40 border border-black text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  );
}
