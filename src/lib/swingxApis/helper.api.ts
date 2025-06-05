import { getPairsResponse } from "@/types/swingx";
import { binanceCryptoIcons } from "binance-icons";

import axios from "axios";

export const getBinancePairs = async (): Promise<{
  pairs: {
    symbol: string;
    pair: string;
    baseAsset: string;
    quoteAsset: string;
  }[];
  icons: { [key: string]: string | undefined };
}> => {
  const response: getPairsResponse = await axios.get(
    `https://api.binance.us/api/v1/exchangeInfo`,
    {}
  );

  let icons: { [key: string]: string | undefined } = {};

  const pairs = response.data.symbols.map((symbol) => {
    icons[symbol.baseAsset.toLowerCase()] = binanceCryptoIcons.get(
      symbol.baseAsset.toLowerCase()
    );
    return {
      symbol: symbol.symbol,
      pair: symbol.baseAsset + "/" + symbol.quoteAsset,
      baseAsset: symbol.baseAsset.toLowerCase(),
      quoteAsset: symbol.quoteAsset.toLowerCase(),
    };
  });

  return { pairs, icons };
};
