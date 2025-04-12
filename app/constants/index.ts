import { base } from "thirdweb/chains";
import Send from "../svg/Send";
import Mailbox from "../svg/Mailbox";
import Planet from "../svg/Planet";

export const TOKEN: `0x${string}` = '0xdc471C5C72dE413e4877CeD49B8Bd0ce72796722';
export const TOKEN_DECIMALS = 6;
export const TOKEN_SYMBOL = 'FLOCKA';
export const PRICE = BigInt(4500);
export const CONTRACT: `0x${string}` = '0x13ab1fe1f087db713c95fec7eb95780f6ec6e177';
export const REVIEW_CONTRACT: `0x${string}` = '0xbea64cCD92203b1c2DaC1d395925CEBF42F93be5';
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
