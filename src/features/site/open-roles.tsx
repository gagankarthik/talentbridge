"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { OPEN_ROLES, type Engagement, type OpenRole, type Setting } from "@/lib/roles";
import { IconBuilding, IconCalendar, IconChevronDown, IconGlobe, IconId, IconSearch } from "@/components/icons";

const ENGAGEMENTS: ("All" | Engagement)[] = ["All", "Contract", "Contract-to-hire", "Delivery team"];
const SETTINGS: ("Any" | Setting)[] = ["Any", "Remote", "Hybrid", "Onsite"];
const DEMO_TODAY = new Date("2026-09-28T12:00:00Z").getTime();

function posted(iso: string) {
  const d = Math.round((DEMO_TODAY - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "Posted today" : d === 1 ? "Posted yesterday" : `Posted ${d} days ago`;
}

function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn("h-9 rounded-full px-4 text-[14px] transition-colors", value === o ? "bg-ink font-medium text-white" : "text-ink-2 ring-1 ring-inset ring-line-strong hover:bg-paper")}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function RoleRow({ r, open, onToggle, onApply }: { r: OpenRole; open: boolean; onToggle: () => void; onApply: () => void }) {
  return (
    <li className="border-b border-line">
      <button type="button" onClick={onToggle} aria-expanded={open} className="grid w-full gap-3 py-6 text-left sm:grid-cols-[1fr_auto] sm:items-center">
        <span>
          <span className="block text-[19px] font-semibold tracking-[-0.01em] text-ink">{r.title}</span>
          <span className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <IconCalendar size={15} className="text-subtle" />
              {r.engagement}, {r.duration}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconGlobe size={15} className="text-subtle" />
              {r.setting}, {r.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IconBuilding size={15} className="text-subtle" />
              {r.industry} client
            </span>
          </span>
        </span>
        <span className="flex items-center gap-4 text-[13px] text-subtle sm:justify-end">
          {posted(r.posted)}
          <IconChevronDown size={18} className={cn("text-ink transition-transform", open && "rotate-180")} />
        </span>
      </button>
      {open && (
        <div className="anim-fade grid gap-8 pb-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="max-w-[60ch] text-[16px] leading-relaxed text-ink-2">{r.summary}</p>
            <h3 className="mt-6 text-[14px] font-semibold text-ink">What you&apos;ll do</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] text-muted">
              {r.responsibilities.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[16px] bg-paper p-6">
            <h3 className="text-[14px] font-semibold text-ink">Skills we&apos;ll screen for</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.skills.map((s) => (
                <span key={s} className="rounded-full bg-surface px-3 py-1 text-[13px] text-ink-2 ring-1 ring-line">
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-5 flex items-start gap-2 text-[14px] text-muted">
              <IconId size={16} className="mt-0.5 shrink-0 text-subtle" />
              {r.workAuth}
            </p>
            <button onClick={onApply} className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-acc-teal text-[15px] font-semibold text-white hover:bg-acc-teal/90">
              Apply for this role
            </button>
            <p className="mt-3 text-center text-xs text-subtle">Rate is discussed at your intake call.</p>
          </div>
        </div>
      )}
    </li>
  );
}

/** Filterable open-roles board. "Apply" hands the role to the application form. */
export function OpenRoles() {
  const router = useRouter();
  const onApply = (r: OpenRole) => {
    router.replace(`/careers?role=${r.slug}`, { scroll: false });
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const [engagement, setEngagement] = useState<"All" | Engagement>("All");
  const [setting, setSetting] = useState<"Any" | Setting>("Any");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return OPEN_ROLES.filter(
      (r) =>
        (engagement === "All" || r.engagement === engagement) &&
        (setting === "Any" || r.setting === setting) &&
        (!n || [r.title, r.industry, r.location, ...r.skills].join(" ").toLowerCase().includes(n)),
    );
  }, [engagement, setting, q]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <Chips label="Engagement type" value={engagement} options={ENGAGEMENTS} onChange={setEngagement} />
          <Chips label="Work setting" value={setting} options={SETTINGS} onChange={setSetting} />
        </div>
        <div className="relative w-full lg:max-w-[280px]">
          <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, skill or location"
            aria-label="Search open roles"
            className="h-11 w-full rounded-full bg-surface pr-4 pl-10 text-[14px] ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-brand focus:outline-none"
          />
        </div>
      </div>

      <p className="tnum mt-5 text-[14px] text-muted" aria-live="polite">
        {list.length} open {list.length === 1 ? "role" : "roles"}
      </p>

      {list.length === 0 ? (
        <div className="mt-6 rounded-[16px] bg-paper px-6 py-12 text-center">
          <p className="text-[16px] font-semibold text-ink">No roles match these filters right now.</p>
          <p className="mt-1 text-[15px] text-muted">Apply to join the bench anyway. We match new roles to consultants every week.</p>
        </div>
      ) : (
        <ul className="mt-2">
          {list.map((r) => (
            <RoleRow key={r.slug} r={r} open={open === r.slug} onToggle={() => setOpen(open === r.slug ? null : r.slug)} onApply={() => onApply(r)} />
          ))}
        </ul>
      )}
    </div>
  );
}
