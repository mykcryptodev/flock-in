"use client";

import {
  useMiniKit,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { UserSearch } from "./components/UserSearch";
import { CreateRequest } from "./components/CreateRequest";
import connector from "@farcaster/frame-wagmi-connector";
import { RequestsCreatedByMe } from "./components/RequestsCreatedByMe";
import { RequestsCreatedForMe } from "./components/RequestsCreatedForMe";
import { Nav } from "./components/Nav";
import { TABS } from "./constants";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  const openUrl = useOpenUrl();
  const { address } = useAccount();
  const { connect } = useConnect(); 

  const [activeTab, setActiveTab] = useState<string>(TABS[0].name);

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



  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#E5E5E5] text-black snake-dark">
      <div className="w-full max-w-[520px] mx-auto flex flex-col h-full">
        <header>
          <Nav activeTab={activeTab} onTabSelect={setActiveTab} />
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-20">
          <div className="flex flex-col gap-4">
            {activeTab === "create-request" && (
              <UserSearch />          
            )}
            {activeTab === "create-request" && (
              <CreateRequest onSuccess={() => setLastSuccess(new Date().getTime().toString())} />
            )}
            {activeTab === "requests-by-me" && (
              <RequestsCreatedByMe refreshTrigger={lastSuccess} />
            )}
            {activeTab === "requests-for-me" && (
              <RequestsCreatedForMe refreshTrigger={lastSuccess} />
            )}
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
