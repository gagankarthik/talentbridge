"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { roleBySlug } from "@/lib/roles";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { IconCheck } from "@/components/icons";

const AUTH = ["US Citizen", "Green Card", "H-1B", "EAD", "TN"];

/** Consultant application. Demo build: validates and confirms locally; nothing is sent. */
export function ApplyForm() {
  const role = roleBySlug.get(useSearchParams().get("role") ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [auth, setAuth] = useState(AUTH[0]);
  const [years, setYears] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email.";
    if (!skillsText.trim()) err.skills = "Add the skills you want to be matched on.";
    const y = Number(years);
    if (!years || !Number.isFinite(y) || y < 0) err.years = "Add your years of experience.";
    else if (y < 4) err.years = "Our bench is for engineers with 4 or more years of professional experience.";
    setErrors(err);
    if (!Object.keys(err).length) setSent(true);
  };

  if (sent)
    return (
      <div className="py-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-avail-bg text-avail-ink">
          <IconCheck size={22} strokeWidth={2.25} />
        </span>
        <p className="mt-4 text-[18px] font-semibold">Application received</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          We&apos;ll email {email} within two business days to book your intake call{role ? ` for ${role.title}` : ""}.
        </p>
      </div>
    );

  const pills = (value: string, set: (v: string) => void, options: string[], label: string) => (
    <fieldset>
      <legend className="text-[14px] font-medium text-[#0b1b33]">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => set(o)}
            className={cn(
              "h-11 rounded-[6px] border px-4 text-[15px] font-medium transition-colors duration-150",
              value === o ? "border-[#2558e0] bg-[#eef3fd] text-[#1d47c0]" : "border-[#7b8598] bg-white text-[#3d4a60] hover:border-[#3d4a60] hover:text-[#0b1b33]",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={submit} noValidate className="space-y-5 [&_input]:h-12 [&_input]:rounded-[6px] [&_input]:text-[16px] [&_label]:text-[14px] [&_input]:ring-[#7b8598]">
      {role && (
        <div className="flex items-start justify-between gap-3 rounded-[6px] border border-[#b4c8f6] bg-[#eef3fd] px-4 py-3 text-[15px]">
          <span>
            <span className="block text-[14px] text-[#1d47c0]">Applying for</span>
            <span className="font-semibold text-[#0b1b33]">{role.title}</span>
          </span>
          <Link href="/careers" scroll={false} className="shrink-0 text-[14px] font-medium text-[#1d47c0] underline underline-offset-2">
            General application
          </Link>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="a-name">
          <Input inputSize="lg" id="a-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
          {errors.name && <p className="text-[14px] text-[#b42318]">{errors.name}</p>}
        </Field>
        <Field label="Email" htmlFor="a-email">
          <Input inputSize="lg" id="a-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.email} />
          {errors.email && <p className="text-[14px] text-[#b42318]">{errors.email}</p>}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
        <Field label="LinkedIn or portfolio (optional)" htmlFor="a-link">
          <Input inputSize="lg" id="a-link" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/…" />
        </Field>
        <Field label="Years of experience" htmlFor="a-years">
          <Input inputSize="lg" id="a-years" type="number" inputMode="numeric" min={0} value={years} onChange={(e) => setYears(e.target.value)} aria-invalid={!!errors.years} />
        </Field>
      </div>
      {errors.years && <p className="-mt-2 text-[14px] text-[#b42318]">{errors.years}</p>}
      <Field label="Primary skills" htmlFor="a-skills" hint="The skills you want to be matched on, e.g. the tools and platforms you know best.">
        <Input inputSize="lg" id="a-skills" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} aria-invalid={!!errors.skills} />
        {errors.skills && <p className="text-[14px] text-[#b42318]">{errors.skills}</p>}
      </Field>
      {pills(auth, setAuth, AUTH, "Work authorization")}
      <Button type="submit" variant="primary" size="lg" className="h-12 w-full rounded-[6px] text-[16px] font-semibold">
        Apply to join the bench
      </Button>
      <p className="text-center text-[14px] text-[#5f6b80]">
        By applying you agree to our{" "}
        <a href="/privacy#consultants" className="underline underline-offset-2 hover:text-[#0b1b33]">
          privacy policy
        </a>
        , including how we verify work authorization.
      </p>
    </form>
  );
}
