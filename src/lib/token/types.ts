export interface TokenBalance {
  balance: string;
  formatted: string;
}

export interface TokenContract {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

export const ARAI_CONTRACT: TokenContract = {
  address: '0xed61d3e74e0dcd2d73dbd46ebb1bb19ba93bc482',
  decimals: 18,
  symbol: 'ARAI',
  name: 'Arbion AI Token'
};