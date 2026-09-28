"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { AVAILABILITY_FILTERS, WORK_AUTH_LABEL } from "@/lib/format";
import { defaultQuery, paramsToQuery, queryToParams, RATE_CEIL, RATE_FLOOR, type Facets, type ScoredCandidate, type SortKey, type TalentQuery } from "@/lib/query";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/form";
import { Sheet } from "@/components/ui/overlay";
import { NoResultsIllustration } from "@/components/illustrations";
import { IconBookmark, IconExport, IconGrid, IconRows, IconSearch, IconSliders, IconX } from "@/components/icons";
import { CandidateCard } from "./candidate-card";
import { CandidateGrid, ColumnsMenu, DEFAULT_COLS, Pager, PAGE_SIZE, toCsv, type ColKey, type GroupBy } from "./candidate-grid";
import { useWorkspace } from "@/lib/workspace-store";
import { CandidateSheet } from "./candidate-sheet";
import { NavCollapse } from "@/components/workspace-icons";
import { FilterPanel } from "./filter-panel";
import { Select } from "@/components/ui/select";

interface SearchResponse {
  total: number;
  results: ScoredCandidate[];
  facets: Facets;
}

const SORTS: { value: SortKey; label: string }[] = [
  { value: "match", label: "Best match" },
  { value: "available", label: "Soonest available" },
  { value: "score", label: "Highest screen score" },
  { value: "fresh", label: "Most recently verified" },
  { value: "rate_asc", label: "Rate, low to high" },
  { value: "rate_desc", label: "Rate, high to low" },
];

const FILTERS_KEY = "talentbridge.talent.filtersHidden";

const SAVED_VIEWS: { label: string; q: Partial<TalentQuery> }[] = [
  { label: "All profiles", q: {} },
  { label: "Start immediately", q: { availability: ["IMMEDIATE"], freshOnly: true } },
  { label: "Top screen scores", q: { minScore: 90, sort: "score" } },
  { label: "US citizens and green card", q: { workAuth: ["US_CITIZEN", "GREEN_CARD"] } },
  { label: "Clearance holders", q: { clearance: ["Public Trust", "Secret", "Top Secret"] } },
  { label: "Data & AI", q: { discipline: ["Data & AI"] } },
  { label: "Cloud & DevOps", q: { discipline: ["DevOps / Cloud"] } },
  { label: "Full-Stack", q: { discipline: ["Full-Stack"] } },
];

function activeChips(q: TalentQuery): { key: string; label: string; clear: Partial<TalentQuery> }[] {
  const chips: { key: string; label: string; clear: Partial<TalentQuery> }[] = [];
  const listChip = <K extends "discipline" | "skills" | "clouds" | "workAuth" | "clearance" | "timezone" | "availability">(k: K, fmt: (v: string) => string = (v) => v) =>
    (q[k] as string[]).forEach((v) => chips.push({ key: `${k}:${v}`, label: fmt(v), clear: { [k]: (q[k] as string[]).filter((x) => x !== v) } as Partial<TalentQuery> }));
  listChip("discipline");
  listChip("skills");
  listChip("clouds");
  listChip("availability", (v) => AVAILABILITY_FILTERS.find((a) => a.value === v)?.label ?? v);
  listChip("workAuth", (v) => WORK_AUTH_LABEL[v as keyof typeof WORK_AUTH_LABEL]);
  listChip("clearance", (v) => (v === "None" ? "No clearance" : v));
  listChip("timezone");
  if (q.rateMin !== RATE_FLOOR || q.rateMax !== RATE_CEIL)
    chips.push({ key: "rate", label: `$${q.rateMin}–${q.rateMax}/hr ${q.rateBasis.toUpperCase()}`, clear: { rateMin: RATE_FLOOR, rateMax: RATE_CEIL } });
  if (q.minScore) chips.push({ key: "score", label: `Screen ${q.minScore}+`, clear: { minScore: 0 } });
  if (q.freshOnly) chips.push({ key: "fresh", label: "Confirmed in 7 days", clear: { freshOnly: false } });
  if (q.q) chips.push({ key: "q", label: `“${q.q}”`, clear: { q: "" } });
  return chips;
}

export function TalentExplorer({ skills }: { skills: { skill: string; count: number }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState<TalentQuery>(() => paramsToQuery(new URLSearchParams(params.toString())));
  const [text, setText] = useState(q.q);
  const [view, setView] = useState<"table" | "cards">("table");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [cardPage, setCardPage] = useState(0);
  const [selected, setSelected] = useState<ScoredCandidate | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersHidden, setFiltersHidden] = useState(false);
  const [cols, setCols] = useState<ColKey[]>(DEFAULT_COLS);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const { isShortlisted, toggleShortlist, notify } = useWorkspace();

  // Remember whether the desktop filter panel is collapsed
  useEffect(() => {
    queueMicrotask(() => {
      try {
        setFiltersHidden(localStorage.getItem(FILTERS_KEY) === "1");
      } catch {
        /* storage unavailable */
      }
    });
  }, []);
  const setHidden = (v: boolean) => {
    setFiltersHidden(v);
    try {
      localStorage.setItem(FILTERS_KEY, v ? "1" : "0");
    } catch {
      /* storage unavailable */
    }
  };
  const openFilters = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) setHidden(false);
    else setFiltersOpen(true);
  };
  const searchRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<TalentQuery>) => setQ((prev) => ({ ...prev, ...patch }));
  const qs = useMemo(() => queryToParams(q).toString(), [q]);

  // Keep URL shareable
  useEffect(() => {
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [qs, pathname, router]);

  // Debounce free text
  useEffect(() => {
    const t = setTimeout(() => setQ((prev) => (prev.q === text ? prev : { ...prev, q: text })), 220);
    return () => clearTimeout(t);
  }, [text]);

  // "/" focuses search
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
    notify({ tone: "ok", title: `Exported ${list.length} profiles`, body: "Blind fields only. Names and contacts are never included." });
  };

  const chips = activeChips(q);
  const reset = () => {
    setText("");
    setQ(defaultQuery);
  };

  const activeView = SAVED_VIEWS.find((v) => queryToParams({ ...defaultQuery, ...v.q, sort: q.sort }).toString() === queryToParams({ ...q, sort: q.sort }).toString())?.label ?? null;
  const panel = (
    <FilterPanel
      q={q}
      set={set}
      facets={data?.facets}
      skills={skills.map((s) => s.skill)}
      quickViews={SAVED_VIEWS}
      activeView={activeView}
      onView={(v) => {
        setText(v.q.q ?? "");
        setQ({ ...defaultQuery, ...v.q });
      }}
    />
  );

  return (
    <div className={cn("grid", !filtersHidden && "lg:grid-cols-[272px_1fr]")}>
      {/* Filters */}
      <aside aria-label="Filters" className={cn("hidden border-r border-line bg-surface", !filtersHidden && "lg:block")}>
        <div className="scroll-thin sticky top-16 max-h-[calc(100vh-64px)] overflow-y-auto px-5 pt-3 pb-10">
          <div className="flex items-center gap-2 pt-1 pb-1">
            <p className="text-[13px] font-semibold">
              Filters
              {chips.length > 0 && <span className="tnum ml-1.5 rounded-full bg-cobalt px-1.5 text-[11px] font-medium text-white">{chips.length}</span>}
            </p>
            {chips.length > 0 && (
              <button onClick={reset} className="ml-auto text-xs font-medium text-cobalt hover:underline">
                Clear all
              </button>
            )}
            <button
              onClick={() => setHidden(true)}
              className={cn("grid size-8 place-items-center rounded-[8px] text-subtle hover:bg-canvas hover:text-ink", chips.length === 0 && "ml-auto")}
              aria-label="Hide filters"
              title="Hide filters"
            >
              <NavCollapse collapsed={false} size={18} />
            </button>
          </div>
          {panel}
        </div>
      </aside>

      <section className="min-w-0">
        {/* Toolbar: every control for the result set lives here */}
        <div className="@container z-10 space-y-2.5 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:px-6 lg:sticky lg:top-16">
          <div className="flex flex-col gap-2 @min-[1180px]:flex-row @min-[1180px]:items-center">
            <div className="relative min-w-0 @min-[1180px]:flex-1">
              <IconSearch size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
              <input
                ref={searchRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Search skills, roles, industries or a candidate ID"
                aria-label="Search talent"
                className="h-9 w-full rounded-ctl bg-surface pr-10 pl-9 text-sm ring-1 ring-inset ring-line-strong placeholder:text-faint focus:ring-2 focus:ring-cobalt focus:outline-none"
              />
              <kbd className="absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded-[4px] px-1.5 font-sans text-[11px] text-subtle ring-1 ring-line sm:block">/</kbd>
            </div>
            <div className="flex min-w-0 items-center gap-2 @min-[560px]:flex-wrap">
              <Button className={cn("shrink-0", !filtersHidden && "lg:hidden")} onClick={openFilters} aria-label={`Show filters${chips.length ? `, ${chips.length} active` : ""}`}>
                <IconSliders size={16} />
                <span className="hidden sm:inline">Filters</span>
                {chips.length > 0 && <span className="tnum rounded-full bg-cobalt px-1.5 text-[11px] font-medium text-white">{chips.length}</span>}
              </Button>
              <label className="sr-only" htmlFor="sort">
                Sort
              </label>
              <Select
                id="sort"
                label="Sort"
                value={q.sort}
                onValueChange={(v) => set({ sort: v })}
                options={SORTS}
                className="flex-1 @min-[560px]:w-[190px] @min-[560px]:flex-none"
              />
              {view === "table" && (
                <>
                  <label className="sr-only" htmlFor="group">
                    Group by
                  </label>
                  <span className="hidden shrink-0 sm:block">
                    <Select
                      id="group"
                      label="Group by"
                      value={groupBy}
                      onValueChange={setGroupBy}
                      className="w-[190px]"
                      options={[
                        { value: "none", label: "No grouping" },
                        { value: "discipline", label: "By practice" },
                        { value: "availability", label: "By availability" },
                        { value: "workAuthorization", label: "By work authorization" },
                      ]}
                    />
                  </span>
                </>
              )}
              <Segmented
                label="View"
                value={view}
                onChange={setView}
                options={[
                  { value: "table", label: <IconRows size={15} />, title: "Table view" },
                  { value: "cards", label: <IconGrid size={15} />, title: "Card view" },
                ]}
              />
              {view === "table" && (
                <span className="hidden sm:block">
                  <ColumnsMenu cols={cols} setCols={setCols} />
                </span>
              )}
              <Button className="shrink-0" onClick={() => exportCsv(data?.results ?? [])} disabled={!data?.results.length} aria-label="Export results as CSV" title="Export results as CSV">
                <IconExport size={16} />
                <span className="hidden lg:inline">Export</span>
              </Button>
            </div>
          </div>

          {picked.size > 0 && (
            <div className="anim-fade flex flex-wrap items-center gap-2 rounded-[10px] bg-ink px-3 py-2 text-white">
              <span className="tnum px-1 text-[13px] font-medium">{picked.size} selected</span>
              <button onClick={shortlistPicked} className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-white/10 px-3 text-[13px] font-medium hover:bg-white/20">
                <IconBookmark size={14} />
                Add to shortlist
              </button>
              <button onClick={() => exportCsv(pickedRows)} className="inline-flex h-8 items-center gap-1.5 rounded-[8px] bg-white/10 px-3 text-[13px] font-medium hover:bg-white/20">
                <IconExport size={14} />
                Export selected
              </button>
              <button onClick={() => setPicked(new Set())} className="ml-auto h-8 rounded-[8px] px-3 text-[13px] text-slate-300 hover:text-white">
                Clear selection
              </button>
            </div>
          )}

          {(chips.length > 0 || isFetching) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {chips.map((c) => (
                <button
                  key={c.key}
                  onClick={() => {
                    if (c.key === "q") setText("");
                    set(c.clear);
                  }}
                  className="inline-flex h-6 items-center gap-1 rounded-full bg-surface pr-1.5 pl-2.5 text-xs text-ink-2 ring-1 ring-line-strong hover:ring-faint"
                  aria-label={`Remove filter ${c.label}`}
                >
                  {c.label}
                  <IconX size={12} className="text-subtle" />
                </button>
              ))}
              {chips.length > 1 && (
                <button onClick={reset} className="px-1 text-xs font-medium text-cobalt hover:underline">
                  Clear all
                </button>
              )}
              {isFetching && <span className="text-xs text-faint">Updating…</span>}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="px-4 py-5 sm:px-6">
          {isError ? (
            <div className="rounded-panel bg-surface p-8 text-center ring-1 ring-line">
              <p className="font-medium">Search didn&apos;t load.</p>
              <p className="mt-1 text-sm text-muted">Check your connection and try again. Your filters are kept.</p>
              <Button className="mt-4" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : data && data.results.length === 0 ? (
            <div className="flex flex-col items-center rounded-[12px] bg-surface px-6 py-14 text-center ring-1 ring-line">
              <NoResultsIllustration className="h-28 w-auto" />
              <p className="mt-4 text-[16px] font-semibold">No contractors match all of these filters.</p>
              <p className="mt-1 max-w-md text-sm text-muted">Widen the rate range or remove a skill. Every skill you select must be present, so each one narrows the results a lot.</p>
              <Button className="mt-5" onClick={reset}>
                Clear all filters
              </Button>
            </div>
          ) : !data ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-[228px] animate-pulse rounded-panel bg-surface ring-1 ring-line" />
              ))}
            </div>
          ) : view === "cards" ? (
            <div className={cn("transition-opacity", isFetching && "opacity-70")}>
              <div className="grid gap-3 xl:grid-cols-2">
                {data.results.slice(Math.min(cardPage, Math.ceil(data.results.length / PAGE_SIZE) - 1) * PAGE_SIZE, (Math.min(cardPage, Math.ceil(data.results.length / PAGE_SIZE) - 1) + 1) * PAGE_SIZE).map((c) => (
                  <CandidateCard key={c.id} c={c} rateBasis={q.rateBasis} onOpen={() => setSelected(c)} />
                ))}
              </div>
              <div className="mt-3 rounded-[12px] bg-surface ring-1 ring-line">
                <Pager page={Math.min(cardPage, Math.ceil(data.results.length / PAGE_SIZE) - 1)} pages={Math.ceil(data.results.length / PAGE_SIZE)} total={data.results.length} onPage={setCardPage} />
              </div>
            </div>
          ) : (
            <div className={cn("transition-opacity", isFetching && "opacity-70")}>
              <CandidateGrid key={qs} rows={data.results} rateBasis={q.rateBasis} groupBy={groupBy} cols={cols} selected={picked} setSelected={setPicked} onOpen={setSelected} />
            </div>
          )}
        </div>
      </section>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen} title="Filters" width="max-w-[380px]" footer={<Button variant="dark" className="w-full" onClick={() => setFiltersOpen(false)}>Show {data?.total ?? ""} results</Button>}>
        <div className="px-5">{panel}</div>
      </Sheet>

      <CandidateSheet c={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
