import { base } from "thirdweb/chains";
import Send from "../svg/Send";
import Mailbox from "../svg/Mailbox";
import Planet from "../svg/Planet";

export const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const CONTRACT: `0x${string}` = '0xc55cf49f1b8f69e584d9a5f8017c28dec0f28479';
export const REVIEW_CONTRACT: `0x${string}` = '0x0be22550336c98a0c37e1f93f93fe4469f9abbaa';
export const SUGGESTED_PAYMENT_AMOUNTS_CONTRACT: `0x${string}` = '0xc370cf4a0a64bd3d8cc172f89a12bd1c12c73af5';
export const CHAIN = {
  ...base,
  rpc: `https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}`,
}

export const TABS: {
  name: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    name: "create-request",
    label: "Request",
    icon: Send,
  },
  {
    name: "requests-by-me",
    label: "In Flight",
    icon: Planet,
  },
  {
    name: "requests-for-me",
    label: "Inbox",
    icon: Mailbox,
  },
];
