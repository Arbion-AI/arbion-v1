import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsiveDialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useEffect } from "react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeySquare, Plus, Settings } from "lucide-react";

import { ConfigHyperLiquidForm } from "../forms/configHyperLiquidForm";
import {
  changeSwingXStandardKeys,
  createSwingXStandardConnection,
} from "@/lib/swingxApis/swingxStandard.api";
import { useAppSelector } from "@/store/hooks";
import { GoogleAuthButton } from "../googleAuthButton";

export function ConfigAgentDialog({
  isChangeConfig,
  hasKeys,
  dexName,
  model_version,
}: {
  isChangeConfig?: boolean;
  hasKeys?: boolean;
  dexName: string;
  model_version?: string;
}) {
  const [isValidForm, setIsValidForm] = useState(false);
  const [canTestConnection, setCanTestConnection] = useState(false);
  const [open, setOpen] = useState(false);

  const [cexName, setCexName] = useState(dexName || "");

  const form = useForm<z.infer<typeof apiKeySchema>>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      api_key: "",
      secret_key: "",
      wallet_address: "",
    },
  });

  useEffect(() => {
    setIsValidForm(form.formState.isValid);
  }, [form.formState.isValid]);

  const queryClient = useQueryClient();
  const handleClose = () => {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ["binanceUserInfo"] });
    queryClient.invalidateQueries({ queryKey: ["binanceUserInfo_v2"] });
  };

  const saveKeys = useMutation({
    mutationFn: () =>
      createSwingXStandardConnection(
        "hyperliquid",
        form.getValues("api_key"),
        form.getValues("wallet_address")
      ),
    onMutate: () => {
      return toast.loading("Saving keys...");
    },
    onSuccess: async (_, __, toastId) => {
      toast.success("Keys saved", { id: toastId });

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Add 2 second delay
      window.location.reload();
      form.reset();
      setCanTestConnection(true);
    },
    onError: (error, _, toastId) => {
      toast.error("Failed to save keys. Did you click on SAVE?", {
        id: toastId,
      });
      console.error("Error saving keys:", error);
    },
  });

  const updateKeys = useMutation({
    mutationFn: () =>
      changeSwingXStandardKeys(
        "hyperliquid",
        String(form.getValues("api_key")).trim(),
        model_version,
        String(form.getValues("wallet_address")).trim()
      ),
    onMutate: () => {
      return toast.loading("Saving keys...");
    },
    onSuccess: async (_, __, toastId) => {
      toast.success("Keys saved", { id: toastId });
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfo", model_version],
      });
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfoMobile", model_version],
      });
      queryClient.invalidateQueries({
        queryKey: ["hyperLiquidBalances", model_version],
      });

      window.location.reload();
      form.reset();
      setCanTestConnection(true);
    },
    onError: (error, _, toastId) => {
      toast.error("Failed to save keys. Did you click on SAVE?", {
        id: toastId,
      });
      console.error("Error saving keys:", error);
    },
  });

  const user = useAppSelector((state) => state.user.user);

  return (
    <ResponsiveDialog
      trigger={
        <div className="w-full flex flex-col items-center gap-2">
          {!isChangeConfig ? (
            <div className="flex flex-col gap-2">
              <Button
                className="btn btn-primary flex items-center"
                onClick={() => {
                  setCexName(dexName);
                }}
              >
                <Plus className="mr-2" />
                New Hyperliquid Agent
              </Button>
            </div>
          ) : (
            <Button
              variant={"outline"}
              className="w-full flex items-center justify-center gap-1 "
            >
              {hasKeys ? "Update keys" : `Configure ${cexName} API`}
              <Settings className="w-4 h-4 hover:rotate-180 transition-all duration-1000 ease-in-out" />
            </Button>
          )}
        </div>
      }
      opened={open}
      onOpenChange={setOpen}
      title={`Configure ${
        cexName === "hyperliquid" ? "SwingX Standard" : "SwingX Pro"
      } API`}
      handleClose={handleClose}
      content={
        user ? (
          <div>
            {<ConfigHyperLiquidForm form={form} />}
            <Button
              onClick={async () => {
                if (isChangeConfig) {
                  await updateKeys.mutateAsync();
                } else {
                  await saveKeys.mutateAsync();
                }
                setOpen(false);
              }}
              disabled={!isValidForm && !canTestConnection}
              className="w-full"
            >
              SAVE <KeySquare className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            Connect your Google account to start trading with SwingX
            <GoogleAuthButton />
          </div>
        )
      }
    />
  );
}

const apiKeySchema: z.ZodObject<any> = z.object({
  api_key: z.string().min(1, { message: "API key is required" }),
  secret_key: z.string().optional(),
  wallet_address: z.string().optional(),
});
