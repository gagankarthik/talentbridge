"use client";

import Link from "next/link";
import { useDemoNow } from "@/lib/clock";
import { useAdmin } from "./admin-store";

/** Always-visible banner while a staff member has support access to a customer organization. */
export function SupportBanner() {
  const { session, orgs, endSession } = useAdmin();
  const now = useDemoNow(1000);
  if (!session) return null;
  const left = session.expiresAt - now;
  if (left <= 0) return null;
  const org = orgs.find((o) => o.id === session.orgId);
  const m = Math.floor(left / 60_000);
  const sec = Math.floor((left % 60_000) / 1000);
  return (
    <div role="status" className="no-print sticky top-16 z-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-notice/40 bg-notice-bg px-4 py-2.5 text-[13.5px] text-notice-ink sm:px-6">
      <span className="size-2 rounded-full bg-notice" />
      <span>
        Support access to{" "}
        <Link href={`/admin/organizations/${session.orgId}`} className="font-semibold underline underline-offset-2">
          {org?.name ?? session.orgId}
        </Link>{" "}
        is active. Everything you do is recorded in the audit log.
      </span>
      <span className="tnum font-semibold">
        {m}:{String(sec).padStart(2, "0")} left
      </span>
      <button onClick={endSession} className="ml-auto rounded-[8px] bg-surface px-3 py-1.5 text-[13px] font-semibold text-ink ring-1 ring-notice/40 hover:bg-canvas">
        End session
      </button>
    </div>
  );
}
