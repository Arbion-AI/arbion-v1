import { CoinGeckoClient } from 'coingecko-api-v3';

interface CryptoPrice {
  symbol: string;
  price: number;
  priceChange24h?: number;
  lastUpdated: number;
}

const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: true,
});

const symbolToId: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LTC': 'litecoin'
};

const priceCache = new Map<string, CryptoPrice>();
const CACHE_DURATION = 30000; // 30 seconds

export async function getCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    const now = Date.now();
    const uncachedSymbols = symbols.filter(symbol => {
      const cached = priceCache.get(symbol);
      return !cached || now - cached.lastUpdated > CACHE_DURATION;
    });

    if (uncachedSymbols.length > 0) {
      const ids = uncachedSymbols
        .map(s => symbolToId[s])
        .filter(Boolean)
        .join(',');

      const response = await client.simplePrice({
        ids,
        vs_currencies: ['usd'],
        include_24hr_change: true,
      });

      Object.entries(response).forEach(([id, data]: [string, any]) => {
        const symbol = Object.keys(symbolToId).find(key => symbolToId[key] === id);
        if (symbol) {
          priceCache.set(symbol, {
            symbol,
            price: data.usd,
            priceChange24h: data.usd_24h_change,
            lastUpdated: now,
          });
        }
      });
    }

    return symbols
      .map(symbol => priceCache.get(symbol))
      .filter((price): price is CryptoPrice => Boolean(price));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
}

function determineTrend(priceChange24h: number): 'bullish' | 'bearish' | 'neutral' {
  if (priceChange24h > 1) return 'bullish';
  if (priceChange24h < -1) return 'bearish';
  return 'neutral';
}

export async function getPriceAndTrend(symbol: string): Promise<{
  price: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  priceChange24h: number;
}> {
  try {
    const [priceData] = await getCryptoPrices([symbol]);
    
    if (!priceData) {
      throw new Error(`No price data available for ${symbol}`);
    }

    return {
      price: priceData.price,
      trend: determineTrend(priceData.priceChange24h || 0),
      priceChange24h: priceData.priceChange24h || 0
    };
  } catch (error) {
    console.error(`Error getting price and trend for ${symbol}:`, error);
    throw error;
  }
}