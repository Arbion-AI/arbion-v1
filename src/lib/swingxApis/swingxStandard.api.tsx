import axios from "axios";

import { SWINGX_STANDARD_URL } from "../env";
import {
  OpenOrders,
  SwingXBalances,
  SwingXStandardBalance,
} from "../../types/swingx";

const API_BASE_URL = SWINGX_STANDARD_URL;

export const getCredentials = (): string => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) return "";

    const userData = JSON.parse(userJson);
    return userData?.credentials || "";
  } catch (error) {
    return "";
  }
};

const handleError = (error: any): never => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response?.data?.detail === "Invalid credentials"
  ) {
    throw error;
  }
  throw error;
};

export const getSwingXStandardUserBasicInfo = async (
  cexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
): Promise<SwingXStandardBalance[]> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/get-user-basic-info`,
      {
        credentials: getCredentials(),
        dex_name: cexName,
        model_version: modelVersion,
      }
    );
    const res = [
      {
        ...response.data.data[0],
        current_credits: response.data.current_credits,
      },
    ];

    return res;
  } catch (error) {
    return handleError(error);
  }
};

export const createSwingXStandardConnection = async (
  dexName: string = "hyperliquid",
  apiKey: string,
  walletAddress: string,
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v4/dex_v1/create`, {
      credentials: getCredentials(),
      dex_name: dexName,
      api_key: apiKey,
      wallet_address: walletAddress,
      model_version: modelVersion,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getSwingXStandardBalances = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
): Promise<SwingXBalances> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v4/dex_v1/balances`, {
      credentials: getCredentials(),
      dex_name: dexName,
      model_version: modelVersion,
    });

    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const testSwingXStandardConnection = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/test-connection`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        model_version: modelVersion,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const activateSwingXStandardAutoTrading = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/activate-autotrading`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        model_version: modelVersion,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deactivateSwingXStandardAutoTrading = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/deactivate-autotrading`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        model_version: modelVersion,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const changeSwingXStandardKeys = async (
  dexName: string = "hyperliquid",
  apiKey: string,
  modelVersion: string = "dex_v1",
  walletAddress: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v4/dex_v1/change-keys`, {
      credentials: getCredentials(),
      dex_name: dexName,
      api_key: apiKey,
      model_version: modelVersion,
      wallet_address: walletAddress,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const revokeSwingXStandardBot = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v4/dex_v1/remove-keys`, {
      credentials: getCredentials(),
      dex_name: dexName,
      model_version: modelVersion,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateSwingXStandardAggressiveness = async (
  dexName: string = "hyperliquid",
  margin_to_use: number = 3.0,
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/margin_to_use`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        model_version: modelVersion,
        margin_to_use: margin_to_use,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const runAnalysis = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1"
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/fire-user-job`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        model_version: modelVersion,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
export const updateSwingXStandardTpSl = async (
  dexName: string = "hyperliquid",
  modelVersion: string = "dex_v1",
  tp_sl_active: boolean = true
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/update-tp-sl`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        model_version: modelVersion,
        tp_sl_active: tp_sl_active,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getOpenOrders = async (
  dexName: string,
  model_version: string
): Promise<OpenOrders> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/open-positions-orders`,
      {
        credentials: getCredentials(),
        model_version: model_version,
        dex_name: dexName,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// this endpoint should only be called atleast 10mins after agent run or 10mins before agent has to run
export const updateTpslOrders = async (
  dexName: string,
  asset: string,
  take_profit_or_stop_loss: "tp" | "sl",
  trigger_price: number,
  size: number,
  model_version: string = "dex_v1"
) => {
  console.log(asset, take_profit_or_stop_loss, trigger_price, size);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/v4/dex_v1/update-tpsl-order`,
      {
        credentials: getCredentials(),
        dex_name: dexName,
        asset: asset,
        take_profit_or_stop_loss: take_profit_or_stop_loss,
        trigger_price: trigger_price,
        size: size,
        model_version: model_version,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
