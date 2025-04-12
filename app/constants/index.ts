import { base } from "thirdweb/chains";
import Send from "../svg/Send";
import Mailbox from "../svg/Mailbox";
import Planet from "../svg/Planet";

export const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const CONTRACT: `0x${string}` = '0x3ff0ef4d24919e03b5a650f2356bd632c59ef9f6';
export const REVIEW_CONTRACT: `0x${string}` = '0x46270a5549d55898fbbe102f5560313903e7576e';
export const SUGGESTED_PAYMENT_AMOUNTS_CONTRACT: `0x${string}` = '0xf0af2c550b51f3e4fe1b7dcfd4ac8a7093f54b94';
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
