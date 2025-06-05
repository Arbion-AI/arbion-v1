import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsiveDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { updateSwingXStandardTpSl } from "@/lib/swingxApis/swingxStandard.api";

export function ToggleTpSl({
  isEnabled,
  model_version,
}: {
  isEnabled?: boolean;
  model_version: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateTpSlMutation, isPending: isUpdatingTpSl } = useMutation(
    {
      mutationFn: async () =>
        await updateSwingXStandardTpSl(
          "hyperliquid",
          model_version,
          !isEnabled
        ),
      onSuccess: () => {
        toast.success("TP/SL updated successfully");
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["dexUserBasicInfo", model_version],
        });
        queryClient.invalidateQueries({
          queryKey: ["dexUserBasicInfoMobile", model_version],
        });
      },
      onError: () => {
        toast.error("Failed to update TP/SL");
      },
    }
  );
  return (
    <ResponsiveDialog
      trigger={
        <div className=" flex flex-col items-start gap-1">
          <div className="flex items-center gap-1">
            <Switch checked={isEnabled} />
            {!isEnabled ? "Enable TP/SL" : `ON`}
          </div>
        </div>
      }
      opened={open}
      onOpenChange={setOpen}
      title={`${isEnabled ? "Disable" : "Enable"} TP/SL`}
      content={
        <div className="flex flex-col gap-2">
          <p>
            Are you sure you want to {isEnabled ? "disable" : "enable"} TP/SL?
          </p>
        </div>
      }
      actions={
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => updateTpSlMutation()}>
              {isUpdatingTpSl
                ? "Updating..."
                : isEnabled
                ? "Disable"
                : "Enable"}
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
