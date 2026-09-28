"use client";

import * as Popover from "@radix-ui/react-popover";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
import type { BenchStage, Discipline } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { CandidateCode, Pill } from "@/components/ui/status";
import { Segmented } from "@/components/ui/form";
import { IconAlert, IconChevronRight, IconDrag, IconSearch } from "@/components/icons";

export interface BenchCard {
  id: string;
  code: string;
  name: string;
  title: string;
  discipline: Discipline;
  stage: BenchStage;
  rateC2C: number;
  score: number | null;
  lastVerifiedAt: string;
  flags: string[];
  notices: string[];
}

export const STAGES: { stage: BenchStage; hint: string }[] = [
  { stage: "Onboarding", hint: "Intake, documents requested" },
  { stage: "Vetting", hint: "Screen, references, background" },
  { stage: "Available", hint: "Presentable on the bench" },
  { stage: "Interview", hint: "With a client" },
  { stage: "Placed", hint: "Engagement active" },
];

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

export function BenchBoard({ initial }: { initial: BenchCard[] }) {
  const { notify } = useWorkspace();
  const [cards, setCards] = useState(initial);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<BenchStage | null>(null);
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState<"all" | Discipline>("all");
  const [attention, setAttention] = useState(false);

  const visible = useMemo(() => {
    const n = search.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (discipline === "all" || c.discipline === discipline) &&
        (!attention || c.flags.length > 0) &&
        (!n || `${c.code} ${c.name} ${c.title}`.toLowerCase().includes(n)),
    );
  }, [cards, search, discipline, attention]);

  const move = (id: string, stage: BenchStage) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.stage === stage) return;
    if (stage === "Available" && card.flags.length) {
      notify({ tone: "error", title: `${card.code} can't go on the bench yet`, body: `Clear first: ${card.flags.join(", ")}.` });
      return;
    }
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    notify({ tone: "ok", title: `Moved ${card.code} to ${stage}`, body: card.name });
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-canvas px-4 py-3 sm:px-8">
        <div className="relative w-full max-w-[280px]">
          <IconSearch size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find by name, ID or role"
            aria-label="Find consultant"
            className="h-8 w-full rounded-ctl bg-surface pr-3 pl-8 text-[13px] ring-1 ring-inset ring-line-strong focus:ring-2 focus:ring-cobalt focus:outline-none"
          />
        </div>
        <Segmented
          label="Discipline"
          value={discipline}
          onChange={setDiscipline}
          options={[
            { value: "all", label: "All" },
            { value: "Data & AI", label: "Data & AI" },
            { value: "DevOps / Cloud", label: "DevOps" },
            { value: "Full-Stack", label: "Full-Stack" },
          ]}
        />
        <button
          onClick={() => setAttention(!attention)}
          aria-pressed={attention}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-ctl px-3 text-[13px] ring-1 ring-inset",
            attention ? "bg-flag-bg text-flag-ink ring-flag/40" : "bg-surface text-ink-2 ring-line-strong hover:bg-canvas",
          )}
        >
          <IconAlert size={14} />
          Needs attention
        </button>
      </div>

      <div className="scroll-thin flex flex-1 gap-3 overflow-x-auto px-4 py-4 sm:px-8">
        {STAGES.map(({ stage, hint }) => {
          const col = visible.filter((c) => c.stage === stage);
          return (
            <section
              key={stage}
              aria-label={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(stage);
              }}
              onDragLeave={() => setOver((o) => (o === stage ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging) move(dragging, stage);
                setDragging(null);
                setOver(null);
              }}
              className={cn(
                "flex w-[280px] shrink-0 flex-col rounded-panel bg-placed-bg/70 ring-1 ring-line transition-colors",
                over === stage && "bg-cobalt-wash ring-cobalt/40",
              )}
            >
              <header className="px-3 pt-3 pb-2">
                <p className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold">{stage}</span>
                  <span className="tnum rounded-full bg-surface px-2 text-xs font-medium text-ink-2 ring-1 ring-line">{col.length}</span>
                </p>
                <p className="mt-0.5 flex justify-between text-xs text-subtle">
                  <span>{hint}</span>
                  {col.length > 0 && <span className="tnum">{usd.format(median(col.map((c) => c.rateC2C)))} med.</span>}
                </p>
              </header>
              <ul className="scroll-thin flex-1 space-y-2 overflow-y-auto px-2 pb-3" style={{ maxHeight: "calc(100vh - 250px)" }}>
                {col.map((c) => (
                  <li
                    key={c.id}
                    draggable
                    onDragStart={(e) => {
                      setDragging(c.id);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragEnd={() => setDragging(null)}
                    className={cn(
                      "group cursor-grab rounded-[8px] bg-surface p-3 ring-1 ring-line hover:ring-line-strong active:cursor-grabbing",
                      dragging === c.id && "opacity-40",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <IconDrag size={14} className="mt-0.5 shrink-0 text-faint group-hover:text-subtle" />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2">
                          <CandidateCode code={c.code} className="text-[11.5px]" />
                          <span className="truncate text-[13px] font-medium">{c.name}</span>
                        </p>
                        <p className="truncate text-xs text-subtle">{c.title}</p>
                      </div>
                      <MoveMenu current={c.stage} onMove={(s) => move(c.id, s)} code={c.code} />
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="tnum text-xs text-ink-2">
                        {usd.format(c.rateC2C)}/hr
                        {c.score !== null && <span className="ml-2 text-subtle">Screen {c.score}</span>}
                      </span>
                      {stage !== "Placed" && stage !== "Onboarding" && <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} compact />}
                    </div>
                    {(c.flags.length > 0 || c.notices.length > 0) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.flags.map((f) => (
                          <Pill key={f} tone="flag" className="h-5 text-[11px]">
                            {f}
                          </Pill>
                        ))}
                        {c.notices.map((f) => (
                          <Pill key={f} tone="notice" className="h-5 text-[11px]">
                            {f}
                          </Pill>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
                {col.length === 0 && <li className="rounded-[8px] border border-dashed border-line-strong px-3 py-6 text-center text-xs text-subtle">Drop a card here</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MoveMenu({ current, onMove, code }: { current: BenchStage; onMove: (s: BenchStage) => void; code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="rounded-[5px] p-1 text-faint hover:bg-placed-bg hover:text-ink" aria-label={`Move ${code} to another stage`}>
        <IconChevronRight size={14} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={4} className="anim-fade z-50 w-48 rounded-panel bg-surface p-1 shadow-lg ring-1 ring-line">
          <p className="px-2.5 pt-1.5 pb-1 text-xs text-subtle">Move to</p>
          {STAGES.map(({ stage }) => (
            <button
              key={stage}
              disabled={stage === current}
              onClick={() => {
                onMove(stage);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-ctl px-2.5 py-1.5 text-left text-[13px] hover:bg-canvas disabled:text-faint disabled:hover:bg-transparent"
            >
              {stage}
              {stage === current && <span className="text-xs">Current</span>}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
