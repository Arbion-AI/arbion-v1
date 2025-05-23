import { ethers } from 'ethers';
import { TokenBalance, ARAI_CONTRACT } from './types';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

export class TokenService {
  private static instance: TokenService;
  private provider: ethers.BrowserProvider | null = null;

  private constructor() {}

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public setProvider(provider: any) {
    this.provider = new ethers.BrowserProvider(provider);
  }

  public async getBalance(address: string): Promise<TokenBalance> {
    try {
      if (!this.provider) {
        throw new Error('Provider not set');
      }

      const contract = new ethers.Contract(
        ARAI_CONTRACT.address,
        ERC20_ABI,
        this.provider
      );

      const balance = await contract.balanceOf(address);
      const formatted = ethers.formatUnits(balance, ARAI_CONTRACT.decimals);

      return {
        balance: balance.toString(),
        formatted: parseFloat(formatted).toLocaleString()
      };
    } catch (error) {
      console.error('Error fetching ARAI balance:', error);
      return {
        balance: '0',
        formatted: '0'
      };
    }
  }
}