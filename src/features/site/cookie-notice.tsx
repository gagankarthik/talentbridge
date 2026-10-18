"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "talentbridge.cookie-consent";
export const OPEN_COOKIE_PREFS = "talentbridge:open-cookie-prefs";

/** Cookie consent: essential-only by default until the visitor chooses. */
export function CookieNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        if (!localStorage.getItem(KEY)) setOpen(true);
      } catch {
        /* storage unavailable: don't nag */
      }
    });
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_PREFS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFS, reopen);
  }, []);

  const choose = (value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage unavailable */
    }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="anim-dialog fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-[#dfe3ea] bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(11_27_51/0.18)] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-[400px] sm:flex-col sm:items-start sm:rounded-[8px] sm:border sm:p-5 sm:shadow-[0_12px_32px_-8px_rgb(11_27_51/0.18)]"
    >
      <p className="hidden text-[16px] font-semibold text-ink sm:block">Cookies on this site</p>
      <p className="min-w-0 basis-full text-[14px] leading-snug text-ink-2 sm:basis-auto sm:text-[15px] sm:leading-relaxed">
        Essential cookies run the site; optional ones help us improve it.{" "}
        <Link href="/privacy#cookies" className="font-medium text-brand underline underline-offset-4">
          Privacy policy
        </Link>
      </p>
      <div className="flex gap-2">
        <button onClick={() => choose("all")} className="inline-flex h-10 items-center rounded-[6px] bg-brand px-4 text-[14px] font-semibold text-white hover:bg-brand-strong">
          Accept all
        </button>
        <button
          onClick={() => choose("essential")}
          className="inline-flex h-10 items-center rounded-[6px] border border-[#8792a6] bg-white px-4 text-[14px] font-semibold text-ink hover:border-ink"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}

export function CookiePrefsButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFS))} className="hover:text-white">
      Cookie preferences
    </button>
  );
}
