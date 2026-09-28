"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { IconCheck } from "@/components/icons";
import { Select } from "@/components/ui/select";

const FREE_MAIL = /@(gmail|yahoo|outlook|hotmail|icloud|aol|proton)\./i;

function Choice<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: T[] }) {
  return (
    <fieldset>
      <legend className="text-[13px] font-medium text-ink-2">{label}</legend>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "h-10 rounded-full px-4 text-[14px] ring-1 ring-inset transition-colors",
              value === o ? "bg-brand-wash font-medium text-brand-strong ring-brand" : "text-ink-2 ring-line-strong hover:bg-canvas",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** Hiring enquiry. Demo build: validates and confirms locally; nothing is sent. */
export function HireTalentForm({ onDone, compact, initialWho = "Enterprise" }: { onDone?: () => void; compact?: boolean; initialWho?: "Enterprise" | "Staffing agency" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [roles, setRoles] = useState("");
  const [rate, setRate] = useState("Not sure yet");
  const [who, setWho] = useState<"Enterprise" | "Staffing agency">(initialWho);
  const [model, setModel] = useState<"Contract" | "Contract-to-hire" | "Delivery team">("Contract");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid work email.";
    else if (FREE_MAIL.test(email)) err.email = "Use your company email address.";
    if (!company.trim()) err.company = "Add your company name.";
    if (!roles.trim()) err.roles = "Tell us which roles you need to fill.";
    setErrors(err);
    if (!Object.keys(err).length) setSent(true);
  };

  if (sent)
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-avail-bg text-avail-ink">
          <IconCheck size={22} strokeWidth={2.25} />
        </span>
        <p className="mt-4 text-[18px] font-semibold">Thanks, {name.split(" ")[0]}. We&apos;re on it.</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          A client partner will reply to {email} within one business day with matched profiles for your {model.toLowerCase()} roles.
        </p>
        {onDone && (
          <Button className="mt-6" onClick={onDone}>
            Close
          </Button>
        )}
      </div>
    );

  const err = (k: string) => errors[k] && <p className="text-xs text-flag-ink">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Choice label="I'm hiring for" value={who} onChange={setWho} options={["Enterprise", "Staffing agency"]} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="h-name">
          <Input inputSize="lg" id="h-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
          {err("name")}
        </Field>
        <Field label="Company" htmlFor="h-company">
          <Input inputSize="lg" id="h-company" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" aria-invalid={!!errors.company} />
          {err("company")}
        </Field>
      </div>
      <Field label="Work email" htmlFor="h-email">
        <Input inputSize="lg" id="h-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-invalid={!!errors.email} />
        {err("email")}
      </Field>
      <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
        <Field label="Roles you need to fill" htmlFor="h-roles">
          <Input inputSize="lg" id="h-roles" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="e.g. 2 senior data engineers" aria-invalid={!!errors.roles} />
          {err("roles")}
        </Field>
        <Field label="Budget (optional)" htmlFor="h-rate">
          <Select
            id="h-rate"
            size="lg"
            className="w-full"
            value={rate}
            onValueChange={setRate}
            options={["Under $80/hr", "$80–100/hr", "$100–125/hr", "$125–150/hr", "$150+/hr", "Not sure yet"].map((r) => ({ value: r, label: r }))}
          />
        </Field>
      </div>
      {!compact && <Choice label="Engagement type" value={model} onChange={setModel} options={["Contract", "Contract-to-hire", "Delivery team"]} />}
      <Button type="submit" variant="primary" size="lg" className="h-12 w-full rounded-full text-[15px] font-semibold">
        Send hiring request
      </Button>
      <p className="text-center text-xs text-subtle">
        By sending this request you agree to our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-ink">
          terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
          privacy policy
        </a>
        . We reply within one business day.
      </p>
    </form>
  );
}
