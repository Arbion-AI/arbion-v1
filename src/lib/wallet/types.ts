export type WalletType = 'metamask' | 'trustwallet';

export interface WalletInfo {
  address: string;
  chainId: number;
  balance: string;
}

export interface WalletError {
  code: number;
  message: string;
}