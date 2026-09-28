"use client";

import Link from "next/link";
import type { Candidate } from "@/lib/types";
import { PageHeader } from "@/components/layout/app-shell";
import { Pill } from "@/components/ui/status";
import { useAdmin } from "./admin-store";
import { CandidateForm } from "./candidate-form";
import { nextCandidateCode, STAGE_TONE, useAllCandidates } from "./candidate-list";

export function NewCandidate({ seed }: { seed: Candidate[] }) {
  const { ready } = useAdmin();
  const all = useAllCandidates(seed);
  return (
    <>
      <PageHeader title="Add candidate" />
      {ready && <CandidateForm mode="create" nextCode={nextCandidateCode(all)} existingEmails={all.map((c) => c.email.toLowerCase())} />}
    </>
  );
}

export function CandidateRecord({ seed, code }: { seed: Candidate[]; code: string }) {
  const { ready } = useAdmin();
  const all = useAllCandidates(seed);
  const c = all.find((x) => x.code === code);
  if (!ready) return null;
  if (!c)
    return (
      <>
        <PageHeader title="Candidate not found" />
        <div className="px-4 py-10 text-center sm:px-6">
          <p className="text-[15px] text-muted">There is no candidate with the code {code}.</p>
          <Link href="/admin/candidates" className="mt-3 inline-block text-sm font-medium text-cobalt hover:underline">
            Back to candidates
          </Link>
        </div>
      </>
    );
  return (
    <>
      <PageHeader
        title={`${c.firstName} ${c.lastName}`}
        actions={<Pill tone={STAGE_TONE[c.benchStage]}>{c.benchStage === "Interview" ? "Client interview" : c.benchStage}</Pill>}
      />
      {/* Remount when the saved record changes so the form starts from it */}
      <CandidateForm key={JSON.stringify(c)} mode="edit" initial={c} nextCode={c.code} existingEmails={[]} />
    </>
  );
}
