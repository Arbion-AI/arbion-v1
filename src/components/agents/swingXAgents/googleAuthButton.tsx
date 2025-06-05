import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";

import { useQueryClient } from "@tanstack/react-query";
import { storeUserInfo } from "@/lib/swingxApis/auth.api";
import { setUser } from "@/store/slices/userSlice";
export const GoogleAuthButton = ({ type }: { type?: "icon" | "button" }) => {
  const navigate = useNavigate();
  const [credentialResponse, setCredentialResponse] =
    useState<CredentialResponse | null>(null);
  const dispatch = useAppDispatch();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!credentialResponse?.credential) return;
    const handleCredential = async () => {
      toast.promise(
        (async () => {
          const res = await storeUserInfo(credentialResponse?.credential!);

          const userData = {
            email: res.user.email,
            image_url: res.user.image_url,
            name: res.user.name,
            exp: res.exp * 1000,
            credentials: credentialResponse?.credential!,
            current_credits: res.user.current_credits || 0,
            origin: "https://app.arbion.org/",
          };

          dispatch(setUser(userData));

          queryClient.invalidateQueries();

          return res;
        })(),
        {
          loading: "Logging in...",
          success: async (res) => {
            return `Welcome ${res.message ? "back" : ""} ${
              res.user.name
            } ${getRandomExcitingEmoji()}`;
          },
          error: "Failed to log in. Please try again.",
        }
      );
    };
    handleCredential();
  }, [credentialResponse, dispatch, navigate]);

  return (
    <div>
      <GoogleLogin
        theme={"outline"}
        shape="circle"
        onSuccess={(credentialResponse) => {
          setCredentialResponse(credentialResponse);
        }}
        onError={() => {
          toast.error("Login failed. Please try again.");
        }}
        type={type as "standard" | "icon" | undefined}
      />
    </div>
  );
};

const getRandomExcitingEmoji = () => {
  const excitingEmojis = ["🎉", "🚀", "🌟", "🔥", "🙌", "✨", "🎊"];
  return excitingEmojis[Math.floor(Math.random() * excitingEmojis.length)];
};
