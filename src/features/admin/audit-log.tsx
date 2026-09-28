"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { fmtDateTime } from "@/lib/format";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Input, Segmented } from "@/components/ui/form";
import { IconExport, IconSearch } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { Select } from "@/components/ui/select";

type Actor = "all" | "platform" | "customer" | "system";

export function AuditLog() {
  const { audit, orgs } = useAdmin();
  const { notify } = useWorkspace();
  const params = useSearchParams();
  const [org, setOrg] = useState(params.get("org") ?? "all");
  const [actor, setActor] = useState<Actor>("all");
  const [q, setQ] = useState("");

  const orgName = (id: string | null) => (id ? orgs.find((o) => o.id === id)?.name ?? id : "Platform");
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return audit.filter((e) => (org === "all" || e.orgId === org) && (actor === "all" || e.actorType === actor) && (!n || `${e.actor} ${e.action} ${e.detail}`.toLowerCase().includes(n)));
  }, [audit, org, actor, q]);

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [["Time", "Actor", "Actor type", "Organization", "Action", "Detail"], ...list.map((e) => [e.at, e.actor, e.actorType, orgName(e.orgId), e.action, e.detail])];
    const blob = new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `audit-log-${list.length}-events.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify({ tone: "ok", title: `Exported ${list.length} events` });
  };

  return (
    <div className="space-y-4 px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 lg:flex-1">
          <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, action or detail" aria-label="Search audit log" className="pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select label="Organization" value={org} onValueChange={setOrg} className="min-w-0 sm:w-[240px]" options={[{ value: "all", label: "All organizations" }, ...orgs.map((o) => ({ value: o.id, label: o.name }))]} />
          <Segmented
            label="Actor"
            value={actor}
            onChange={setActor}
            options={[
              { value: "all", label: "All" },
              { value: "platform", label: "Platform" },
              { value: "customer", label: "Customer" },
              { value: "system", label: "System" },
            ]}
          />
          <Button onClick={exportCsv} disabled={!list.length}>
            <IconExport size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[12px] bg-surface ring-1 ring-line">
        <table className="w-full min-w-[820px] text-left text-[13.5px]">
          <thead className="bg-canvas text-xs text-subtle">
            <tr className="border-b border-line">
              <th className="px-5 py-2.5 font-medium">Time</th>
              <th className="py-2.5 font-medium">Actor</th>
              <th className="py-2.5 font-medium">Organization</th>
              <th className="px-5 py-2.5 font-medium">Event</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e.id} className="border-b border-line align-top last:border-0">
                <td className="tnum px-5 py-3 whitespace-nowrap text-subtle">{fmtDateTime(e.at)}</td>
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", e.actorType === "platform" ? "bg-cobalt" : e.actorType === "customer" ? "bg-line-strong" : "bg-faint")} />
                    <span className="font-medium text-ink">{e.actor}</span>
                  </span>
                  <span className="ml-4 block text-xs text-subtle capitalize">{e.actorType}</span>
                </td>
                <td className="py-3 text-ink-2">{orgName(e.orgId)}</td>
                <td className="px-5 py-3">
                  <span className="block font-medium text-ink">{e.action}</span>
                  <span className="block text-subtle">{e.detail}</span>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-[14px] text-subtle">
                  No events match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
