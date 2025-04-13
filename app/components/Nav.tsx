import { Name, Identity, Badge, Avatar } from "@coinbase/onchainkit/identity";
import { FC, useMemo } from "react";
import { useAddFrame, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useState } from "react";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import Check from "../svg/Check";
import { TABS } from "../constants";
import Image from "next/image";
const SCHEMA_UID =
  "0x7889a09fb295b0a0c63a3d7903c4f00f7896cca4fa64d2c1313f8547390b7d39";

type Props = {
  activeTab: string;
  onTabSelect: (tab: string) => void;
}

export const Nav: FC<Props> = ({ activeTab, onTabSelect }) => {
  const { address } = useAccount();
  const { context } = useMiniKit();
  const addFrame = useAddFrame();
  const [frameAdded, setFrameAdded] = useState(false);

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
          + GET NOTIFIED
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

  const logo = useMemo(() => {
    return (
      <div className="flex items-center gap-1">
        <Image priority src="/fire.png" alt="logo" width={20} height={20} />
        <span className="font-semibold">
          Flock In
        </span>
      </div>
    )
  }, []);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center p-4 w-full">
        <div className="flex flex-col">
          {logo}
        </div>
        <div className="flex justify-end gap-1">
          <div className="flex justify-start">
            {address ? (
              <Identity
                address={address}
                schemaId={SCHEMA_UID}
                className="!bg-inherit p-0 [&>div]:space-x-2"
              >
                <Avatar 
                  address={address} 
                  defaultComponent={
                    <img src={context?.user.pfpUrl} alt="pfp" className="w-6 h-6 rounded-full" />
                  }
                  sizes="sm"
                  className="w-6 h-6"
                />
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
          {saveFrameButton}
        </div>
      </div>
      <div className="grid grid-cols-3 w-full justify-around items-center gap-4 px-4">
        {TABS.map((tab) => (
          <div 
            key={tab.name} 
            className="flex justify-center flex-col items-center border border-2 border-gray-400 rounded-xl py-2">
            <button
              onClick={() => onTabSelect(tab.name)}
              className={`${activeTab === tab.name ? "bg-blue-200 rounded-full" : "bg-transparent"} p-2`}
            >
              <tab.icon className="text-gray-500" />
            </button>
            <span className="font-bold text-xs text-center text-gray-500">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};