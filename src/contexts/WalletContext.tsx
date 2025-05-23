import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletService } from '../lib/wallet';
import { WalletType, WalletInfo } from '../lib/wallet/types';

interface WalletContextType {
  isConnected: boolean;
  walletInfo: WalletInfo | null;
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  error: string | null;
  currentWallet: WalletType | null;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  walletInfo: null,
  connect: async () => {},
  disconnect: async () => {},
  error: null,
  currentWallet: null
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentWallet, setCurrentWallet] = useState<WalletType | null>(null);

  const walletService = WalletService.getInstance();

  const handleWalletUpdate = (info: WalletInfo | null) => {
    setWalletInfo(info);
    setIsConnected(!!info);
    setCurrentWallet(info ? walletService.getCurrentWallet() : null);
  };

  const connect = async (type: WalletType) => {
    try {
      setError(null);
      const info = await walletService.connectWallet(type);
      handleWalletUpdate(info);
    } catch (err: any) {
      setError(err.message);
      await disconnect();
    }
  };

  const disconnect = async () => {
    try {
      await walletService.disconnect();
      handleWalletUpdate(null);
    } catch (err) {
      console.error('Error during disconnect:', err);
    }
  };

  useEffect(() => {
    // Add wallet update listener
    walletService.addConnectionListener(handleWalletUpdate);
    
    // Check for saved wallet on mount
    const checkSavedWallet = async () => {
      const savedType = localStorage.getItem('walletType') as WalletType | null;
      if (savedType) {
        const isAvailable = await walletService.isWalletAvailable(savedType);
        if (isAvailable) {
          try {
            await connect(savedType);
          } catch (err) {
            console.error('Error reconnecting wallet:', err);
            await disconnect();
          }
        }
      }
    };

    checkSavedWallet();

    return () => {
      walletService.removeConnectionListener(handleWalletUpdate);
    };
  }, []);

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      walletInfo, 
      connect, 
      disconnect, 
      error,
      currentWallet 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);