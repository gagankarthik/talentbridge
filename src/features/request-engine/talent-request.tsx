"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "@/components/ui/overlay";
import { Button, buttonClass } from "@/components/ui/button";
import { CandidateCode, Tag, WorkAuthTag } from "@/components/ui/status";
import { SegmentBar } from "@/components/ui/data-display";
import { AvailabilityText } from "@/components/ui/status-text";
import { IconBookmark, IconBookmarkFilled, IconCheck, IconFile, IconUpload } from "@/components/icons";
import { cn } from "@/lib/cn";
import { relativeAgo, usd } from "@/lib/format";
import type { MatchResult, ParsedSpec } from "@/lib/match";
import { useWorkspace } from "@/lib/workspace-store";

export const SAMPLE_SPECS = [
  {
    label: "Senior Data Engineer, retail bank",
    text: `Meridian Federal Bank – Senior Data Engineer (Payments)
Contract 12 months, hybrid Columbus OH. US Citizens or Green Card only preferred.
Must have: 8+ years data engineering, Python, Spark, Databricks, Kafka, SQL. AWS required.
Nice to have: Airflow, dbt, Snowflake. Budget up to $120/hr C2C.`,
  },
  {
    label: "AWS Platform Engineer",
    text: `Orion Freight & Logistics – AWS Platform Engineer
Remote (Central time overlap). 6 month contract to hire.
Required: Terraform, Kubernetes (EKS), ArgoCD, GitHub Actions, Prometheus. 7+ years.
Security mindset, Vault a plus. Rate ceiling $115/hr.`,
  },
  {
    label: "React and Node, digital banking",
    text: `Granite State Credit Union – Full-Stack Engineer, Digital Banking
React, TypeScript, Next.js, Node.js, GraphQL, PostgreSQL. 6+ years.
Accessibility (WCAG 2.1 AA) experience. Azure preferred. Up to $100/hr.`,
  },
];

interface MatchResponse {
  spec: ParsedSpec;
  results: MatchResult[];
}

async function runMatch(spec: string): Promise<MatchResponse> {
  const res = await fetch("/api/match", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ spec }) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? "Matching failed. Try again in a moment.");
  return body;
}

/** Spec input: paste, upload, or start from a sample. */
export function SpecComposer({ value, onChange, onSubmit, busy, error, dense }: { value: string; onChange: (v: string) => void; onSubmit: () => void; busy?: boolean; error?: string | null; dense?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; note: string } | null>(null);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (/\.(txt|md)$/i.test(f.name)) {
      onChange(await f.text());
      setFile({ name: f.name, note: "Text extracted" });
    } else {
      setFile({ name: f.name, note: "PDF and DOCX text extraction runs on the document service. Paste the requirements below to match now." });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-3"
    >
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFile(e.dataTransfer.files[0]);
        }}
        className="rounded-lg border border-control bg-surface transition-[border-color,box-shadow] duration-150 focus-within:border-cobalt focus-within:shadow-[0_0_0_3px_rgb(37_88_224/0.2)]"
      >
        <label htmlFor="spec" className="sr-only">
          Role requirements
        </label>
        <textarea
          id="spec"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={dense ? 5 : 8}
          placeholder="Paste the client's job description or role requirements: stack, years, cloud, rate ceiling, location, work authorization."
          className="block w-full resize-none rounded-t-lg bg-transparent px-4 pt-3.5 text-[14px] leading-relaxed text-ink placeholder:text-subtle focus:outline-none!"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hair px-2.5 py-2">
          <div className="flex items-center gap-1">
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            <Button size="sm" variant="ghost" onClick={() => fileRef.current?.click()}>
              <IconUpload size={15} />
              Upload PDF or DOCX
            </Button>
          </div>
          <Button type="submit" size="sm" variant="primary" disabled={busy || value.trim().length < 20}>
            {busy ? "Matching…" : "Find matches"}
          </Button>
        </div>
      </div>
      {file && (
        <p className="flex items-start gap-2 text-[13px] text-ink-2">
          <IconFile size={16} className="mt-px shrink-0 text-ink-2" />
          <span>
            <span className="font-medium text-ink-2">{file.name}</span>. {file.note}
          </span>
        </p>
      )}
      {error && (
        <p role="alert" className="text-[13px] text-tag-red-text">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[13px] text-ink-2">Try a sample</span>
        {SAMPLE_SPECS.map((s) => (
          <button key={s.label} type="button" onClick={() => onChange(s.text)} className="h-8 rounded-md border border-control bg-surface px-2.5 text-[13px] text-ink transition-colors duration-150 hover:border-cobalt hover:bg-cobalt-wash hover:text-cobalt-strong">
            {s.label}
          </button>
        ))}
      </div>
    </form>
  );
}

function SpecSummary({ spec }: { spec: ParsedSpec }) {
  const items: [string, string][] = [];
  if (spec.discipline) items.push(["Discipline", spec.discipline]);
  if (spec.minYears) items.push(["Experience", `${spec.minYears}+ years`]);
  if (spec.clouds.length) items.push(["Cloud", spec.clouds.join(", ")]);
  if (spec.maxRate) items.push(["Rate ceiling", `${usd.format(spec.maxRate)}/hr`]);
  if (spec.citizenOnly) items.push(["Work authorization", "US citizens only"]);
  if (spec.needsClearance) items.push(["Clearance", "Required"]);
  return (
    <div>
      <p className="text-[14px] font-semibold text-ink">What we read from the spec</p>
      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-1.5 rounded-md border border-hair px-3 py-2.5">
            <dt className="text-[13px] text-ink-2">{k}</dt>
            <dd className="text-[13.5px] font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {spec.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {spec.skills.map((s) => (
            <Tag key={s} tone="blue" size="sm">
              {s}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({ r, rank, showRates }: { r: MatchResult; rank: number; showRates: boolean }) {
  const { isShortlisted, toggleShortlist } = useWorkspace();
  const c = r.candidate;
  const saved = isShortlisted(c.id);
  return (
    <li className="grid grid-cols-[28px_1fr_auto] gap-3 border-b border-hair px-6 py-4 transition-colors duration-150 ease-power3-out last:border-0 hover:bg-canvas">
      <span className="tnum pt-0.5 text-[13px] text-subtle">{rank}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <CandidateCode code={c.code} />
          <span className="text-[14px] font-medium text-ink">{c.title}</span>
          <span className="tnum text-[13px] text-subtle">{c.yearsExperience} yrs</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <WorkAuthTag auth={c.workAuthorization} short />
          <AvailabilityText c={c} />
          {showRates && <span className="tnum text-[13px] text-ink-2">{usd.format(c.rateC2C)}/hr C2C</span>}
          <span className="text-[13px] text-ink-2">Confirmed {relativeAgo(c.lastVerifiedAt)}</span>
        </div>
        <p className="mt-2.5 flex flex-wrap gap-1">
          {r.matched.map((s) => (
            <Tag key={s} tone="blue" size="sm" className="gap-1">
              <IconCheck size={11} strokeWidth={2.5} />
              {s}
            </Tag>
          ))}
          {r.missing.map((s) => (
            <Tag key={s} size="sm" className="font-normal text-subtle line-through decoration-subtle" title="Missing from this profile">
              {s}
            </Tag>
          ))}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="flex flex-col items-end gap-1.5" title="Match score out of 100">
          <span className="tnum text-[20px] leading-none font-semibold text-ink">{r.score}</span>
          <SegmentBar percent={r.score} tone="brand" className="w-14" label={`Match score ${r.score} of 100`} />
        </span>
        {showRates && (
          <Button size="sm" variant={saved ? "secondary" : "ghost"} onClick={() => toggleShortlist(c)} aria-pressed={saved}>
            {saved ? <IconBookmarkFilled size={14} className="text-cobalt" /> : <IconBookmark size={14} />}
            {saved ? "Shortlisted" : "Shortlist"}
          </Button>
        )}
      </div>
    </li>
  );
}

/** One-click talent request drawer (PRD §5.1). */
export function TalentRequestSheet({ open, onOpenChange, initialSpec = "", autoRun = false, publicView = false }: { open: boolean; onOpenChange: (o: boolean) => void; initialSpec?: string; autoRun?: boolean; publicView?: boolean }) {
  const [spec, setSpec] = useState(initialSpec);
  const m = useMutation({ mutationFn: runMatch });
  const { mutate } = m;

  // Opened from an inline composer (remounted per submission): run immediately.
  useEffect(() => {
    if (open && autoRun && initialSpec.trim().length >= 20) mutate(initialSpec);
  }, [open, initialSpec, autoRun, mutate]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Match a job spec"
      description="Paste or upload the role. We rank the verified bench against it."
      icon={<IconFile size={15} />}
      width="max-w-[720px]"
      footer={
        m.data ? (
          <div className="flex w-full items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => m.reset()}>
              Edit requirements
            </Button>
            {publicView ? (
              <Link href="/contact?topic=requisition" className={buttonClass("primary")}>
                Request these profiles
              </Link>
            ) : (
              <Link href="/shortlist" className={buttonClass("primary")}>
                Review shortlist
              </Link>
            )}
          </div>
        ) : undefined
      }
    >
      {!m.data ? (
        <div className="p-6">
          <SpecComposer value={spec} onChange={setSpec} onSubmit={() => m.mutate(spec)} busy={m.isPending} error={m.error?.message} />
        </div>
      ) : (
        <div>
          <div className="p-6 pb-4">
            <SpecSummary spec={m.data.spec} />
            <p className="mt-6 flex items-center justify-between text-[13px] text-muted">
              <span>
                <span className="font-medium text-ink">{m.data.results.length} ranked matches</span> from the verified bench
              </span>
              <span className="text-[13px] text-ink-2">Match score out of 100</span>
            </p>
          </div>
          <ul className="border-t border-hair">
            {m.data.results.map((r, i) => (
              <ResultRow key={r.candidate.id} r={r} rank={i + 1} showRates={!publicView} />
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}

/** Inline composer that hands off to the drawer. `publicView` hides rates and portal actions. */
export function InlineRequest({ tone = "light", publicView = false }: { tone?: "light" | "dark"; publicView?: boolean }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState("");
  return (
    <div className={cn(tone === "dark" && "[&_textarea]:text-ink")}>
      <SpecComposer
        value={text}
        onChange={setText}
        dense
        onSubmit={() => {
          setSubmitted(text);
          setOpen(true);
        }}
      />
      <TalentRequestSheet key={submitted} open={open} onOpenChange={setOpen} initialSpec={submitted} autoRun publicView={publicView} />
    </div>
  );
}

export function RequestTalentButton({
  className,
  children = "Request talent",
  variant = "dark",
  size = "lg",
}: {
  className?: string;
  children?: React.ReactNode;
  variant?: "dark" | "primary" | "secondary";
  size?: "md" | "lg";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <TalentRequestSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

