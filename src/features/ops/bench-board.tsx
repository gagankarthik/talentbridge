"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { freshnessDays, FRESHNESS_WINDOW_DAYS, usd } from "@/lib/format";
import type { BenchStage, Discipline } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { PageBody, PageHeader } from "@/components/layout/app-shell";
import { buttonClass } from "@/components/ui/button";
import { CandidateCode } from "@/components/ui/status";
import { StatusDot } from "@/components/ui/status-dot";
import { CountBadge } from "@/components/ui/data-display";
import { IconChevronDown, IconDrag, IconPlus } from "@/components/icons";
import { practiceLabel, stageLabel } from "@/features/admin/candidate-list";
import { Panel } from "@/features/admin/ui";
import { ListToolbar } from "@/features/admin/list-toolbar";

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

type Show = "all" | "flags" | "notices";

function Freshness({ at }: { at: string }) {
  const d = freshnessDays(at);
  if (d >= FRESHNESS_WINDOW_DAYS) return <StatusDot tone="danger">Re-verification due</StatusDot>;
  const label = d === 0 ? "Verified today" : `Verified ${d} ${d === 1 ? "day" : "days"} ago`;
  return <StatusDot tone={FRESHNESS_WINDOW_DAYS - d <= 2 ? "warning" : "success"}>{label}</StatusDot>;
}

export function BenchBoard({ initial }: { initial: BenchCard[] }) {
  const { notify } = useWorkspace();
  const [cards, setCards] = useState(initial);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<BenchStage | null>(null);
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState<"all" | Discipline>("all");
  const [show, setShow] = useState<Show>("all");

  const visible = useMemo(() => {
    const n = search.trim().toLowerCase();
    return cards.filter(
      (c) =>
        (discipline === "all" || c.discipline === discipline) &&
        (show === "all" || (show === "flags" ? c.flags.length > 0 : c.flags.length + c.notices.length > 0)) &&
        (!n || `${c.code} ${c.name} ${c.title}`.toLowerCase().includes(n)),
    );
  }, [cards, search, discipline, show]);

  const move = (id: string, stage: BenchStage) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.stage === stage) return;
    if (stage === "Available" && card.flags.length) {
      notify({ tone: "error", title: `${card.code} can't go on the bench yet`, body: `Clear first: ${card.flags.join(", ")}.` });
      return;
    }
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, stage } : c)));
    notify({ tone: "ok", title: `Moved ${card.code} to ${stageLabel(stage)}`, body: card.name });
  };

  return (
    <>
      <PageHeader
        title="Bench tracker"
        description="Every consultant from intake to placement. Drag a card to another stage, or use its Move menu."
        actions={
          <Link href="/admin/candidates/new" className={buttonClass("primary", "md")}>
            <IconPlus size={16} />
            Add candidate
          </Link>
        }
      />
      <PageBody className="space-y-6">
        <Panel>
          <ListToolbar
            className="border-b-0"
            noun="consultants"
            summary={visible.length}
            onClearAll={() => {
              setSearch("");
              setDiscipline("all");
              setShow("all");
            }}
            search={{ value: search, onChange: setSearch, placeholder: "Search name, code or role" }}
            filters={[
              {
                key: "practice",
                label: "Practice",
                value: discipline,
                onChange: (v) => setDiscipline(v as typeof discipline),
                options: [
                  { value: "all", label: "All practices" },
                  ...(["Data & AI", "DevOps / Cloud", "Full-Stack"] as Discipline[]).map((d) => ({
                    value: d,
                    label: practiceLabel(d),
                    meta: cards.filter((c) => c.discipline === d).length,
                  })),
                ],
              },
              {
                key: "show",
                label: "Open items",
                value: show,
                onChange: (v) => setShow(v as Show),
                options: [
                  { value: "all", label: "Everyone" },
                  { value: "flags", label: "Blocking items", meta: cards.filter((c) => c.flags.length).length },
                  { value: "notices", label: "Any open item", meta: cards.filter((c) => c.flags.length + c.notices.length).length },
                ],
              },
            ]}
          />
        </Panel>

        <div className="scroll-thin -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-8 sm:px-8">
          {STAGES.map(({ stage, hint }) => {
            const col = visible.filter((c) => c.stage === stage);
            return (
              <section
                key={stage}
                aria-labelledby={`col-${stage}`}
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
                  "flex w-[288px] shrink-0 flex-col rounded-[8px] border transition-colors duration-150",
                  over === stage ? "border-cobalt bg-[#eef3fd]" : "border-hair bg-[#eef1f5]",
                )}
              >
                <header className="border-b border-hair px-4 py-3">
                  <p className="flex items-center gap-2">
                    <span id={`col-${stage}`} className="text-[14px] font-semibold text-ink">
                      {stageLabel(stage)}
                    </span>
                    <CountBadge>{col.length}</CountBadge>
                    {col.length > 0 && <span className="tnum ml-auto text-[13px] text-subtle">{usd.format(median(col.map((c) => c.rateC2C)))} median</span>}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-subtle">{hint}</p>
                </header>
                <ul className="scroll-thin flex-1 space-y-2 overflow-y-auto p-2" style={{ maxHeight: "calc(100dvh - 330px)", minHeight: 168 }}>
                  {col.map((c) => {
                    const items = [...c.flags.map((f) => ({ f, tone: "danger" as const })), ...c.notices.map((f) => ({ f, tone: "warning" as const }))];
                    return (
                      <li
                        key={c.id}
                        draggable
                        onDragStart={(e) => {
                          setDragging(c.id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => setDragging(null)}
                        className={cn(
                          "group cursor-grab rounded-[8px] border border-hair bg-surface p-3 transition-[border-color,opacity] duration-150 hover:border-control active:cursor-grabbing",
                          dragging === c.id && "opacity-40",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <IconDrag size={14} className="shrink-0 text-subtle" />
                          <Link href={`/admin/candidates/${c.code}`} draggable={false} className="rounded-[4px] hover:text-cobalt hover:underline">
                            <CandidateCode code={c.code} />
                          </Link>
                          <span className="ml-auto">
                            <MoveMenu current={c.stage} onMove={(s) => move(c.id, s)} code={c.code} />
                          </span>
                        </div>
                        <p className="mt-2 truncate text-[14px] font-semibold text-ink">{c.name}</p>
                        <p className="truncate text-[13px] text-muted">{c.title}</p>
                        <p className="tnum mt-2 text-[13px] text-muted">
                          {usd.format(c.rateC2C)}/hr
                          <span className="text-subtle"> · </span>
                          {c.score !== null ? `Screen ${c.score}` : <span className="text-subtle">Not screened</span>}
                        </p>
                        {(stage !== "Placed" && stage !== "Onboarding") || items.length > 0 ? (
                          <div className="mt-3 space-y-1.5 border-t border-hair pt-3">
                            {stage !== "Placed" && stage !== "Onboarding" && <Freshness at={c.lastVerifiedAt} />}
                            {items.slice(0, 2).map(({ f, tone }) => (
                              <StatusDot key={f} tone={tone} className="flex">
                                {f}
                              </StatusDot>
                            ))}
                            {items.length > 2 && <p className="pl-3.5 text-[13px] text-subtle">and {items.length - 2} more</p>}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                  {col.length === 0 && (
                    <li className="grid h-28 place-items-center rounded-[8px] border border-dashed border-control text-[13px] text-subtle">
                      {over === stage ? "Release to move here" : "No consultants in this stage"}
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}

function MoveMenu({ current, onMove, code }: { current: BenchStage; onMove: (s: BenchStage) => void; code: string }) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="inline-flex h-8 items-center gap-1 rounded-[6px] border border-hair px-2.5 text-[13px] font-medium text-muted transition-colors duration-150 outline-none hover:border-control hover:text-ink focus-visible:ring-2 focus-visible:ring-cobalt data-[state=open]:border-control data-[state=open]:bg-canvas"
        aria-label={`Move ${code} to another stage`}
      >
        Move
        <IconChevronDown size={14} />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          align="end"
          sideOffset={6}
          className="app anim-pop z-[80] min-w-[208px] rounded-[8px] border border-hair bg-surface p-1 shadow-overlay"
        >
          <Dropdown.Label className="px-2.5 pt-2 pb-1.5 text-[12px] font-semibold text-subtle">Move to stage</Dropdown.Label>
          <Dropdown.RadioGroup value={current} onValueChange={(v) => onMove(v as BenchStage)}>
            {STAGES.map(({ stage }) => (
              <Dropdown.RadioItem
                key={stage}
                value={stage}
                className="flex h-9 cursor-pointer items-center gap-2 rounded-[6px] px-2.5 text-[14px] text-ink outline-none select-none data-[highlighted]:bg-canvas data-[state=checked]:font-semibold"
              >
                <span className="flex-1">{stageLabel(stage)}</span>
                <Dropdown.ItemIndicator className="text-[13px] font-normal text-subtle">Current</Dropdown.ItemIndicator>
              </Dropdown.RadioItem>
            ))}
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
