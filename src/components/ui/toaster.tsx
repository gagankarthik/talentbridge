"use client";

import { useWorkspace } from "@/lib/workspace-store";
import { IconAlert, IconCheck, IconX } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Toaster() {
  const { toasts, dismiss } = useWorkspace();
  return (
    <div aria-live="polite" className="no-print pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[360px] max-w-[calc(100%-32px)] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="anim-dialog pointer-events-auto flex items-start gap-3 rounded-panel bg-ink px-4 py-3 text-white shadow-lg">
          <span className={cn("mt-0.5 grid size-5 place-items-center rounded-full", t.tone === "ok" ? "bg-avail/20 text-avail" : "bg-flag/20 text-flag")}>
            {t.tone === "ok" ? <IconCheck size={13} strokeWidth={2.25} /> : <IconAlert size={13} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.body && <p className="mt-0.5 text-[13px] text-slate-300">{t.body}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="-mr-1 rounded p-0.5 text-slate-400 hover:text-white" aria-label="Dismiss">
            <IconX size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
