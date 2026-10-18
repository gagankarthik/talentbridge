"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import { IconX } from "@/components/icons";

/**
 * Phone filter drawer (reference idiom): rises from the bottom edge with a grab
 * handle, a 52px header strip, a scrolling body and a sticky footer for
 * "Reset" / "Show N results". Use below `sm`; desktop keeps the toolbar inline.
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-40 bg-ink/30" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "app anim-dialog fixed inset-x-0 bottom-0 z-50 flex max-h-[88dvh] flex-col rounded-t-2xl bg-surface shadow-overlay outline-none",
            className,
          )}
        >
          <span aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line-strong" />
          <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-hair px-5">
            <Dialog.Title className="text-[15px] font-semibold text-ink">{title}</Dialog.Title>
            <Dialog.Close className="-mr-2 grid size-[30px] place-items-center rounded-full text-subtle hover:bg-well hover:text-ink" aria-label="Close">
              <IconX size={16} />
            </Dialog.Close>
          </header>
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer && <footer className="flex shrink-0 items-center gap-2 border-t border-hair px-5 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
