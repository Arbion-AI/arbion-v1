import axios from "axios";

import { LoggedInUserInfoResponse } from "@/types/agent";
import { AUTH_URL } from "../env";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";

export const storeUserInfo = async (
  credential: string
): Promise<LoggedInUserInfoResponse> => {
  try {
    const res = await axios.post(`${AUTH_URL}/check-user`, {
      credential,
      origin: "https://app.arbion.org/",
    });
    return res.data;
  } catch (error) {
    console.error("Error storing user info:", error);
    return handleError(error);
  }
};

const handleError = (error: any): never => {
  if (error.response?.data?.detail === "Invalid credentials") {
    logout();
    throw error;
  }
  throw error;
};

export const logout = () => {
  toast.success("Session expired, Goodbye! 👋");

  const dispatch = useAppDispatch();
  dispatch(setUser(null));
};
