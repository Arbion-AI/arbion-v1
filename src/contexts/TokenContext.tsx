import React, { createContext, useContext, useState, useEffect } from 'react';
import { TokenBalance } from '../lib/token/types';
import { TokenService } from '../lib/token';
import { useWallet } from './WalletContext';

interface TokenContextType {
  araiBalance: TokenBalance | null;
  refreshBalance: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType>({
  araiBalance: null,
  refreshBalance: async () => {}
});

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [araiBalance, setAraiBalance] = useState<TokenBalance | null>(null);
  const { isConnected, walletInfo } = useWallet();
  const tokenService = TokenService.getInstance();

  const refreshBalance = async () => {
    if (isConnected && walletInfo?.address) {
      try {
        const balance = await tokenService.getBalance(walletInfo.address);
        setAraiBalance(balance);
      } catch (error) {
        console.error('Error refreshing ARAI balance:', error);
        setAraiBalance(null);
      }
    } else {
      setAraiBalance(null);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      tokenService.setProvider(window.ethereum);
    }
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [isConnected, walletInfo?.address]);

  return (
    <TokenContext.Provider value={{ araiBalance, refreshBalance }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);