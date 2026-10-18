"use client";

import Link from "next/link";
import { useDemoNow } from "@/lib/clock";
import { Button } from "@/components/ui/button";
import { IconShield } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { OrgMark } from "./ui";

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
    <div
      role="status"
      className="no-print flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-tag-amber-border bg-tag-amber-bg px-4 py-2 text-[13px] text-tag-amber-text sm:px-6"
    >
      <IconShield size={15} className="shrink-0" />
      <OrgMark name={org?.name ?? session.orgId} size={20} />
      <span className="min-w-0">
        Support access to{" "}
        <Link
          href={`/admin/organizations/${session.orgId}`}
          className="font-semibold underline decoration-tag-amber-border underline-offset-2 hover:decoration-current"
        >
          {org?.name ?? session.orgId}
        </Link>
        . Everything you do is recorded in the audit log.
      </span>
      <span className="tnum ml-auto rounded-full bg-surface px-2 py-0.5 text-[12.5px] font-semibold shadow-[0_0_0_1px_var(--color-tag-amber-border)]">
        {m}:{String(sec).padStart(2, "0")} left
      </span>
      <Button size="sm" onClick={endSession}>
        End session
      </Button>
    </div>
  );
}
