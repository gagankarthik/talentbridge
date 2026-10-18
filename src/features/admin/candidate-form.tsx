"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { DEMO_NOW, FRESHNESS_WINDOW_DAYS, freshnessDays, WORK_AUTH_LABEL } from "@/lib/format";
import type { Availability, BenchStage, Candidate, Clearance, Cloud, Discipline, Project, Skill, Timezone, WorkAuth } from "@/lib/types";
import { useWorkspace } from "@/lib/workspace-store";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/form";
import { StatusDot } from "@/components/ui/status-dot";
import { PageBody } from "@/components/layout/app-shell";
import { SegmentBar } from "@/components/ui/data-display";
import { Select } from "@/components/ui/select";
import { IconAlert, IconCheck, IconFile, IconPlus, IconUpload, IconX } from "@/components/icons";
import { useAdmin } from "./admin-store";

const STAGES: BenchStage[] = ["Onboarding", "Vetting", "Available", "Interview", "Placed"];
const DISCIPLINES: Discipline[] = ["Data & AI", "DevOps / Cloud", "Full-Stack"];
const INDUSTRIES = ["Banking", "Capital Markets", "Insurance", "Retail", "Healthcare", "Logistics", "Public Sector", "Telecom"];
const METROS: [string, Timezone][] = [
  ["Columbus, OH", "ET"],
  ["Charlotte, NC", "ET"],
  ["Atlanta, GA", "ET"],
  ["Boston, MA", "ET"],
  ["Jersey City, NJ", "ET"],
  ["Reston, VA", "ET"],
  ["Chicago, IL", "CT"],
  ["Dallas, TX", "CT"],
  ["Austin, TX", "CT"],
  ["Minneapolis, MN", "CT"],
  ["Denver, CO", "MT"],
  ["Phoenix, AZ", "MT"],
  ["Seattle, WA", "PT"],
  ["San Jose, CA", "PT"],
  ["Portland, OR", "PT"],
];

/** What still stands between this profile and the customer inventory. */
export function readiness(c: Candidate) {
  const x = c.compliance;
  return [
    { label: "Work authorization verified", ok: x.workAuthVerified, blocking: true },
    { label: "Background check cleared", ok: x.backgroundCheck === "Cleared", blocking: true },
    { label: "Form I-9 complete", ok: x.i9Complete, blocking: false },
    { label: `References ${x.referencesCompleted} of ${x.referencesRequired}`, ok: x.referencesCompleted >= x.referencesRequired, blocking: false },
    { label: "Technical screen scored", ok: c.technicalScreenScore !== null, blocking: false },
    { label: "Availability confirmed this week", ok: freshnessDays(c.lastVerifiedAt) < FRESHNESS_WINDOW_DAYS, blocking: false },
    { label: "Consultant NDA signed", ok: x.ndaSigned, blocking: false },
  ];
}

export const isListable = (c: Candidate) =>
  (c.benchStage === "Available" || c.benchStage === "Interview") && c.compliance.workAuthVerified && c.compliance.backgroundCheck === "Cleared";

function blank(code: string): Candidate {
  return {
    id: crypto.randomUUID(),
    code,
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    discipline: "Full-Stack",
    yearsExperience: 5,
    skills: [],
    clouds: [],
    certifications: [],
    domains: [],
    rateC2C: 90,
    rateW2: 74,
    workAuthorization: "US_CITIZEN",
    clearance: "None",
    availability: "IMMEDIATE",
    availableFrom: null,
    benchStage: "Onboarding",
    technicalScreenScore: null,
    screenBreakdown: null,
    screenedBy: null,
    architectureProjects: [],
    metro: "Columbus, OH",
    timezone: "ET",
    remote: "Remote",
    lastVerifiedAt: new Date(DEMO_NOW).toISOString(),
    compliance: {
      workAuthVerified: false,
      i9Complete: false,
      backgroundCheck: "Not started",
      referencesCompleted: 0,
      referencesRequired: 3,
      ndaSigned: false,
      visaExpiry: null,
    },
    vettingNotes: "",
    isActive: true,
    createdAt: new Date(DEMO_NOW).toISOString(),
  };
}

/** One form section: 16px title and a one-line description in a left rail, fields on the right; sections divide with a 1px rule. */
function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="grid scroll-mt-28 gap-5 border-b border-hair px-5 py-7 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10 [&:nth-last-child(2)]:border-b-0"
    >
      <div>
        <h2 id={`${id}-h`} className="text-[16px] font-semibold text-ink">
          {title}
        </h2>
        {description && <p className="mt-1 text-[13px] leading-snug text-subtle">{description}</p>}
      </div>
      <div className="min-w-0 space-y-6">{children}</div>
    </section>
  );
}

const chip = (on: boolean) =>
  cn(
    "h-9 rounded-[6px] border px-3 text-[14px] transition-colors duration-150",
    on
      ? "border-cobalt bg-[#eef3fd] font-medium text-cobalt-strong shadow-[0_0_0_1px_var(--color-cobalt)]"
      : "border-control bg-surface text-ink hover:bg-canvas",
  );

const NAV = [
  ["personal", "Personal details"],
  ["role", "Role and experience"],
  ["skills", "Skills"],
  ["compliance", "Work authorization and compliance"],
  ["availability", "Availability and rates"],
  ["screen", "Technical screen"],
  ["projects", "Projects and notes"],
];

export function CandidateForm({
  initial,
  nextCode,
  existingEmails,
  mode,
}: {
  initial?: Candidate;
  nextCode: string;
  existingEmails: string[];
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const { addCandidate, updateCandidate } = useAdmin();
  const { notify } = useWorkspace();
  const [c, setC] = useState<Candidate>(() => initial ?? blank(nextCode));
  const [skillText, setSkillText] = useState("");
  const [certText, setCertText] = useState("");
  const [resume, setResume] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<Candidate>) => setC((x) => ({ ...x, ...patch }));
  const setComp = (patch: Partial<Candidate["compliance"]>) => setC((x) => ({ ...x, compliance: { ...x.compliance, ...patch } }));
  const needsVisa = ["H1B", "EAD_OPT", "TN"].includes(c.workAuthorization);
  const checks = readiness(c);

  const addSkill = () => {
    const name = skillText.trim();
    if (!name || c.skills.some((s) => s.skill.toLowerCase() === name.toLowerCase())) return setSkillText("");
    set({ skills: [...c.skills, { skill: name, years: Math.min(c.yearsExperience, 3), primary: c.skills.filter((s) => s.primary).length < 3 }] });
    setSkillText("");
  };
  const updSkill = (i: number, patch: Partial<Skill>) => set({ skills: c.skills.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const updProject = (i: number, patch: Partial<Project>) =>
    set({ architectureProjects: c.architectureProjects.map((p, k) => (k === i ? { ...p, ...patch } : p)) });
  const breakdown = c.screenBreakdown ?? { systemDesign: 0, coding: 0, domain: 0, communication: 0 };
  const setScore = (k: keyof typeof breakdown, v: number) => {
    const b = { ...breakdown, [k]: Math.max(0, Math.min(100, v || 0)) };
    const vals = Object.values(b);
    const scored = vals.every((n) => n > 0);
    set({ screenBreakdown: b, technicalScreenScore: scored ? Math.round(vals.reduce((a, n) => a + n, 0) / 4) : null });
  };

  const save = () => {
    const e: string[] = [];
    if (!c.firstName.trim() || !c.lastName.trim()) e.push("Add the candidate's first and last name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.push("Enter a valid email address.");
    else if (mode === "create" && existingEmails.includes(c.email.toLowerCase())) e.push("A candidate with this email already exists.");
    if (!c.title.trim()) e.push("Add a job title.");
    if (c.skills.length === 0) e.push("Add at least one skill.");
    if (!(c.rateC2C > 0) || !(c.rateW2 > 0)) e.push("Add C2C and W2 rates.");
    if (needsVisa && !c.compliance.visaExpiry) e.push("Add the visa or EAD expiry date.");
    if (c.availability !== "IMMEDIATE" && c.availability !== "PLACED" && !c.availableFrom) e.push("Add the date the candidate becomes available.");
    if ((c.benchStage === "Available" || c.benchStage === "Interview") && !(c.compliance.workAuthVerified && c.compliance.backgroundCheck === "Cleared"))
      e.push("A candidate can't be Available until work authorization is verified and the background check has cleared.");
    setErrors(e);
    if (e.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const clean: Candidate = {
      ...c,
      firstName: c.firstName.trim(),
      lastName: c.lastName.trim(),
      email: c.email.trim().toLowerCase(),
      title: c.title.trim(),
      timezone: METROS.find(([m]) => m === c.metro)?.[1] ?? c.timezone,
    };
    if (mode === "create") {
      addCandidate(clean);
      notify({ tone: "ok", title: `${clean.code} added`, body: `${clean.firstName} ${clean.lastName} is in ${clean.benchStage}.` });
    } else {
      updateCandidate(clean.id, clean.code, clean, `Stage ${clean.benchStage}`);
      notify({ tone: "ok", title: `${clean.code} saved` });
    }
    router.push(`/admin/candidates/${clean.code}`);
  };

  return (
    <PageBody className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        {errors.length > 0 && (
          <div role="alert" className="mb-6 rounded-[8px] border border-[#f5cbc6] bg-[#fdecea] px-4 py-3 text-[14px] text-[#b42318]">
            <p className="flex items-center gap-2 font-semibold">
              <IconAlert size={15} />
              Fix {errors.length === 1 ? "this" : `these ${errors.length}`} before saving
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-6">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-[8px] border border-hair bg-surface">
          <Section id="personal" title="Personal details" description="Identity and contact. Never shown to customers.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" htmlFor="f-first">
                <Input id="f-first" value={c.firstName} onChange={(e) => set({ firstName: e.target.value })} autoComplete="off" />
              </Field>
              <Field label="Last name" htmlFor="f-last">
                <Input id="f-last" value={c.lastName} onChange={(e) => set({ lastName: e.target.value })} autoComplete="off" />
              </Field>
              <Field label="Email" htmlFor="f-email">
                <Input id="f-email" type="email" value={c.email} onChange={(e) => set({ email: e.target.value })} autoComplete="off" />
              </Field>
              <Field label="Location" htmlFor="f-metro">
                <Select
                  id="f-metro"
                  className="w-full"
                  value={c.metro}
                  onValueChange={(v) => set({ metro: v, timezone: METROS.find(([m]) => m === v)![1] })}
                  options={METROS.map(([m, tz]) => ({ value: m, label: m, hint: tz }))}
                />
              </Field>
              <Field label="Work preference" htmlFor="f-remote">
                <Select
                  id="f-remote"
                  className="w-full"
                  value={c.remote}
                  onValueChange={(v) => set({ remote: v })}
                  options={(["Remote", "Hybrid", "Onsite"] as const).map((v) => ({ value: v, label: v }))}
                />
              </Field>
              <Field label="Resume" htmlFor="f-resume">
                <input
                  ref={fileRef}
                  id="f-resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(e) => setResume(e.target.files?.[0]?.name ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-9 w-full items-center gap-2 rounded-[6px] bg-surface px-3 text-left text-[14px] text-ink ring-1 ring-control ring-inset transition-colors hover:bg-canvas"
                >
                  {resume ? <IconFile size={15} className="text-subtle" /> : <IconUpload size={15} className="text-subtle" />}
                  <span className="truncate">{resume ?? "Upload PDF or Word"}</span>
                </button>
              </Field>
            </div>
          </Section>

          <Section id="role" title="Role and experience" description="Shapes the title and practice on the blind profile.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title" htmlFor="f-title">
                <Input id="f-title" value={c.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Senior Data Engineer" />
              </Field>
              <Field label="Practice" htmlFor="f-disc">
                <Select
                  id="f-disc"
                  className="w-full"
                  value={c.discipline}
                  onValueChange={(v) => set({ discipline: v })}
                  options={DISCIPLINES.map((d) => ({ value: d, label: d === "DevOps / Cloud" ? "Cloud & DevOps" : d }))}
                />
              </Field>
              <Field label="Years of experience" htmlFor="f-years">
                <Input
                  id="f-years"
                  type="number"
                  min={0}
                  max={45}
                  value={c.yearsExperience}
                  onChange={(e) => set({ yearsExperience: Math.max(0, Number(e.target.value)) })}
                  className="tnum"
                />
              </Field>
              <Field label="Stage" htmlFor="f-stage">
                <Select
                  id="f-stage"
                  className="w-full"
                  value={c.benchStage}
                  onValueChange={(v) =>
                    set({ benchStage: v, availability: v === "Placed" ? "PLACED" : c.availability === "PLACED" ? "IMMEDIATE" : c.availability })
                  }
                  options={STAGES.map((s) => ({ value: s, label: s === "Interview" ? "Client interview" : s }))}
                />
              </Field>
            </div>
            <fieldset>
              <legend className="text-[13px] font-medium text-ink-2">Cloud platforms</legend>
              <div className="mt-1.5 flex flex-wrap gap-x-6">
                {(["AWS", "Azure", "GCP"] as Cloud[]).map((cl) => (
                  <Checkbox
                    key={cl}
                    id={`cl-${cl}`}
                    label={cl}
                    checked={c.clouds.includes(cl)}
                    onCheckedChange={(v) => set({ clouds: v ? [...c.clouds, cl] : c.clouds.filter((x) => x !== cl) })}
                  />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[13px] font-medium text-ink-2">Industry experience</legend>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {INDUSTRIES.map((d) => {
                  const on = c.domains.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set({ domains: on ? c.domains.filter((x) => x !== d) : [...c.domains, d] })}
                      className={chip(on)}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <Field label="Certifications" htmlFor="f-cert" hint="Press Enter to add each one.">
              <div className="flex flex-wrap gap-1.5">
                {c.certifications.map((x) => (
                  <span key={x} className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-hair bg-canvas pr-1 pl-2.5 text-[13px] text-ink">
                    {x}
                    <button
                      type="button"
                      aria-label={`Remove ${x}`}
                      onClick={() => set({ certifications: c.certifications.filter((y) => y !== x) })}
                      className="grid size-5 place-items-center rounded-[4px] text-subtle hover:bg-[#e6eaf0] hover:text-ink"
                    >
                      <IconX size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id="f-cert"
                value={certText}
                onChange={(e) => setCertText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = certText.trim();
                    if (v && !c.certifications.includes(v)) set({ certifications: [...c.certifications, v] });
                    setCertText("");
                  }
                }}
                placeholder="e.g. AWS Solutions Architect Professional"
              />
            </Field>
          </Section>

          <Section id="skills" title="Skills" description="Primary skills lead the profile and weigh most in matching.">
            {c.skills.length > 0 && (
              <ul className="overflow-hidden rounded-[8px] border border-hair bg-surface">
                {c.skills.map((s, i) => (
                  <li
                    key={s.skill}
                    className="grid min-h-[52px] grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-hair px-3 py-2 last:border-b-0"
                  >
                    <span className="truncate text-[14px] font-medium text-ink">{s.skill}</span>
                    <label className="flex items-center gap-1.5 text-xs text-subtle">
                      Years
                      <input
                        type="number"
                        min={0}
                        max={c.yearsExperience}
                        value={s.years}
                        onChange={(e) => updSkill(i, { years: Math.max(0, Number(e.target.value)) })}
                        className="tnum h-8 w-16 rounded-[6px] bg-surface px-2 text-[14px] text-ink ring-1 ring-control ring-inset focus:ring-2 focus:ring-cobalt focus:outline-none"
                        aria-label={`Years of ${s.skill}`}
                      />
                    </label>
                    <Checkbox id={`prim-${i}`} label="Primary" checked={s.primary} onCheckedChange={(v) => updSkill(i, { primary: v })} />
                    <button
                      type="button"
                      aria-label={`Remove ${s.skill}`}
                      onClick={() => set({ skills: c.skills.filter((_, k) => k !== i) })}
                      className="grid size-8 place-items-center rounded-[6px] text-subtle transition-colors hover:bg-canvas hover:text-ink"
                    >
                      <IconX size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <Input
                value={skillText}
                onChange={(e) => setSkillText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a skill, e.g. Kubernetes"
                aria-label="Add a skill"
              />
              <Button onClick={addSkill}>
                <IconPlus size={15} />
                Add
              </Button>
            </div>
          </Section>

          <Section id="compliance" title="Work authorization and compliance" description="Both blocking checks must clear before the profile is listable.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Work authorization" htmlFor="f-auth">
                <Select
                  id="f-auth"
                  className="w-full"
                  value={c.workAuthorization}
                  onValueChange={(v: WorkAuth) =>
                    setC((x) => ({
                      ...x,
                      workAuthorization: v,
                      clearance: v === "US_CITIZEN" ? x.clearance : "None",
                      compliance: { ...x.compliance, visaExpiry: ["H1B", "EAD_OPT", "TN"].includes(v) ? x.compliance.visaExpiry : null },
                    }))
                  }
                  options={(Object.keys(WORK_AUTH_LABEL) as WorkAuth[]).map((w) => ({ value: w, label: WORK_AUTH_LABEL[w] }))}
                />
              </Field>
              {needsVisa ? (
                <Field label="Visa or EAD expiry" htmlFor="f-visa">
                  <Input id="f-visa" type="date" value={c.compliance.visaExpiry ?? ""} onChange={(e) => setComp({ visaExpiry: e.target.value || null })} />
                </Field>
              ) : (
                <Field label="Security clearance" htmlFor="f-clear">
                  <Select
                    id="f-clear"
                    className="w-full"
                    value={c.clearance}
                    onValueChange={(v: Clearance) => set({ clearance: v })}
                    options={(["None", "Public Trust", "Secret", "Top Secret"] as Clearance[]).map((v) => ({
                      value: v,
                      label: v === "None" ? "No clearance" : v,
                    }))}
                  />
                </Field>
              )}
              <Field label="Background check" htmlFor="f-bg">
                <Select
                  id="f-bg"
                  className="w-full"
                  value={c.compliance.backgroundCheck}
                  onValueChange={(v: Candidate["compliance"]["backgroundCheck"]) => setComp({ backgroundCheck: v })}
                  options={(["Not started", "In progress", "Cleared"] as const).map((v) => ({ value: v, label: v }))}
                />
              </Field>
              <Field label="References completed" htmlFor="f-refs">
                <Select
                  id="f-refs"
                  className="w-full"
                  value={String(c.compliance.referencesCompleted)}
                  onValueChange={(v) => setComp({ referencesCompleted: Number(v) })}
                  options={["0", "1", "2", "3"].map((v) => ({ value: v, label: `${v} of 3` }))}
                />
              </Field>
            </div>
            <div className="grid gap-x-6 sm:grid-cols-3">
              <Checkbox
                id="f-everify"
                label="Verified through E-Verify"
                checked={c.compliance.workAuthVerified}
                onCheckedChange={(v) => setComp({ workAuthVerified: v })}
              />
              <Checkbox id="f-i9" label="Form I-9 complete" checked={c.compliance.i9Complete} onCheckedChange={(v) => setComp({ i9Complete: v })} />
              <Checkbox id="f-nda" label="Consultant NDA signed" checked={c.compliance.ndaSigned} onCheckedChange={(v) => setComp({ ndaSigned: v })} />
            </div>
          </Section>

          <Section id="availability" title="Availability and rates" description="What the consultant is paid. Margin is set on the rate desk.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Availability" htmlFor="f-avail">
                <Select
                  id="f-avail"
                  className="w-full"
                  value={c.availability}
                  onValueChange={(v: Availability) => set({ availability: v, availableFrom: v === "IMMEDIATE" ? null : c.availableFrom })}
                  options={
                    [
                      { value: "IMMEDIATE", label: "Immediate" },
                      { value: "TWO_WEEKS", label: "Within 2 weeks" },
                      { value: "SPECIFIC_DATE", label: "From a specific date" },
                      { value: "PLACED", label: "Placed" },
                    ] as { value: Availability; label: string }[]
                  }
                />
              </Field>
              {c.availability !== "IMMEDIATE" && c.availability !== "PLACED" && (
                <Field label="Available from" htmlFor="f-from">
                  <Input id="f-from" type="date" value={c.availableFrom ?? ""} onChange={(e) => set({ availableFrom: e.target.value || null })} />
                </Field>
              )}
              <Field label="C2C rate ($/hr)" htmlFor="f-c2c">
                <Input id="f-c2c" type="number" min={0} value={c.rateC2C} onChange={(e) => set({ rateC2C: Number(e.target.value) })} className="tnum" />
              </Field>
              <Field
                label="W2 rate ($/hr)"
                htmlFor="f-w2"
                hint={c.rateC2C > 0 ? `Typically about ${Math.round(c.rateC2C * 0.82)} for this C2C rate.` : undefined}
              >
                <Input id="f-w2" type="number" min={0} value={c.rateW2} onChange={(e) => set({ rateW2: Number(e.target.value) })} className="tnum" />
              </Field>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-hair bg-canvas px-4 py-3 text-[14px]">
              <span className="text-muted">
                Availability last confirmed {freshnessDays(c.lastVerifiedAt) === 0 ? "today" : freshnessDays(c.lastVerifiedAt) === 1 ? "yesterday" : `${freshnessDays(c.lastVerifiedAt)} days ago`}
              </span>
              <Button size="sm" onClick={() => set({ lastVerifiedAt: new Date(DEMO_NOW).toISOString() })}>
                Mark confirmed today
              </Button>
            </div>
          </Section>

          <Section id="screen" title="Technical screen" description="Scores from the 90-minute live panel, out of 100.">
            <div className="grid gap-4 sm:grid-cols-4">
              {(
                [
                  ["systemDesign", "System design"],
                  ["coding", "Hands-on coding"],
                  ["domain", "Domain depth"],
                  ["communication", "Communication"],
                ] as const
              ).map(([k, l]) => (
                <Field key={k} label={l} htmlFor={`s-${k}`}>
                  <Input
                    id={`s-${k}`}
                    type="number"
                    min={0}
                    max={100}
                    value={breakdown[k] || ""}
                    onChange={(e) => setScore(k, Number(e.target.value))}
                    placeholder="0–100"
                    className="tnum"
                  />
                </Field>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Screened by" htmlFor="s-by">
                <Input id="s-by" value={c.screenedBy ?? ""} onChange={(e) => set({ screenedBy: e.target.value || null })} placeholder="Panel engineer" />
              </Field>
              <div className="flex items-end">
                <div className="flex h-9 w-full items-center gap-3 rounded-[6px] border border-hair bg-canvas px-3">
                  <span className="text-[13px] text-subtle">Overall</span>
                  <span className="tnum text-[18px] leading-none font-semibold text-ink">{c.technicalScreenScore ?? "–"}</span>
                  <SegmentBar className="ml-auto w-28" percent={c.technicalScreenScore ?? 0} label="Overall screen score" />
                </div>
              </div>
            </div>
          </Section>

          <Section id="projects" title="Projects and notes" description="Verified projects carry a check on the profile. Notes stay internal.">
            <ul className="space-y-3">
              {c.architectureProjects.map((p, i) => (
                <li key={i} className="rounded-[8px] border border-hair bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1 space-y-3">
                      <Input value={p.name} onChange={(e) => updProject(i, { name: e.target.value })} placeholder="Project name" aria-label="Project name" />
                      <Textarea
                        value={p.summary}
                        onChange={(e) => updProject(i, { summary: e.target.value })}
                        rows={2}
                        placeholder="What they built and the outcome"
                        aria-label="Project summary"
                        className="min-h-0"
                      />
                      <Checkbox id={`pv-${i}`} label="Verified with a reference" checked={p.verified} onCheckedChange={(v) => updProject(i, { verified: v })} />
                    </div>
                    <button
                      type="button"
                      aria-label="Remove project"
                      onClick={() => set({ architectureProjects: c.architectureProjects.filter((_, k) => k !== i) })}
                      className="grid size-8 place-items-center rounded-[6px] text-subtle transition-colors hover:bg-canvas hover:text-ink"
                    >
                      <IconX size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Button size="sm" onClick={() => set({ architectureProjects: [...c.architectureProjects, { name: "", summary: "", verified: false }] })}>
              <IconPlus size={15} />
              Add project
            </Button>
            <Field label="Vetting notes (internal)" htmlFor="f-notes">
              <Textarea id="f-notes" rows={3} value={c.vettingNotes} onChange={(e) => set({ vettingNotes: e.target.value })} />
            </Field>
          </Section>

          {/* Sticky action bar (reference sheet-footer anatomy) */}
          <div className="sticky bottom-0 z-10 flex min-h-16 items-center justify-between gap-3 rounded-b-[8px] bg-surface px-5 py-3 shadow-[0_-1px_0_var(--color-hair)] sm:px-6">
            <p className="hidden text-[13px] text-subtle sm:block">
              {mode === "create" ? "The candidate starts in the stage you choose." : "Changes are written to the audit log."}
            </p>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant="primary" onClick={save}>
                {mode === "create" ? "Add candidate" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Side rail: readiness and section jump links */}
      <aside className="space-y-4 xl:sticky xl:top-[80px] xl:self-start">
        <section className="rounded-[8px] border border-hair bg-surface">
          <div className="border-b border-hair p-5">
            <p className="tnum text-[12.5px] font-semibold text-subtle">{c.code}</p>
            <p className="mt-0.5 truncate text-[16px] font-semibold tracking-[-0.01em] text-ink">
              {c.firstName || c.lastName ? `${c.firstName} ${c.lastName}` : "New candidate"}
            </p>
            <div className="mt-2.5">
              <StatusDot tone={isListable(c) ? "success" : "warning"}>{isListable(c) ? "Visible to customers" : "Not visible to customers yet"}</StatusDot>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[16px] font-semibold text-ink">Readiness</span>
              <span className="tnum text-[12.5px] font-medium text-ink">
                {checks.filter((k) => k.ok).length}/{checks.length}
              </span>
            </div>
            <SegmentBar
              className="mt-2.5"
              segments={checks.length * 3}
              percent={(checks.filter((k) => k.ok).length / checks.length) * 100}
              tone={checks.some((k) => k.blocking && !k.ok) ? "danger" : checks.every((k) => k.ok) ? "success" : "brand"}
              label="Readiness"
            />
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {checks.map((k) => (
                <li key={k.label} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid size-[18px] shrink-0 place-items-center rounded-full",
                      k.ok
                        ? "bg-tag-green-bg text-tag-green-text"
                        : k.blocking
                          ? "bg-tag-red-bg text-tag-red-text"
                          : "bg-canvas text-subtle shadow-[inset_0_0_0_1px_var(--color-hair)]",
                    )}
                  >
                    {k.ok ? (
                      <IconCheck size={11} strokeWidth={3} />
                    ) : k.blocking ? (
                      <IconAlert size={11} strokeWidth={2.5} />
                    ) : (
                      <span className="size-1 rounded-full bg-current" />
                    )}
                  </span>
                  <span className={k.ok ? "text-ink" : "text-muted"}>{k.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <nav aria-label="Form sections" className="hidden rounded-[8px] border border-hair bg-surface p-2 xl:block">
          {NAV.map(([id, l]) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex h-9 items-center rounded-[6px] px-3 text-[14px] text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink"
            >
              {l}
            </a>
          ))}
        </nav>
      </aside>
    </PageBody>
  );
}
