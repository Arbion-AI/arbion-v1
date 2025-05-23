export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BASE: 8453
} as const;

export const SUPPORTED_DEXES = {
  UNISWAP_V3: 'uniswap_v3',
  SUSHISWAP: 'sushiswap',
  BALANCER: 'balancer'
} as const;

export const DEFAULT_SLIPPAGE = 0.5; // 0.5%
export const DEFAULT_GAS_LIMIT = 300000;
export const MAX_RETRIES = 3;