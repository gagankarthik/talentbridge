"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

/** Partner sign-in. Demo build: validates the form and opens the workspace; no credentials are sent anywhere. */
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Enter the work email you registered with.");
        if (password.length < 8) return setError("Passwords are at least 8 characters.");
        setError(null);
        setBusy(true);
        router.push("/dashboard");
      }}
    >
      <Field label="Work email" htmlFor="l-email">
        <Input inputSize="lg" id="l-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Password" htmlFor="l-password">
        <Input inputSize="lg" id="l-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      {error && (
        <p role="alert" className="text-[13px] text-flag-ink">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" className="h-12 w-full rounded-full text-[15px] font-semibold" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex items-center gap-3 text-xs text-subtle">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <Button size="lg" className="h-12 w-full rounded-full text-[15px] font-semibold" onClick={() => router.push("/dashboard")}>
        Sign in with company SSO
      </Button>
    </form>
  );
}
