import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ExternalLink, ChevronDown } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { WalletService } from '../../lib/wallet';

interface TopBarProps {
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleMobileMenu, mobileMenuOpen }) => {
  const { isConnected, walletInfo, connect, disconnect, error } = useWallet();
  const [showConnectOptions, setShowConnectOptions] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const walletService = WalletService.getInstance();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        buttonRef.current &&
        !dialogRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowConnectOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConnect = async (type: 'metamask' | 'trustwallet') => {
    try {
      await connect(type);
      setShowConnectOptions(false);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowConnectOptions(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="glass h-16 flex items-center justify-between px-4 relative z-20">
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-background-light"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="md:hidden flex items-center ml-2">
          <img src="/log.png" alt="Arbion AI" className="w-6 h-6" />
          <span className="ml-2 font-bold">Arbion<span className="text-primary">AI</span></span>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-2">
        <div className="flex items-center px-3 py-1 bg-background-light rounded-full text-xs">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary status-active' : 'bg-red-500'} mr-2`}></div>
          <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
        </div>
        
        {isConnected && (
          <div className="px-3 py-1 bg-background-light rounded-full text-xs flex items-center">
            <span>Ethereum</span>
            <ExternalLink size={12} className="ml-1" />
          </div>
        )}
      </div>
      
      <div className="relative">
        <button 
          ref={buttonRef}
          className="btn btn-primary rounded-full flex items-center"
          onClick={() => setShowConnectOptions(!showConnectOptions)}
        >
          {isConnected ? (
            <>
              <span>{formatAddress(walletInfo?.address || '')}</span>
              <ChevronDown size={16} className="ml-2" />
            </>
          ) : (
            <span>Connect</span>
          )}
        </button>

        {showConnectOptions && (
          <div 
            ref={dialogRef}
            className="absolute right-0 mt-2 w-80 glass rounded-xl shadow-xl transform transition-all duration-200 ease-out origin-top-right"
            style={{
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div className="p-4">
              {isConnected ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Connected Wallet</h3>
                    <div className="glass-card">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-text-secondary text-xs">Address</span>
                        <span className="text-xs font-mono">{formatAddress(walletInfo?.address || '')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-xs">Balance</span>
                        <span className="text-xs">{walletInfo?.balance} ETH</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(`https://etherscan.io/address/${walletInfo?.address}`, '_blank')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-light transition-colors flex items-center justify-between"
                    >
                      <span>View on Explorer</span>
                      <ExternalLink size={14} />
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-light transition-colors text-red-500"
                    >
                      Disconnect
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium mb-3">Connect Wallet</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleConnect('metamask')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-background-light transition-colors flex items-center"
                    >
                      <img 
                        src="https://raw.githubusercontent.com/MetaMask/metamask-extension/develop/app/images/icon-128.png" 
                        alt="MetaMask" 
                        className="w-6 h-6 mr-3" 
                        loading="lazy"
                      />
                      <div>
                        <span className="block font-medium">MetaMask</span>
                        <span className="text-xs text-text-secondary">Connect to your MetaMask wallet</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleConnect('trustwallet')}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-background-light transition-colors flex items-center"
                    >
                      <img 
                        src="/trustwallet.png" 
                        alt="Trust Wallet" 
                        className="w-6 h-6 mr-3" 
                        loading="lazy"
                      />
                      <div>
                        <span className="block font-medium">MetaMask</span>
                        <span className="text-xs text-text-secondary">Connect to your Trust Wallet</span>
                      </div>
                    </button>
                  </div>
                  {error && (
                    <p className="mt-3 text-xs text-red-500 p-2 bg-red-500 bg-opacity-10 rounded">
                      {error}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;