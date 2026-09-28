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
    <div role="dialog" aria-label="Cookie preferences" className="anim-dialog fixed right-4 bottom-4 left-4 z-50 max-w-[420px] rounded-[16px] bg-surface p-5 shadow-[0_24px_56px_-16px_rgb(7_26_20/0.35)] ring-1 ring-line sm:left-auto">
      <p className="text-[15px] font-semibold text-ink">Cookies on this site</p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
        We use essential cookies to run the site and optional ones to understand how it&apos;s used. Read our{" "}
        <Link href="/privacy#cookies" className="font-medium text-brand underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => choose("all")} className="inline-flex h-10 items-center rounded-full bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-strong">
          Accept all
        </button>
        <button onClick={() => choose("essential")} className="inline-flex h-10 items-center rounded-full px-5 text-[14px] font-semibold text-ink ring-1 ring-inset ring-line-strong hover:bg-paper">
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
