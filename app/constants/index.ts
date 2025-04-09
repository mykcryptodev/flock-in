import { base } from "thirdweb/chains";

export const TOKEN: `0x${string}` = '0xdc471C5C72dE413e4877CeD49B8Bd0ce72796722';
export const TOKEN_DECIMALS = 6;
export const TOKEN_SYMBOL = 'FLOCKA';
export const PRICE = BigInt(4500);
export const CONTRACT: `0x${string}` = '0x93f36b72db1dc47e3ad50e126d75b6d3a39c21d6';
export const CHAIN = {
  ...base,
  rpc: `https://api.developer.coinbase.com/rpc/v1/base/${process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}`,
}