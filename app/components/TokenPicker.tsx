import { getTokens } from "@coinbase/onchainkit/api";
import { Token, TokenSearch } from "@coinbase/onchainkit/token";
import { useCallback, useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { isAddress, shortenAddress } from "thirdweb/utils";


type Props = {
  onTokenChange: (token: Token) => void;
}

export const TokenPicker = ({ onTokenChange }: Props) => {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokensIsLoading, setTokensIsLoading] = useState(false);

  const handleTokenChange = useCallback((value: string) => {
    async function getData(value: string) {
      try {
        setTokensIsLoading(true);
        const tokens = await getTokens({ search: value }); 
        if (tokens instanceof Error) {
          console.error(tokens);
        } else {
          setTokens(tokens as Token[]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTokensIsLoading(false);
      }
    }
    getData(value);
  }, []);

  const handleTokenClick = useCallback((token: Token) => {
    setSelectedToken(token);
    onTokenChange(token);
    setTokens([]);
  }, [onTokenChange]);

  if (selectedToken?.address && isAddress(selectedToken.address)) {
    return (
      <div 
        key={selectedToken.address}
        className="flex items-center justify-between p-3 bg-white my-1 hover:bg-gray-50 rounded-md cursor-pointer"
        onClick={() => setSelectedToken(null)}
      >
        <div className="flex items-center space-x-3">
          {selectedToken.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedToken.image}
              alt={selectedToken.symbol}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <div className="font-medium">{selectedToken.name}</div>
            <div className="text-sm text-gray-500">{selectedToken.symbol}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">{shortenAddress(selectedToken.address)}</div>
          <div className="text-red-500">&times;</div>
        </div>
      </div>
    )
  }
   
  return (
    <div>
      <TokenSearch 
        onChange={handleTokenChange} 
        delayMs={200} 
        className="w-full bg-white rounded border-2 border-gray-300 focus:bg-white focus:text-black active:bg-white"
      />
      {tokensIsLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col max-h-[300px] overflow-y-auto">
          {tokens.map((token) => (
            <div 
              key={token.address}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
              onClick={() => handleTokenClick(token)}
            >
              <div className="flex items-center space-x-3">
                {token.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={token.image}
                    alt={token.symbol}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-gray-500">{token.symbol}</div>
                </div>
              </div>
              {isAddress(token.address) && (
                <div className="text-sm text-gray-500">{shortenAddress(token.address)}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
};
