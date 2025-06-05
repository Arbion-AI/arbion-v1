import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getPlatform, useMediaQuery } from "@/lib/useMediaQuery";

import { ReactNode } from "react";

interface ResponsiveDialogProps {
  opened?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: ReactNode;
  falseTrigger?: ReactNode;
  content: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  handleClose?: () => void;
  classNameContent?: string;
  smallWidth?: boolean;
}

const ResponsiveDialog = ({
  trigger,
  falseTrigger,
  title,
  description,
  content,
  actions,
  opened,
  onOpenChange,
  handleClose,
  classNameContent,
  smallWidth = true,
}: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const DialogComponent = isDesktop ? Dialog : Drawer;
  const DialogContentComponent = isDesktop ? DialogContent : DrawerContent;
  const DialogHeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const DialogTitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  const DialogTriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;

  // Create a wrapper for onOpenChange that also calls handleClose
  const handleOpenChange = (open: boolean) => {
    if (!open && handleClose) {
      handleClose();
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return falseTrigger ? (
    falseTrigger
  ) : (
    <DialogComponent open={opened} onOpenChange={handleOpenChange}>
      <DialogTriggerComponent asChild>{trigger}</DialogTriggerComponent>
      <DialogContentComponent
        className={`${
          isDesktop
            ? "max-h-[90vh] overflow-y-auto "
            : `max-h-[80vh] touch-pan-y ${
                getPlatform() === "ios" ? "overflow-y-scroll" : ""
              }`
        } ${classNameContent} ${smallWidth && "w-full max-w-lg"}`}
      >
        <DialogHeaderComponent className="flex flex-col items-center">
          <DialogTitleComponent>{title}</DialogTitleComponent>
        </DialogHeaderComponent>
        {description && <p>{description}</p>}
        {content}
        {actions && (
          <div className="mt-4 flex flex-col md:flex-row gap-2">{actions}</div>
        )}
      </DialogContentComponent>
    </DialogComponent>
  );
};

export { ResponsiveDialog };
