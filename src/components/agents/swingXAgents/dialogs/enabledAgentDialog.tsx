import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsiveDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

import {
  HybridTooltip,
  HybridTooltipTrigger,
  HybridTooltipContent,
} from "@/components/ui/hybrid-tooltip";
import { Info } from "lucide-react";
import {
  activateSwingXStandardAutoTrading,
  deactivateSwingXStandardAutoTrading,
  updateSwingXStandardTpSl,
} from "@/lib/swingxApis/swingxStandard.api";

export function EnabledAgentDialog({
  dexName,
  modelVersion,
  isEnabled,

  isTpSlEnabled,
}: {
  dexName: string;

  modelVersion?: string;
  isEnabled?: boolean;
  isTpSlEnabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateTpSlMutation } = useMutation({
    mutationFn: async () =>
      await updateSwingXStandardTpSl(
        "hyperliquid",
        modelVersion,
        !isTpSlEnabled
      ),
    onSuccess: () => {
      toast.success("TP/SL updated successfully");
      queryClient.invalidateQueries({ queryKey: ["dexUserBasicInfo"] });
    },
    onError: () => {
      toast.error("Failed to update TP/SL");
    },
  });

  const enableAllTokenMutation = useMutation({
    mutationFn: async (params: { dexName: string; modelVersion?: string }) =>
      await activateSwingXStandardAutoTrading(params.dexName, modelVersion),
    onMutate: () => {
      return toast.loading("Activating SwingX Pro auto-trading...");
    },
    onSuccess: (_, __, toastId) => {
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfo", modelVersion],
      });
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfoMobile", modelVersion],
      });
      queryClient.invalidateQueries({
        queryKey: ["hyperLiquidBalances", modelVersion],
      });
      setOpen(false);
      toast.success("SwingX Pro auto-trading activated", { id: toastId });
    },
    onError: (_, __, toastId) => {
      toast.error("Failed to activate SwingX Pro auto-trading", {
        id: toastId,
      });
    },
  });
  const deactivateAllTokenMutation = useMutation({
    mutationFn: async (params: { dexName: string; modelVersion?: string }) =>
      await deactivateSwingXStandardAutoTrading(params.dexName, modelVersion),
    onMutate: () => {
      return toast.loading("Deactivating all tokens auto-trading...");
    },
    onSuccess: (_, __, toastId) => {
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfo", modelVersion],
      });
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfoMobile", modelVersion],
      });
      queryClient.invalidateQueries({
        queryKey: ["hyperLiquidBalances", modelVersion],
      });
      setOpen(false);
      toast.success("All tokens auto-trading deactivated", { id: toastId });
    },
    onError: (_, __, toastId) => {
      toast.error("Failed to deactivate all tokens auto-trading", {
        id: toastId,
      });
    },
  });

  return (
    <ResponsiveDialog
      trigger={
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <Switch checked={isEnabled} />
            {!isEnabled ? "START TRADING" : `ON`}
          </div>
        </div>
      }
      opened={open}
      onOpenChange={setOpen}
      title={`${isEnabled ? "Disable" : "Enable"} all tokens on ${dexName}`}
      content={
        <div className="flex flex-col gap-2">
          <p>
            Are you sure you want to {isEnabled ? "disable" : "enable"} ALL
            tokens?
          </p>
          <br />
          <p className="flex items-center gap-2 hidden">
            <span className="font-bold">TP/SL:</span>{" "}
            <Switch
              checked={isTpSlEnabled}
              onClick={() => updateTpSlMutation()}
            />{" "}
            {isTpSlEnabled ? "Enabled" : "Disabled"}
            <HybridTooltip>
              <HybridTooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </HybridTooltipTrigger>
              <HybridTooltipContent>
                Enable or disable TP/SL for SwingX
              </HybridTooltipContent>
            </HybridTooltip>
          </p>
        </div>
      }
      actions={
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                isEnabled
                  ? deactivateAllTokenMutation.mutate({
                      dexName,
                      modelVersion,
                    })
                  : enableAllTokenMutation.mutate({ dexName, modelVersion })
              }
            >
              {isEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">
            ⚠️ WARNING: Trading crypto currencies using AI agents is risky. Only
            trade what you can afford to lose.
          </span>
        </div>
      }
    />
  );
}
