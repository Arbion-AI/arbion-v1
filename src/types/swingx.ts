export interface TradingPair {
  asset: string;
  trade_size_usd?: string;
  asset_autotrading_active: boolean;
  aggressiveness?: string;
  leverage?: number;
}

export interface SwingXStandardBalance {
  has_dex_keys: boolean;
  trading_pairs: TradingPair[];
  cex_name: string;
  aggressiveness_multiplier?: number;
  execution_times?: string[];
  margin_to_use?: number;
  current_credits?: number;
  tp_sl_active?: boolean;
}

export interface HyperLiquidPosition {
  coin: string;
  size: number;
  entryPrice: number;
  unrealizedPnl: number;
  positionValue: number;
  leverage: number;
  side: string;
  entry_time: string;
}

export interface HyperLiquidOpenOrder {
  coin: string;
  oid: number;
  size: string;
  price: string;
  is_buy: boolean;
  reduce_only: boolean;
  order_type: string;
  timestamp: number;
  side: string;
  type: string;
}

export interface OpenOrders {
  positions: HyperLiquidPosition[];
  open_orders: HyperLiquidOpenOrder[];
}

export interface SwingXProUserInfo {
  has_dex_keys: boolean;
  trading_pairs: TradingPair[];
  cex_name: string;
  aggressiveness_multiplier?: number;
  execution_times?: string[];
  margin_to_use?: number;
  current_credits?: number;
  tp_sl_active?: boolean;
  job_active?: boolean;
}
export interface AssetBalance {
  free: string;
  locked: string;
  total: string;
}
export interface SwingXBalances {
  usdt_balance: AssetBalance;
  asset_balances: AssetBalance[];
}

export interface HLCoin {
  coin: string;
  min_leverage: number;
  max_leverage: number;
}

export interface getPairsResponse {
  data: {
    timezone: string;
    serverTime: number;
    rateLimits: {
      rateLimitType: string;
      interval: string;
      intervalNum: number;
      limit: number;
    }[];
    exchangeFilters: {
      filterType: string;
      minPrice: string;
      maxPrice: string;
      tickSize: string;
    }[];
    symbols: {
      symbol: string;
      status: string;
      baseAsset: string;
      baseAssetPrecision: number;
      quoteAsset: string;
      quotePrecision: number;
      quoteAssetPrecision: number;
      baseCommissionPrecision: number;
      quoteCommissionPrecision: number;
      orderTypes: string[];
      icebergAllowed: boolean;
      ocoAllowed: boolean;
      isSpotTradingAllowed: boolean;
      isMarginTradingAllowed: boolean;
      filters: {
        filterType: string;
        minPrice?: string;
        maxPrice?: string;
        tickSize?: string;
        // Add other filter properties as needed
      }[];
      permissions: string[];
      defaultSelfTradePreventionMode: string;
      allowedSelfTradePreventionModes: string[];
    }[];
  };
}
