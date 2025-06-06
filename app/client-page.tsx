"use client";

import {
  useMiniKit,
} from "@coinbase/onchainkit/minikit";
import { useEffect, useState, Suspense } from "react";
import { useAccount, useConnect } from "wagmi";
import { UserSearch } from "./components/UserSearch";
import { CreateRequest } from "./components/CreateRequest";
import connector from "@farcaster/frame-wagmi-connector";
import { RequestsCreatedByMe } from "./components/RequestsCreatedByMe";
import { RequestsCreatedForMe } from "./components/RequestsCreatedForMe";
import { Nav } from "./components/Nav";
import { TABS } from "./constants";
import { useSearchParams } from 'next/navigation';
import { ShareButton } from "./components/ShareButton";
import { useUserStore } from "./store/userStore";
import { TrendingUsers } from "./components/TrendingUsers";

interface ClientPageProps {
  fid?: string;
}

function AppContent({ fid: propFid }: ClientPageProps) {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { setSelectedUser } = useUserStore();
  const queryFid = searchParams.get('fid');
  const fid = propFid || (queryFid || undefined);
  const initialTab = searchParams.get('tab') || TABS[0].name;

  useEffect(() => {
    const fetchAndSetUser = async () => {
      if (!fid) return;
      
      try {
        const response = await fetch(`/api/user/${fid}`);
        const user = await response.json();
        setSelectedUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchAndSetUser();
  }, [fid, setSelectedUser]);

  const { address } = useAccount();
  const { connect } = useConnect(); 

  const [activeTab, setActiveTab] = useState<string>(initialTab);

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
    <div className="flex flex-col h-screen bg-[#E5E5E5] text-black snake-dark">
      <div className="w-full max-w-[520px] mx-auto flex flex-col h-full">
        <header className="sticky top-0 z-10 bg-[#E5E5E5]">
          <Nav activeTab={activeTab} onTabSelect={setActiveTab} />
        </header>

        <main className="flex-1 px-4 pb-20 overflow-y-auto mt-8">
          <div className="flex flex-col gap-4">
            {activeTab === "create-request" && (
              <div className="flex flex-col gap-2">
                <TrendingUsers />
                <UserSearch initialFid={fid} />          
              </div>
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

        <footer className="sticky bottom-0 left-0 right-0 flex items-center justify-center p-4 bg-[#E5E5E5]">
          <ShareButton />
        </footer>
      </div>
    </div>
  );
}

export default function ClientPage({ fid }: ClientPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContent fid={fid} />
    </Suspense>
  );
} 