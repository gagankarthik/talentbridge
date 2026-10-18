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
      className="space-y-5 [&_label]:text-[14px] [&_label]:text-[#0b1b33] [&_input]:ring-[#7b8598]"
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
        <Input inputSize="lg" className="h-12 rounded-[6px] text-[16px]" id="l-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Password" htmlFor="l-password">
        <Input inputSize="lg" className="h-12 rounded-[6px] text-[16px]" id="l-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      {error && (
        <p role="alert" className="rounded-[6px] border border-[#f3c2bd] bg-[#fdecea] px-3.5 py-2.5 text-[15px] font-medium text-[#b42318]">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" className="h-12 w-full rounded-[6px] text-[16px] font-semibold" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      <div className="flex items-center gap-3 text-[14px] text-[#5f6b80]" aria-hidden="true">
        <span className="h-px flex-1 bg-[#dfe3ea]" />
        or
        <span className="h-px flex-1 bg-[#dfe3ea]" />
      </div>
      <button
        type="button"
        className="inline-flex h-12 w-full items-center justify-center rounded-[6px] border border-[#7b8598] bg-white text-[16px] font-semibold text-[#0b1b33] transition-colors hover:border-[#3d4a60] hover:bg-[#f5f7fa]"
        onClick={() => router.push("/dashboard")}
      >
        Sign in with company SSO
      </button>
    </form>
  );
}
