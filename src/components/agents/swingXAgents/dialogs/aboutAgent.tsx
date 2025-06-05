import { ResponsiveDialog } from "@/components/ui/responsiveDialog";

export function AboutAgent({
  description,
  trigger,
}: {
  trigger: React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <ResponsiveDialog
      trigger={trigger}
      content={
        <div className="p-6 max-w-3xl mx-auto text-white">
          <div className="space-y-6">{description}</div>
        </div>
      }
    />
  );
}
