import { SUPPORTED_CHAINS, SUPPORTED_DEXES } from './constants';

export type ChainId = typeof SUPPORTED_CHAINS[keyof typeof SUPPORTED_CHAINS];
export type DexId = typeof SUPPORTED_DEXES[keyof typeof SUPPORTED_DEXES];

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  chainId: ChainId;
}

export interface PriceData {
  token: TokenInfo;
  price: number;
  timestamp: number;
  source: string;
}

export interface TradeParams {
  chainId: ChainId;
  dex: DexId;
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amount: string;
  slippage?: number;
  deadline?: number;
}

export interface TradeQuote {
  tokenIn: TokenInfo;
  tokenOut: TokenInfo;
  amountIn: string;
  amountOut: string;
  priceImpact: number;
  route: string[];
  gas: {
    estimated: number;
    price: string;
  };
}

export interface MarketData {
  price: number;
  volume24h: number;
  priceChange24h: number;
  lastUpdate: number;
}

export interface OrderbookData {
  bids: [number, number][]; // [price, amount]
  asks: [number, number][]; // [price, amount]
  spread: number;
  timestamp: number;
}