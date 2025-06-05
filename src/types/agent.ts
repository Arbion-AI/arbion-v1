export interface AssetAllocation {
  name: string;
  allocation: number;
}

export interface AlertType {
  id: string;
  message: string;
  severity: "info" | "warning" | "error";
}

export interface AgentType {
  id: string;
  name: string;
  strategy: string;
  status: "active" | "paused" | "error";
  model: string;
  pnl24h: number;
  trades: number;
  assets: AssetAllocation[];
  alerts: AlertType[];
}
export interface LoggedInUserInfoResponse {
  message: string;
  is_new_user: boolean;
  user: UserInfoResponse;
  exp: number;
}

export interface UserInfoResponse {
  name: string;
  email: string;
  image_url: string;
  current_credits?: number;
}
