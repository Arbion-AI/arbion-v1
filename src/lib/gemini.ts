import { getPriceAndTrend } from './crypto/coingecko';

function getConfiguredExchanges(): string[] {
  try {
    const storedKeys = localStorage.getItem('cexApiKeys');
    if (storedKeys) {
      const keys = JSON.parse(storedKeys);
      return Object.entries(keys)
        .filter(([_, key]) => key)
        .map(([exchange]) => exchange.charAt(0).toUpperCase() + exchange.slice(1));
    }
  } catch (error) {
    console.warn('Failed to get configured exchanges:', error);
  }
  return [];
}

async function enrichPromptWithCryptoData(prompt: string): Promise<string> {
  try {
    const cryptoRegex = /\b(BTC|ETH|USDT|BNB|SOL|XRP|ADA|DOGE|AVAX|LINK)\b/g;
    const symbols = [...new Set(prompt.match(cryptoRegex) || [])];
    
    if (symbols.length > 0) {
      const priceData = await Promise.all(
        symbols.map(async (symbol) => {
          const data = await getPriceAndTrend(symbol);
          return `${symbol}: $${data.price.toLocaleString()} (${data.priceChange24h.toFixed(2)}% 24h) - ${data.trend.toUpperCase()}`;
        })
      );
      
      return `${prompt}\n\nCurrent market data:\n${priceData.join('\n')}`;
    }
    
    return prompt;
  } catch (error) {
    console.warn('Failed to enrich prompt with crypto data:', error);
    return prompt;
  }
}

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    let enrichedPrompt = await enrichPromptWithCryptoData(prompt);
    
    // If the prompt contains trading-related keywords, include exchange context
    if (/\b(trade|buy|sell|order|position|exchange)\b/i.test(prompt)) {
      const configuredExchanges = getConfiguredExchanges();
      if (configuredExchanges.length > 0) {
        enrichedPrompt = `You are responding to a user who has configured these exchanges: ${configuredExchanges.join(', ')}.\n\n${enrichedPrompt}`;
      }
    }

    // Placeholder response since we removed the Gemini API
    return "I'm sorry, but I can't process your request at the moment. The AI service is currently unavailable.";
  } catch (error) {
    console.error('Error processing request:', error);
    throw new Error('Failed to get response');
  }
}