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
  /** Right-aligned actions; for a left "help" link plus actions, pass a justify-between row. */
  footer?: React.ReactNode;
  /** Tailwind max-width class, e.g. "max-w-[560px]" */
  width?: string;
  /** Sheet only: a small icon shown before the title in the 56px header strip */
  icon?: React.ReactNode;
}

const closeBtn =
  "grid size-[30px] shrink-0 place-items-center rounded-full text-subtle transition-colors duration-150 ease-power3-out hover:bg-well hover:text-ink";

/**
 * Right-hand drawer for record detail and multi-step flows (reference anatomy):
 * a 56px header strip, a scrolling body built from DetailSection blocks, and a
 * 62px footer strip. Full height, hairline left edge, slides in from the right.
 */
export function Sheet({ open, onOpenChange, title, description, children, footer, width = "max-w-[560px]", icon }: OverlayProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-40 bg-ink/25" />
        <Dialog.Content
          className={cn(
            "app anim-sheet-right fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col bg-surface shadow-overlay outline-none",
            width,
          )}
        >
          <header className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b border-hair px-6 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {icon && <span className="shrink-0 text-subtle">{icon}</span>}
              <div className="min-w-0">
                <Dialog.Title className="truncate text-[15px] font-semibold text-ink">{title}</Dialog.Title>
                {description && <Dialog.Description className="mt-0.5 text-[13px] text-subtle">{description}</Dialog.Description>}
              </div>
            </div>
            <Dialog.Close className={cn(closeBtn, "-mr-2")} aria-label="Close">
              <IconX size={16} />
            </Dialog.Close>
          </header>
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer && <footer className="flex min-h-[62px] shrink-0 items-center gap-2 border-t border-hair px-6 py-3">{footer}</footer>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * Centred confirmation or short form (reference anatomy): bordered header with
 * title and description, padded body, bordered footer with right-aligned actions.
 */
export function Modal({ open, onOpenChange, title, description, children, footer, width = "max-w-[480px]" }: OverlayProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="anim-fade fixed inset-0 z-[60] bg-ink/35 backdrop-blur-[2px]" />
        <Dialog.Content
          className={cn(
            "app anim-dialog fixed top-1/2 left-1/2 z-[70] flex max-h-[calc(100dvh-2rem)] w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl bg-surface shadow-overlay outline-none",
            width,
          )}
        >
          <div className="relative shrink-0 border-b border-hair px-6 py-5 pr-14">
            <Dialog.Title className="text-[16px] font-semibold text-ink">{title}</Dialog.Title>
            {description && <Dialog.Description className="mt-1.5 text-[13.5px] leading-snug text-muted">{description}</Dialog.Description>}
            <Dialog.Close className={cn(closeBtn, "absolute top-4 right-4")} aria-label="Close">
              <IconX size={16} />
            </Dialog.Close>
          </div>
          <div className="scroll-thin min-h-0 overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="flex shrink-0 justify-end gap-2 border-t border-hair px-6 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
