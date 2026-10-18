"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { OPEN_ROLES, type Engagement, type OpenRole, type Setting } from "@/lib/roles";
import { IconChevronDown, IconSearch } from "@/components/icons";

const ENGAGEMENTS: ("All" | Engagement)[] = ["All", "Contract", "Contract-to-hire", "Delivery team"];
const SETTINGS: ("Any" | Setting)[] = ["Any", "Remote", "Hybrid", "Onsite"];
const DEMO_TODAY = new Date("2026-09-28T12:00:00Z").getTime();

function posted(iso: string) {
  const d = Math.round((DEMO_TODAY - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "Posted today" : d === 1 ? "Posted yesterday" : `Posted ${d} days ago`;
}

function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap overflow-hidden rounded-[6px] border border-[#7b8598] bg-white">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "h-10 px-3.5 text-[15px] font-medium transition-colors duration-150",
            i > 0 && "border-l border-[#7b8598]",
            value === o ? "bg-[#eef3fd] text-[#1d47c0]" : "text-[#3d4a60] hover:bg-[#f5f7fa] hover:text-[#0b1b33]",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function RoleRow({ r, open, onToggle, onApply }: { r: OpenRole; open: boolean; onToggle: () => void; onApply: () => void }) {
  return (
    <li className={cn("border-t border-[#dfe3ea] first:border-t-0", open && "bg-[#fafbfc]")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="grid w-full gap-2 px-5 py-5 text-left transition-colors hover:bg-[#f5f7fa] sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:px-6"
      >
        <span>
          <span className="block text-[18px] leading-snug font-semibold text-[#0b1b33]">{r.title}</span>
          <span className="mt-1 block text-[15px] text-[#3d4a60]">
            {r.engagement}, {r.duration} · {r.setting}, {r.location} · {r.industry} client
          </span>
        </span>
        <span className="flex items-center gap-4 text-[14px] text-[#5f6b80] sm:justify-end">
          {posted(r.posted)}
          <IconChevronDown size={18} className={cn("text-[#2558e0] transition-transform duration-200", open && "rotate-180")} />
        </span>
      </button>
      {open && (
        <div className="anim-fade grid gap-8 px-5 pb-6 sm:px-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="max-w-[62ch] text-[17px] leading-[1.6] text-[#0b1b33]">{r.summary}</p>
            <h3 className="mt-6 text-[16px] font-semibold text-[#0b1b33]">What you&apos;ll do</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[16px] leading-[1.55] text-[#3d4a60] marker:text-[#7b8598]">
              {r.responsibilities.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[8px] border border-[#dfe3ea] bg-white p-5 lg:col-span-5">
            <h3 className="text-[16px] font-semibold text-[#0b1b33]">Skills we&apos;ll screen for</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {r.skills.map((x) => (
                <li key={x} className="rounded-[4px] border border-[#dfe3ea] bg-[#f5f7fa] px-2.5 py-1 text-[14px] text-[#0b1b33]">
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-[#3d4a60]">
              <span className="font-semibold text-[#0b1b33]">Work authorization:</span> {r.workAuth}
            </p>
            <button
              type="button"
              onClick={onApply}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[6px] bg-[#2558e0] text-[15px] font-semibold text-white transition-colors hover:bg-[#1d47c0]"
            >
              Apply for this role
            </button>
            <p className="mt-2.5 text-center text-[13px] text-[#5f6b80]">Rate is discussed at your intake call.</p>
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
    <div className="overflow-hidden rounded-[8px] border border-[#dfe3ea] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#dfe3ea] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Chips label="Engagement type" value={engagement} options={ENGAGEMENTS} onChange={setEngagement} />
          <Chips label="Work setting" value={setting} options={SETTINGS} onChange={setSetting} />
        </div>
        <div className="relative w-full lg:max-w-[300px]">
          <IconSearch size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#5f6b80]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, skill or location"
            aria-label="Search open roles"
            className="h-10 w-full rounded-[6px] border border-[#7b8598] bg-white pr-3 pl-10 text-[15px] text-[#0b1b33] placeholder:text-[#5f6b80] focus:border-[#2558e0] focus:ring-2 focus:ring-[#2558e0]/25 focus:outline-none!"
          />
        </div>
      </div>

      <p className="tnum border-b border-[#dfe3ea] bg-[#f5f7fa] px-5 py-2.5 text-[14px] text-[#3d4a60] sm:px-6" aria-live="polite">
        Showing {list.length} of {OPEN_ROLES.length} {OPEN_ROLES.length === 1 ? "role" : "roles"}
      </p>

      {list.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-[18px] font-semibold text-[#0b1b33]">No roles match these filters right now</p>
          <p className="mx-auto mt-2 max-w-[48ch] text-[16px] text-[#3d4a60]">Apply to join the bench anyway. We match new roles to consultants every week.</p>
        </div>
      ) : (
        <ul>
          {list.map((r) => (
            <RoleRow key={r.slug} r={r} open={open === r.slug} onToggle={() => setOpen(open === r.slug ? null : r.slug)} onApply={() => onApply(r)} />
          ))}
        </ul>
      )}
    </div>
  );
}
