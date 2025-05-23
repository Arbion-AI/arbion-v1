import { TradeParams, TradeQuote } from './types';
import { DEFAULT_SLIPPAGE, DEFAULT_GAS_LIMIT } from './constants';
import { MarketDataService } from './market';

export async function getTradeQuote(params: TradeParams): Promise<TradeQuote> {
  const marketService = MarketDataService.getInstance();
  
  // Get market data for input and output tokens
  const tokenInPrice = await marketService.getPrice(params.tokenIn);
  const tokenOutPrice = await marketService.getPrice(params.tokenOut);
  
  if (!tokenInPrice || !tokenOutPrice) {
    throw new Error('Failed to fetch token prices');
  }

  // Calculate amounts
  const amountIn = params.amount;
  const rate = tokenOutPrice.price / tokenInPrice.price;
  const amountOut = (parseFloat(amountIn) * rate).toString();

  // Calculate price impact (simplified)
  const priceImpact = Math.abs((rate - 1) * 100);

  return {
    tokenIn: params.tokenIn,
    tokenOut: params.tokenOut,
    amountIn,
    amountOut,
    priceImpact,
    route: [params.tokenIn.symbol, params.tokenOut.symbol],
    gas: {
      estimated: DEFAULT_GAS_LIMIT,
      price: '50' // Gwei
    }
  };
}

export function validateTradeParams(params: TradeParams): boolean {
  if (!params.chainId || !params.dex || !params.tokenIn || !params.tokenOut || !params.amount) {
    return false;
  }

  if (parseFloat(params.amount) <= 0) {
    return false;
  }

  if (params.slippage && (params.slippage < 0 || params.slippage > 100)) {
    return false;
  }

  if (params.deadline && params.deadline < Date.now()) {
    return false;
  }

  return true;
}