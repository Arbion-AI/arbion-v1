import { WalletType, WalletInfo, WalletError } from './types';

declare global {
  interface Window {
    ethereum?: any;
    trustwallet?: any;
  }
}

export class WalletService {
  private static instance: WalletService;
  private currentProvider: any = null;
  private currentWallet: WalletType | null = null;
  private connectionListeners: Set<(info: WalletInfo | null) => void> = new Set();

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  public addConnectionListener(listener: (info: WalletInfo | null) => void) {
    this.connectionListeners.add(listener);
  }

  public removeConnectionListener(listener: (info: WalletInfo | null) => void) {
    this.connectionListeners.delete(listener);
  }

  private notifyListeners(info: WalletInfo | null) {
    this.connectionListeners.forEach(listener => listener(info));
  }

  private async detectProvider(type: WalletType): Promise<any> {
    if (typeof window === 'undefined') return null;

    // Check if we're in a mobile environment
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // For MetaMask on mobile
    if (type === 'metamask' && isMobile) {
      // If MetaMask's mobile browser is not being used, redirect to MetaMask app
      if (!window.ethereum?.isMetaMask) {
        const mmUrl = `https://metamask.app.link/dapp/${window.location.host}`;
        window.location.href = mmUrl;
        throw new Error('Please open this website in MetaMask browser');
      }
    }

    // Wait for provider injection
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (type) {
      case 'metamask': {
        // Check for MetaMask in providers array
        if (window.ethereum?.providers) {
          const provider = window.ethereum.providers.find(
            (p: any) => p.isMetaMask && !p.isTrust
          );
          if (provider) return provider;
        }
        // Check standalone MetaMask
        if (window.ethereum?.isMetaMask && !window.ethereum?.isTrust) {
          return window.ethereum;
        }
        return null;
      }
      
      case 'trustwallet': {
        // Check dedicated Trust Wallet object
        if (window.trustwallet) return window.trustwallet;
        
        // Check for Trust Wallet in providers array
        if (window.ethereum?.providers) {
          const provider = window.ethereum.providers.find(
            (p: any) => p.isTrust || p.isTrustWallet
          );
          if (provider) return provider;
        }
        
        // Check standalone Trust Wallet
        if (window.ethereum?.isTrust || window.ethereum?.isTrustWallet) {
          return window.ethereum;
        }
        return null;
      }
      
      default:
        return null;
    }
  }

  private async getWalletInfo(provider: any, address: string): Promise<WalletInfo> {
    const [chainId, balance] = await Promise.all([
      provider.request({ method: 'eth_chainId' }),
      provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
    ]);

    return {
      address,
      chainId: parseInt(chainId, 16),
      balance: (parseInt(balance, 16) / 1e18).toFixed(4)
    };
  }

  public async isWalletAvailable(type: WalletType): Promise<boolean> {
    const provider = await this.detectProvider(type);
    return provider !== null;
  }

  public async connectWallet(type: WalletType): Promise<WalletInfo> {
    try {
      // First disconnect any existing connection
      await this.disconnect();

      const provider = await this.detectProvider(type);
      if (!provider) {
        throw new Error(`${type} not detected. Please install ${type} extension or open in ${type} browser.`);
      }

      // Request accounts
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const walletInfo = await this.getWalletInfo(provider, accounts[0]);

      // Store current provider and wallet type
      this.currentProvider = provider;
      this.currentWallet = type;

      // Save wallet type to localStorage
      localStorage.setItem('walletType', type);

      // Set up event listeners for the new provider
      this.setupProviderListeners(provider);

      // Notify listeners of the new connection
      this.notifyListeners(walletInfo);

      return walletInfo;
    } catch (error: any) {
      await this.disconnect();
      
      throw {
        code: error.code || -1,
        message: error.message || `Failed to connect to ${type}`
      } as WalletError;
    }
  }

  private setupProviderListeners(provider: any) {
    // Remove existing listeners if any
    if (this.currentProvider) {
      this.removeProviderListeners(this.currentProvider);
    }

    // Add new listeners
    provider.on('accountsChanged', this.handleAccountsChanged.bind(this));
    provider.on('chainChanged', this.handleChainChanged.bind(this));
    provider.on('disconnect', this.handleDisconnect.bind(this));
  }

  private removeProviderListeners(provider: any) {
    if (provider.removeListener) {
      provider.removeListener('accountsChanged', this.handleAccountsChanged.bind(this));
      provider.removeListener('chainChanged', this.handleChainChanged.bind(this));
      provider.removeListener('disconnect', this.handleDisconnect.bind(this));
    }
  }

  private async handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      await this.disconnect();
    } else if (this.currentProvider) {
      const walletInfo = await this.getWalletInfo(this.currentProvider, accounts[0]);
      this.notifyListeners(walletInfo);
    }
  }

  private async handleChainChanged(chainId: string) {
    if (this.currentProvider) {
      const accounts = await this.currentProvider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        const walletInfo = await this.getWalletInfo(this.currentProvider, accounts[0]);
        this.notifyListeners(walletInfo);
      }
    }
  }

  private async handleDisconnect() {
    await this.disconnect();
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.currentProvider) {
        // Remove all listeners
        this.removeProviderListeners(this.currentProvider);
        
        // Some wallets support disconnect
        if (this.currentProvider.disconnect) {
          await this.currentProvider.disconnect();
        }
      }
    } catch (error) {
      console.warn('Error during wallet disconnect:', error);
    } finally {
      // Clean up state
      this.currentProvider = null;
      this.currentWallet = null;
      localStorage.removeItem('walletType');
      this.notifyListeners(null);
    }
  }

  public getCurrentWallet(): WalletType | null {
    return this.currentWallet;
  }

  public getProvider(): any {
    return this.currentProvider;
  }
}