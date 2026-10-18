"use client";

import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-checkbox";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { AVAILABILITY_FILTERS, WORK_AUTH_LABEL } from "@/lib/format";
import {
  RATE_CEIL,
  RATE_FLOOR,
  type Facets,
  type TalentQuery,
} from "@/lib/query";
import type {
  Clearance,
  Cloud,
  Discipline,
  Timezone,
  WorkAuth,
} from "@/lib/types";
import { Checkbox, Input, Segmented } from "@/components/ui/form";
import { CountBadge } from "@/components/ui/data-display";
import { IconCheck, IconChevronDown } from "@/components/icons";

type ListKey =
  | "discipline"
  | "skills"
  | "clouds"
  | "workAuth"
  | "clearance"
  | "timezone"
  | "availability";
type CountKey = Exclude<keyof Facets, "fresh">;

export interface QuickView {
  label: string;
  q: Partial<TalentQuery>;
}

function Section({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="px-5 py-4 shadow-[inset_0_-1px_0_var(--color-hair)] last:shadow-none">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex min-h-8 w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-ink">{title}</span>
          {!!count && <CountBadge tone="brand">{count}</CountBadge>}
        </span>
        <IconChevronDown
          size={16}
          className={cn(
            "text-ink-2 transition-transform duration-150",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open && <div className="mt-2.5">{children}</div>}
    </section>
  );
}

const TZ_LABEL: Record<Timezone, string> = {
  ET: "Eastern (ET)",
  CT: "Central (CT)",
  MT: "Mountain (MT)",
  PT: "Pacific (PT)",
};

export function FilterPanel({
  q,
  set,
  facets,
  skills,
  quickViews,
  activeView,
  onView,
  scope = "all",
}: {
  q: TalentQuery;
  set: (patch: Partial<TalentQuery>) => void;
  facets?: Facets;
  skills: string[];
  /** Optional list of saved views at the top (the explorer shows them as tabs instead) */
  quickViews?: QuickView[];
  activeView?: string | null;
  onView?: (v: QuickView) => void;
  /** "all" for the phone sheet; "more" for the desktop sheet, which leaves out the toolbar's Practice, Availability and Work authorization */
  scope?: "all" | "more";
}) {
  const [skillSearch, setSkillSearch] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);

  function toggle<K extends ListKey>(key: K, value: TalentQuery[K][number]) {
    const list = q[key] as string[];
    set({
      [key]: list.includes(value as string)
        ? list.filter((x) => x !== value)
        : [...list, value],
    } as Partial<TalentQuery>);
  }

  const list = <K extends ListKey>(
    key: K,
    facetKey: CountKey,
    options: { value: TalentQuery[K][number]; label: string }[],
  ) => (
    <div className="space-y-0.5">
      {options.map((o) => {
        const checked = (q[key] as string[]).includes(o.value as string);
        const n = facets?.[facetKey]?.[o.value as string] ?? 0;
        return (
          <Checkbox
            key={o.value as string}
            id={`${key}-${o.value}`}
            checked={checked}
            onCheckedChange={() => toggle(key, o.value)}
            label={o.label}
            count={facets ? n : undefined}
            muted={!!facets && n === 0 && !checked}
          />
        );
      })}
    </div>
  );

  // Skills ranked by how many current results have them; selected skills pinned first
  const counted = skills
    .map((skill) => ({ skill, count: facets?.skills?.[skill] ?? 0 }))
    .filter((s) => s.skill.toLowerCase().includes(skillSearch.toLowerCase()))
    .sort(
      (a, b) =>
        Number(q.skills.includes(b.skill)) -
          Number(q.skills.includes(a.skill)) ||
        b.count - a.count ||
        a.skill.localeCompare(b.skill),
    );
  const visibleSkills =
    skillSearch || showAllSkills ? counted : counted.slice(0, 10);

  const freshToggle = (
    <label className="mt-2 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md border border-hair bg-canvas px-3 py-2 text-[13px] text-ink">
      <span>
        Confirmed in the last 7 days
        {facets && (
          <span className="tnum ml-1.5 text-[12px] text-ink-2">
            {facets.fresh}
          </span>
        )}
      </span>
      <Switch.Root
        checked={q.freshOnly}
        onCheckedChange={(v) => set({ freshOnly: v === true })}
        aria-label="Only candidates confirmed in the last 7 days"
        className="relative h-5 w-9 shrink-0 rounded-full bg-line-strong transition-colors duration-150 ease-power3-out data-[state=checked]:bg-cobalt"
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 size-4 rounded-full bg-surface shadow transition-transform",
            q.freshOnly && "translate-x-4",
          )}
        />
      </Switch.Root>
    </label>
  );

  return (
    <div>
      {quickViews && onView && (
        <Section title="Quick views">
          <ul
            role="radiogroup"
            aria-label="Quick views"
            className="space-y-0.5"
          >
            {quickViews.map((v) => {
              const on = activeView === v.label;
              return (
                <li key={v.label}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onView(v)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[8px] px-2.5 py-1.5 text-left text-[13px] transition-colors",
                      on
                        ? "bg-cobalt-wash font-medium text-cobalt-strong"
                        : "text-ink-2 hover:bg-well",
                    )}
                  >
                    {v.label}
                    {on && <IconCheck size={14} strokeWidth={2.25} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {scope === "more" && (
        <Section title="Verification" count={q.freshOnly ? 1 : 0}>
          {freshToggle}
        </Section>
      )}

      {scope === "all" && (
        <Section title="Practice" count={q.discipline.length}>
          {list<"discipline">(
            "discipline",
            "discipline",
            (["Data & AI", "DevOps / Cloud", "Full-Stack"] as Discipline[]).map(
              (d) => ({
                value: d,
                label: d === "DevOps / Cloud" ? "Cloud & DevOps" : d,
              }),
            ),
          )}
        </Section>
      )}

      {scope === "all" && (
        <Section
          title="Availability"
          count={q.availability.length + (q.freshOnly ? 1 : 0)}
        >
          {list<"availability">(
            "availability",
            "availability",
            AVAILABILITY_FILTERS,
          )}
          {freshToggle}
        </Section>
      )}

      {scope === "all" && (
        <Section title="Work authorization" count={q.workAuth.length}>
          {list<"workAuth">(
            "workAuth",
            "workAuth",
            (Object.keys(WORK_AUTH_LABEL) as WorkAuth[]).map((w) => ({
              value: w,
              label: WORK_AUTH_LABEL[w],
            })),
          )}
        </Section>
      )}

      <Section title="Skills" count={q.skills.length}>
        <Input
          value={skillSearch}
          onChange={(e) => setSkillSearch(e.target.value)}
          placeholder="Find a skill"
          aria-label="Find a skill"
          className="mb-2 h-9 rounded-md border border-line-strong text-[14px] ring-0 placeholder:text-subtle focus:border-cobalt focus:ring-0 focus:shadow-[0_0_0_3px_rgb(37_88_224/0.18)]"
        />
        <div className="space-y-0.5">
          {visibleSkills.map((s) => (
            <Checkbox
              key={s.skill}
              id={`skill-${s.skill}`}
              checked={q.skills.includes(s.skill)}
              onCheckedChange={() => toggle("skills", s.skill)}
              label={s.skill}
              count={facets ? s.count : undefined}
              muted={!!facets && s.count === 0 && !q.skills.includes(s.skill)}
            />
          ))}
          {visibleSkills.length === 0 && (
            <p className="py-1 text-[13px] text-ink-2">
              No skill matches &ldquo;{skillSearch}&rdquo;.
            </p>
          )}
          {!skillSearch && counted.length > 10 && (
            <button
              type="button"
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="mt-1 text-[13px] font-medium text-cobalt hover:underline"
            >
              {showAllSkills ? "Show fewer" : `Show all ${counted.length}`}
            </button>
          )}
        </div>
        {q.skills.length > 1 && (
          <p className="mt-2 text-[13px] text-ink-2">
            Showing candidates with every selected skill.
          </p>
        )}
      </Section>

      <Section
        title="Hourly rate"
        count={q.rateMin !== RATE_FLOOR || q.rateMax !== RATE_CEIL ? 1 : 0}
      >
        <Segmented
          label="Rate basis"
          value={q.rateBasis}
          onChange={(v) => set({ rateBasis: v })}
          options={[
            { value: "c2c", label: "C2C", title: "Corp-to-corp" },
            { value: "w2", label: "W2" },
          ]}
        />
        <Slider.Root
          className="relative mt-5 flex h-5 w-full touch-none items-center select-none"
          min={RATE_FLOOR}
          max={RATE_CEIL}
          step={5}
          value={[q.rateMin, q.rateMax]}
          onValueChange={([a, b]) => set({ rateMin: a, rateMax: b })}
          minStepsBetweenThumbs={1}
          aria-label="Hourly rate range"
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-[#dfe3ea]">
            <Slider.Range className="absolute h-full rounded-full bg-cobalt" />
          </Slider.Track>
          {["Minimum rate", "Maximum rate"].map((l) => (
            <Slider.Thumb
              key={l}
              aria-label={l}
              className="block size-4 rounded-full bg-surface border-2 border-cobalt focus-visible:ring-4 focus-visible:ring-cobalt/30 focus-visible:outline-none"
            />
          ))}
        </Slider.Root>
        <p className="tnum mt-2 flex justify-between text-[13px] text-ink-2">
          <span>${q.rateMin}/hr</span>
          <span>
            ${q.rateMax}
            {q.rateMax === RATE_CEIL ? "+" : ""}/hr
          </span>
        </p>
      </Section>

      <Section
        title="Cloud platform"
        count={q.clouds.length}
        defaultOpen={false}
      >
        {list<"clouds">(
          "clouds",
          "clouds",
          (["AWS", "Azure", "GCP"] as Cloud[]).map((c) => ({
            value: c,
            label: c,
          })),
        )}
      </Section>

      <Section title="Clearance" count={q.clearance.length} defaultOpen={false}>
        {list<"clearance">(
          "clearance",
          "clearance",
          (["None", "Public Trust", "Secret", "Top Secret"] as Clearance[]).map(
            (c) => ({ value: c, label: c === "None" ? "No clearance" : c }),
          ),
        )}
      </Section>

      <Section title="Time zone" count={q.timezone.length} defaultOpen={false}>
        {list<"timezone">(
          "timezone",
          "timezone",
          (["ET", "CT", "MT", "PT"] as Timezone[]).map((t) => ({
            value: t,
            label: TZ_LABEL[t],
          })),
        )}
      </Section>

      <Section title="Technical screen score" count={q.minScore ? 1 : 0}>
        <Slider.Root
          className="relative mt-3 flex h-5 w-full touch-none items-center select-none"
          min={0}
          max={95}
          step={5}
          value={[q.minScore]}
          onValueChange={([v]) => set({ minScore: v })}
          aria-label="Minimum technical screen score"
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-[#dfe3ea]">
            <Slider.Range className="absolute h-full rounded-full bg-cobalt" />
          </Slider.Track>
          <Slider.Thumb
            aria-label="Minimum score"
            className="block size-4 rounded-full bg-surface border-2 border-cobalt focus-visible:ring-4 focus-visible:ring-cobalt/30 focus-visible:outline-none"
          />
        </Slider.Root>
        <p className="tnum mt-2 text-[13px] text-ink-2">
          {q.minScore ? `Score ${q.minScore} or higher` : "Any score"}
        </p>
      </Section>
    </div>
  );
}
