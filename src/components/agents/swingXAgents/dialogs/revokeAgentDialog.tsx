import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsiveDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Key } from "lucide-react";
import { revokeSwingXStandardBot } from "@/lib/swingxApis/swingxStandard.api";

export function RevokeAgentDialog({
  dexName,
  model_version,
}: {
  dexName: string;
  model_version: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const revokeBot = useMutation({
    mutationFn: () => revokeSwingXStandardBot(dexName, model_version),

    onMutate: () => {
      return toast.loading("Revoking agent...");
    },
    onSuccess: (_, __, id) => {
      toast.success("Agent revoked successfully", { id });
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfo", model_version],
      });
      queryClient.invalidateQueries({
        queryKey: ["dexUserBasicInfoMobile", model_version],
      });
      setOpen(false);
    },
    onError: (error, __, id) => {
      toast.error(error.message, { id });
    },
  });

  return (
    <ResponsiveDialog
      trigger={
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1 "
        >
          Delete Agent <Key className="h-4 w-4" />
        </Button>
      }
      opened={open}
      onOpenChange={setOpen}
      title="Delete Hyperliquid Agent"
      content={
        <div>
          <p>Are you sure you want to revoke this agent?</p>
          <p className="text-sm text-yellow-400 animate-pulse">
            This action can't be undone.
          </p>
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => revokeBot.mutate()}>
            Delete Agent
          </Button>
        </div>
      }
    />
  );
}
