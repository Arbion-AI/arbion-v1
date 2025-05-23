export interface AssetAllocation {
  name: string;
  allocation: number;
}

export interface AlertType {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface AgentType {
  id: string;
  name: string;
  strategy: string;
  status: 'active' | 'paused' | 'error';
  model: string;
  pnl24h: number;
  trades: number;
  assets: AssetAllocation[];
  alerts: AlertType[];
}