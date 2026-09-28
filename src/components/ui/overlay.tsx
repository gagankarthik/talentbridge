"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { IconX } from "@/components/icons";

interface OverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

/** Right-hand drawer for record detail and multi-step flows. */
export function Sheet({ open, onOpenChange, title, description, children, footer, width = "max-w-[640px]" }: OverlayProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-40 bg-ink/30" />
        <Dialog.Content
          className={cn(
            "anim-sheet fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-surface shadow-[-24px_0_48px_-24px_rgb(15_23_42/0.25)] outline-none sm:inset-y-2 sm:right-2 sm:rounded-sheet sm:ring-1 sm:ring-line",
            width,
          )}
        >
          <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-[15px] font-semibold text-ink">{title}</Dialog.Title>
              {description && <Dialog.Description className="mt-0.5 text-sm text-subtle">{description}</Dialog.Description>}
            </div>
            <Dialog.Close className="-mr-2 rounded-ctl p-1.5 text-subtle hover:bg-placed-bg hover:text-ink" aria-label="Close">
              <IconX />
            </Dialog.Close>
          </header>
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer && <footer className="border-t border-line bg-canvas/60 px-6 py-3 sm:rounded-b-sheet">{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Centered confirmation / short form. */
export function Modal({ open, onOpenChange, title, description, children, footer, width = "max-w-[460px]" }: OverlayProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-[60] bg-ink/40" />
        <Dialog.Content
          className={cn(
            "anim-dialog fixed top-1/2 left-1/2 z-[70] w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-panel bg-surface shadow-xl ring-1 ring-line outline-none",
            width,
          )}
        >
          <div className="px-6 pt-5">
            <Dialog.Title className="text-[15px] font-semibold text-ink">{title}</Dialog.Title>
            {description && <Dialog.Description className="mt-1 text-sm text-muted">{description}</Dialog.Description>}
          </div>
          <div className="px-6 py-4">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-line px-6 py-3">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
