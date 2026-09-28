"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "@/components/ui/overlay";
import { Button, buttonClass } from "@/components/ui/button";
import { AvailabilityPill, CandidateCode, WorkAuthTag } from "@/components/ui/status";
import { FreshnessMeter } from "@/components/ui/freshness-meter";
import { IconBookmark, IconBookmarkFilled, IconCheck, IconFile, IconUpload } from "@/components/icons";
import { cn } from "@/lib/cn";
import { usd } from "@/lib/format";
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
        className="rounded-panel bg-surface ring-1 ring-line-strong focus-within:ring-2 focus-within:ring-cobalt"
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
          className="block w-full resize-none rounded-t-panel bg-transparent px-4 pt-3.5 text-[14px] leading-relaxed text-ink placeholder:text-faint focus:outline-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-2.5 py-2">
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
        <p className="flex items-start gap-2 text-xs text-muted">
          <IconFile size={15} className="mt-px shrink-0 text-subtle" />
          <span>
            <span className="font-medium text-ink-2">{file.name}</span>. {file.note}
          </span>
        </p>
      )}
      {error && <p className="text-[13px] text-flag-ink">{error}</p>}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-subtle">Try a sample:</span>
        {SAMPLE_SPECS.map((s) => (
          <button key={s.label} type="button" onClick={() => onChange(s.text)} className="h-7 rounded-full px-2.5 text-xs text-ink-2 ring-1 ring-line-strong hover:bg-canvas">
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
    <div className="rounded-panel bg-canvas p-4 ring-1 ring-line">
      <p className="text-xs font-medium text-ink-2">What we read from the spec</p>
      <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] sm:grid-cols-3">
        {items.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-subtle">{k}</dt>
            <dd className="font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {spec.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {spec.skills.map((s) => (
            <span key={s} className="rounded-[5px] bg-surface px-2 py-0.5 text-xs text-ink-2 ring-1 ring-line">
              {s}
            </span>
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
    <li className="grid grid-cols-[28px_1fr_auto] gap-3 border-b border-line px-6 py-4 last:border-0">
      <span className="tnum pt-0.5 text-sm text-faint">{rank}</span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <CandidateCode code={c.code} />
          <span className="text-[14px] font-medium text-ink">{c.title}</span>
          <span className="tnum text-[13px] text-subtle">{c.yearsExperience} yrs</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <WorkAuthTag auth={c.workAuthorization} short />
          <AvailabilityPill c={c} />
          {showRates && <span className="tnum text-[13px] text-ink-2">{usd.format(c.rateC2C)}/hr C2C</span>}
          <FreshnessMeter lastVerifiedAt={c.lastVerifiedAt} compact />
        </div>
        <p className="mt-2 text-xs leading-relaxed">
          {r.matched.map((s) => (
            <span key={s} className="mr-2 inline-flex items-center gap-0.5 text-avail-ink">
              <IconCheck size={12} strokeWidth={2.25} />
              {s}
            </span>
          ))}
          {r.missing.map((s) => (
            <span key={s} className="mr-2 inline-flex items-center gap-0.5 text-subtle line-through decoration-faint">
              {s}
            </span>
          ))}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="tnum text-[20px] leading-none font-semibold text-ink" title="Match score out of 100">
          {r.score}
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
      title="Request talent"
      description="Paste or upload the role. We rank the verified bench against it."
      width="max-w-[720px]"
      footer={
        m.data ? (
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => m.reset()}>
              Edit requirements
            </Button>
            {publicView ? (
              <Link href="/contact?topic=requisition" className={buttonClass("dark")}>
                Request these profiles
              </Link>
            ) : (
              <Link href="/shortlist" className={buttonClass("dark")}>
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
            <p className="mt-5 flex items-center justify-between text-[13px] text-muted">
              <span>
                <span className="font-medium text-ink">{m.data.results.length} ranked matches</span> from the verified bench
              </span>
              <span className="text-xs text-subtle">Score out of 100</span>
            </p>
          </div>
          <ul className="border-t border-line">
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

