import { base } from "thirdweb/chains";
import Send from "../svg/Send";
import Mailbox from "../svg/Mailbox";
import Planet from "../svg/Planet";

export const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const CONTRACT: `0x${string}` = '0x298688df47fa6ab1e4479f60474d16ad7c37d024';
export const REVIEW_CONTRACT: `0x${string}` = '0x3fe1eb3912ea77230876eebd133a6a3467e2f93b';
export const SUGGESTED_PAYMENT_AMOUNTS_CONTRACT: `0x${string}` = '0x72503a680c540fb3500561aaa288deb939a24b20';
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
