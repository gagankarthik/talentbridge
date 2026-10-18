"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { AVAILABILITY_FILTERS, WORK_AUTH_LABEL } from "@/lib/format";
import { defaultQuery, paramsToQuery, queryToParams, RATE_CEIL, RATE_FLOOR, type Facets, type ScoredCandidate, type SortKey, type TalentQuery } from "@/lib/query";
import type { Availability, Discipline, WorkAuth } from "@/lib/types";
import { PageBody, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/form";
import { Sheet } from "@/components/ui/overlay";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { CountBadge, EmptyState } from "@/components/ui/data-display";
import { ActiveFilters, FilterMenu, FilterSearch, Toolbar, type ActiveFilter, type FilterOption } from "@/components/ui/filter-menu";
import { MenuCheckbox, MenuItem, MenuLabel, MenuRadio, MenuRadioGroup, MenuSeparator, OverflowMenu } from "@/components/ui/overflow-menu";
import { UnderlineTabs } from "@/components/ui/tabs";
import { cardClass } from "@/components/ui/page";
import { IconAlert, IconBookmark, IconExport, IconGrid, IconRows, IconSearch, IconSliders } from "@/components/icons";
import { useWorkspace } from "@/lib/workspace-store";
import { RequestTalentButton } from "@/features/request-engine/talent-request";
import { CandidateCard } from "./candidate-card";
import { CandidateGrid, COLUMN_CHOICES, DEFAULT_COLS, toCsv, type ColKey, type GroupBy } from "./candidate-grid";
import { CandidateSheet } from "./candidate-sheet";
import { FilterPanel } from "./filter-panel";

interface SearchResponse {
  total: number;
  results: ScoredCandidate[];
  facets: Facets;
}

const SORTS: FilterOption<SortKey>[] = [
  { value: "match", label: "Best match" },
  { value: "available", label: "Soonest available" },
  { value: "score", label: "Highest screen score" },
  { value: "fresh", label: "Most recently verified" },
  { value: "rate_asc", label: "Rate, low to high" },
  { value: "rate_desc", label: "Rate, high to low" },
];

const GROUPS: { value: GroupBy; label: string }[] = [
  { value: "none", label: "No grouping" },
  { value: "discipline", label: "Practice" },
  { value: "availability", label: "Availability" },
  { value: "workAuthorization", label: "Work authorization" },
];

/** Saved views shown as page tabs. A matching view is the state, so it never also shows as chips. */
const VIEWS: { value: string; label: string; q: Partial<TalentQuery> }[] = [
  { value: "all", label: "All profiles", q: {} },
  { value: "now", label: "Start immediately", q: { availability: ["IMMEDIATE"], freshOnly: true } },
  { value: "top", label: "Top screen scores", q: { minScore: 90, sort: "score" } },
  { value: "us", label: "US citizens and green card", q: { workAuth: ["US_CITIZEN", "GREEN_CARD"] } },
  { value: "cleared", label: "Clearance holders", q: { clearance: ["Public Trust", "Secret", "Top Secret"] } },
];

const PRACTICES: { value: Discipline; label: string }[] = [
  { value: "Data & AI", label: "Data & AI" },
  { value: "DevOps / Cloud", label: "Cloud & DevOps" },
  { value: "Full-Stack", label: "Full-Stack" },
];

const TOOLBAR_KEYS = new Set(["discipline", "availability", "workAuth"]);

interface Applied {
  key: string;
  /** Which query field it came from */
  field: string;
  label: string;
  value: string;
  clear: Partial<TalentQuery>;
}

/** Every applied filter as label + value, for the chip row and the counts. */
function appliedFilters(q: TalentQuery): Applied[] {
  const out: Applied[] = [];
  const each = <K extends "discipline" | "skills" | "clouds" | "workAuth" | "clearance" | "timezone" | "availability">(k: K, label: string, fmt: (v: string) => string = (v) => v) =>
    (q[k] as string[]).forEach((v) => out.push({ key: `${k}:${v}`, field: k, label, value: fmt(v), clear: { [k]: (q[k] as string[]).filter((x) => x !== v) } as Partial<TalentQuery> }));
  if (q.q) out.push({ key: "q", field: "q", label: "Search", value: `“${q.q}”`, clear: { q: "" } });
  each("discipline", "Practice", (v) => PRACTICES.find((p) => p.value === v)?.label ?? v);
  each("availability", "Availability", (v) => AVAILABILITY_FILTERS.find((a) => a.value === v)?.label ?? v);
  each("workAuth", "Work authorization", (v) => WORK_AUTH_LABEL[v as keyof typeof WORK_AUTH_LABEL]);
  each("skills", "Skill");
  each("clouds", "Cloud");
  each("clearance", "Clearance", (v) => (v === "None" ? "No clearance" : v));
  each("timezone", "Time zone");
  if (q.rateMin !== RATE_FLOOR || q.rateMax !== RATE_CEIL)
    out.push({ key: "rate", field: "rate", label: `Rate (${q.rateBasis.toUpperCase()})`, value: `$${q.rateMin}–$${q.rateMax}/hr`, clear: { rateMin: RATE_FLOOR, rateMax: RATE_CEIL } });
  if (q.minScore) out.push({ key: "score", field: "score", label: "Screen score", value: `${q.minScore}+`, clear: { minScore: 0 } });
  if (q.freshOnly) out.push({ key: "fresh", field: "fresh", label: "Verification", value: "Confirmed in 7 days", clear: { freshOnly: false } });
  return out;
}

/**
 * A toolbar filter over a multi-value query field: "Any" clears it, an option
 * selects only that value, and a multi-selection made in More filters shows as
 * "N selected". At rest it reads "Practice ▾"; set, "Practice: Data & AI".
 */
function ListFilter<V extends string>({
  label,
  values,
  options,
  counts,
  onChange,
}: {
  label: string;
  values: V[];
  options: { value: V; label: string }[];
  counts?: Record<string, number>;
  onChange: (v: V[]) => void;
}) {
  const value = values.length === 0 ? "any" : values.length === 1 ? values[0] : "multi";
  const opts: FilterOption[] = [
    { value: "any", label: "Any" },
    ...options.map((o) => ({ value: o.value as string, label: o.label, meta: counts ? (counts[o.value] ?? 0) : undefined })),
    ...(values.length > 1 ? [{ value: "multi", label: `${values.length} selected` }] : []),
  ];
  return <FilterMenu label={label} value={value} allValue="any" options={opts} onChange={(v) => v !== "multi" && onChange(v === "any" ? [] : [v as V])} />;
}

export function TalentExplorer({ skills }: { skills: { skill: string; count: number }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState<TalentQuery>(() => paramsToQuery(new URLSearchParams(params.toString())));
  const [text, setText] = useState(q.q);
  const [view, setView] = useState<"table" | "cards">("table");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [selected, setSelected] = useState<ScoredCandidate | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [cols, setCols] = useState<ColKey[]>(DEFAULT_COLS);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const { isShortlisted, toggleShortlist, notify } = useWorkspace();
  const searchRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<TalentQuery>) => setQ((prev) => ({ ...prev, ...patch }));
  const qs = useMemo(() => queryToParams(q).toString(), [q]);

  // Keep the URL shareable
  useEffect(() => {
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [qs, pathname, router]);

  // Debounce free text
  useEffect(() => {
    const t = setTimeout(() => setQ((prev) => (prev.q === text ? prev : { ...prev, q: text })), 220);
    return () => clearTimeout(t);
  }, [text]);

  // "/" focuses this page's search (the shell's palette yields when the key is handled here)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { data, isFetching, isError, refetch } = useQuery<SearchResponse>({
    queryKey: ["talent", qs],
    queryFn: async () => {
      const r = await fetch(`/api/candidates?${qs}`);
      if (!r.ok) throw new Error("Search failed");
      return r.json();
    },
    placeholderData: keepPreviousData,
  });

  // A new search starts a new selection
  const [pickedFor, setPickedFor] = useState(qs);
  if (pickedFor !== qs) {
    setPickedFor(qs);
    setPicked(new Set());
  }
  const pickedRows = (data?.results ?? []).filter((r) => picked.has(r.id));
  const shortlistPicked = () => {
    const add = pickedRows.filter((r) => !isShortlisted(r.id));
    add.forEach((r) => toggleShortlist(r));
    setPicked(new Set());
    if (!add.length) notify({ tone: "ok", title: "Already on your shortlist" });
  };
  const exportCsv = (list: ScoredCandidate[]) => {
    if (!list.length) return;
    const blob = new Blob([toCsv(list, q.rateBasis)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `talent-${list.length}-profiles.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    notify({ tone: "ok", title: `Exported ${list.length} ${list.length === 1 ? "profile" : "profiles"}`, body: "Blind fields only. Names and contacts are never included." });
  };

  const reset = () => {
    setText("");
    setQ(defaultQuery);
  };
  const applied = appliedFilters(q);
  const moreCount = applied.filter((a) => !TOOLBAR_KEYS.has(a.field) && a.field !== "q").length;
  const activeView =
    VIEWS.find((v) => queryToParams({ ...defaultQuery, ...v.q, sort: q.sort }).toString() === queryToParams({ ...q, sort: q.sort }).toString())?.value ?? "";
  // A chosen quick view is the state itself, so its filters don't repeat as chips
  const chips: ActiveFilter[] =
    activeView && activeView !== "all"
      ? []
      : applied.map((a) => ({
          key: a.key,
          label: a.label,
          value: a.value,
          onRemove: () => {
            if (a.field === "q") setText("");
            set(a.clear);
          },
        }));
  const total = data?.total ?? 0;
  const resultLabel = `${total} ${total === 1 ? "result" : "results"}`;

  const viewMenu = (
    <OverflowMenu label="View options">
      {view === "table" && (
        <>
          <MenuLabel>Columns</MenuLabel>
          {COLUMN_CHOICES.map((c) => (
            <MenuCheckbox key={c.key} checked={cols.includes(c.key)} onCheckedChange={(v) => setCols(v ? [...cols, c.key] : cols.filter((x) => x !== c.key))}>
              {c.label}
            </MenuCheckbox>
          ))}
          <MenuItem onSelect={() => setCols(DEFAULT_COLS)}>
            <span className="pl-[26px] text-cobalt">Reset columns</span>
          </MenuItem>
          <MenuSeparator />
          <MenuLabel>Group rows by</MenuLabel>
          <MenuRadioGroup value={groupBy} onValueChange={setGroupBy}>
            {GROUPS.map((g) => (
              <MenuRadio key={g.value} value={g.value}>
                {g.label}
              </MenuRadio>
            ))}
          </MenuRadioGroup>
          <MenuSeparator />
        </>
      )}
      <MenuItem onSelect={() => exportCsv(data?.results ?? [])} disabled={!data?.results.length}>
        <IconExport size={16} />
        Export {data ? resultLabel : "results"} as CSV
      </MenuItem>
    </OverflowMenu>
  );

  const viewToggle = (
    <Segmented
      label="Layout"
      value={view}
      onChange={setView}
      options={[
        { value: "table", label: <IconRows size={16} />, title: "Table" },
        { value: "cards", label: <IconGrid size={16} />, title: "Cards" },
      ]}
    />
  );

  return (
    <div>
      <PageHeader
        title="Talent inventory"
        breadcrumb={[{ label: "Workspace", href: "/dashboard" }, { label: "Talent inventory" }]}
        description="Blind profiles from the verified bench. Names stay hidden until you place a hold."
        actions={
          <RequestTalentButton variant="primary" size="md">
            Match a job spec
          </RequestTalentButton>
        }
        tabs={
          <UnderlineTabs
            listClassName="border-b-0 px-0 sm:px-0"
            label="Saved views"
            value={activeView}
            onValueChange={(v) => {
              const view = VIEWS.find((x) => x.value === v)!;
              setText(view.q.q ?? "");
              setQ({ ...defaultQuery, ...view.q });
            }}
            tabs={VIEWS.map((v) => ({ value: v.value, label: v.label }))}
          />
        }
      />

      <PageBody>
        <section aria-label="Profiles" className={cardClass}>
          <Toolbar
            className="max-xl:[&>div>div:first-child]:basis-full max-xl:[&>div>div:last-child]:ml-auto max-sm:[&>div>div:last-child]:w-full max-sm:[&>div>div:last-child>span:first-child]:hidden"
            summary={data ? resultLabel : "Loading…"}
            actions={
              <>
                <Button size="sm" className="mr-auto sm:hidden" onClick={() => setPhoneOpen(true)} aria-label={`Filters and sort${applied.length ? `, ${applied.length} applied` : ""}`}>
                  <IconSliders size={16} />
                  Filters
                  {applied.length > 0 && <CountBadge tone="brand">{applied.length}</CountBadge>}
                </Button>
                <span className="hidden sm:inline-flex">
                  <FilterMenu variant="sort" label="Sort" value={q.sort} options={SORTS} onChange={(v) => set({ sort: v })} align="end" />
                </span>
                {viewToggle}
                {viewMenu}
              </>
            }
            chips={chips.length > 0 ? <ActiveFilters filters={chips} onClearAll={reset} /> : undefined}
          >
            <FilterSearch value={text} onChange={setText} placeholder="Search skills, roles or ID" label="Search talent by skill, role or candidate ID" shortcut="/" inputRef={searchRef} className="sm:w-full lg:w-[172px] xl:w-[220px]" />
            <span className="hidden sm:contents">
              <ListFilter label="Practice" values={q.discipline} options={PRACTICES} counts={data?.facets.discipline} onChange={(v) => set({ discipline: v })} />
              <ListFilter<Availability> label="Availability" values={q.availability} options={AVAILABILITY_FILTERS} counts={data?.facets.availability} onChange={(v) => set({ availability: v })} />
              <ListFilter<WorkAuth>
                label="Authorization"
                values={q.workAuth}
                options={(Object.keys(WORK_AUTH_LABEL) as WorkAuth[]).map((w) => ({ value: w, label: WORK_AUTH_LABEL[w] }))}
                counts={data?.facets.workAuth}
                onChange={(v) => set({ workAuth: v })}
              />
              <Button size="sm" onClick={() => setMoreOpen(true)}>
                <IconSliders size={16} />
                More filters
                {moreCount > 0 && <CountBadge tone="brand">{moreCount}</CountBadge>}
              </Button>
            </span>
          </Toolbar>

          {picked.size > 0 && (
            <div className="anim-fade flex flex-wrap items-center gap-2 border-b border-hair bg-cobalt-wash px-4 py-2.5 sm:px-5">
              <span className="tnum text-[14px] font-medium text-ink">{picked.size} selected</span>
              <Button size="sm" variant="primary" onClick={shortlistPicked}>
                <IconBookmark size={14} />
                Add to shortlist
              </Button>
              <Button size="sm" onClick={() => exportCsv(pickedRows)}>
                <IconExport size={14} />
                Export selected
              </Button>
              <button className="ml-auto text-[13px] font-medium text-cobalt hover:underline" onClick={() => setPicked(new Set())}>
                Clear selection
              </button>
            </div>
          )}

          {isError ? (
            <EmptyState
              icon={<IconAlert size={18} />}
              title="Search didn't load"
              description="Check your connection and try again. Your filters are kept."
              action={<Button onClick={() => refetch()}>Try again</Button>}
            />
          ) : data && data.results.length === 0 ? (
            <EmptyState
              icon={<IconSearch size={18} />}
              title="No profiles match every filter"
              description="Widen the rate range or remove a skill. Each selected skill must be present, so every one narrows the list."
              action={<Button onClick={reset}>Clear all filters</Button>}
              className="py-16"
            />
          ) : !data ? (
            <div aria-busy="true" aria-label="Loading profiles">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex h-[52px] items-center gap-4 border-b border-hair px-4 last:border-0 sm:px-6">
                  <span className="size-4 rounded-[4px] bg-[#eef1f5]" />
                  <span className="h-3 w-14 animate-pulse rounded bg-[#eef1f5]" />
                  <span className="h-3 w-48 animate-pulse rounded bg-[#eef1f5]" />
                  <span className="ml-auto h-3 w-20 animate-pulse rounded bg-[#eef1f5]" />
                </div>
              ))}
            </div>
          ) : view === "cards" ? (
            <div className={cn("grid gap-4 bg-canvas p-4 transition-opacity sm:p-5 lg:grid-cols-2 2xl:grid-cols-3", isFetching && "opacity-70")}>
              {data.results.map((c) => (
                <CandidateCard key={c.id} c={c} rateBasis={q.rateBasis} onOpen={() => setSelected(c)} />
              ))}
            </div>
          ) : (
            <div className={cn("transition-opacity", isFetching && "opacity-70")}>
              <CandidateGrid key={qs} rows={data.results} rateBasis={q.rateBasis} groupBy={groupBy} cols={cols} selected={picked} setSelected={setPicked} onOpen={setSelected} openId={selected?.id} />
            </div>
          )}
        </section>
      </PageBody>

      <Sheet
        open={moreOpen}
        onOpenChange={setMoreOpen}
        title="More filters"
        description={data ? `${total} ${total === 1 ? "profile matches" : "profiles match"}` : undefined}
        icon={<IconSliders size={16} />}
        width="max-w-[420px]"
        footer={
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="ghost" onClick={reset} disabled={!applied.length}>
              Clear all filters
            </Button>
            <Button variant="primary" onClick={() => setMoreOpen(false)}>
              Show {resultLabel}
            </Button>
          </div>
        }
      >
        <FilterPanel scope="more" q={q} set={set} facets={data?.facets} skills={skills.map((s) => s.skill)} />
      </Sheet>

      <BottomSheet
        open={phoneOpen}
        onOpenChange={setPhoneOpen}
        title="Filters and sort"
        footer={
          <>
            <Button variant="secondary" size="lg" onClick={reset} disabled={!applied.length}>
              Clear all
            </Button>
            <Button variant="primary" size="lg" className="flex-1" onClick={() => setPhoneOpen(false)}>
              Show {resultLabel}
            </Button>
          </>
        }
      >
        <div className="px-5 pt-4 pb-1">
          <p className="text-[14px] font-semibold text-ink">Sort by</p>
          <div role="radiogroup" aria-label="Sort by" className="mt-2 grid grid-cols-2 gap-2">
            {SORTS.map((s) => (
              <button
                key={s.value}
                role="radio"
                aria-checked={q.sort === s.value}
                onClick={() => set({ sort: s.value })}
                className={cn(
                  "min-h-11 rounded-md border px-3 text-left text-[14px] transition-colors",
                  q.sort === s.value ? "border-cobalt bg-cobalt-wash font-medium text-cobalt-strong" : "border-control bg-surface text-ink",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <FilterPanel q={q} set={set} facets={data?.facets} skills={skills.map((s) => s.skill)} />
      </BottomSheet>

      <CandidateSheet c={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
