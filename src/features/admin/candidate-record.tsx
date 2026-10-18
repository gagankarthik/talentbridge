"use client";

import Link from "next/link";
import type { Candidate } from "@/lib/types";
import { WORK_AUTH_SHORT } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { buttonClass } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/status-dot";
import { EmptyState } from "@/components/ui/data-display";
import { IconExternal, IconUsers } from "@/components/icons";
import { useAdmin } from "./admin-store";
import { CandidateForm } from "./candidate-form";
import { nextCandidateCode, practiceLabel, STAGE_STATUS, stageLabel, useAllCandidates } from "./candidate-list";
import { Meta } from "./ui";

const CRUMBS = [{ label: "Candidates", href: "/admin/candidates" }];

export function NewCandidate({ seed }: { seed: Candidate[] }) {
  const { ready } = useAdmin();
  const all = useAllCandidates(seed);
  return (
    <>
      <PageHeader
        breadcrumb={[...CRUMBS, { label: "Add candidate" }]}
        title="Add candidate"
        description="Creates the internal record. The blind profile becomes visible to customers once work authorization and the background check clear."
      />
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
        <PageHeader breadcrumb={[...CRUMBS, { label: code }]} title="Candidate not found" />
        <EmptyState
          className="py-24"
          icon={<IconUsers size={18} />}
          title={`No candidate with the code ${code}`}
          description="It may have been removed, or the link is wrong."
          action={
            <Link href="/admin/candidates" className={buttonClass("secondary", "md")}>
              Back to candidates
            </Link>
          }
        />
      </>
    );
  return (
    <>
      <PageHeader
        breadcrumb={[...CRUMBS, { label: c.code }]}
        title={`${c.firstName} ${c.lastName}`}
        status={<StatusDot tone={STAGE_STATUS[c.benchStage]}>{stageLabel(c.benchStage)}</StatusDot>}
        description={
          <Meta items={[c.code, c.title, `${c.yearsExperience} years`, practiceLabel(c.discipline), WORK_AUTH_SHORT[c.workAuthorization], c.metro]} />
        }
        actions={
          <Link href={`/one-sheet/${c.code}`} target="_blank" className={buttonClass("secondary", "md")}>
            <IconExternal size={16} />
            Blind one-sheet
          </Link>
        }
      />
      {/* Remount when the saved record changes so the form starts from it */}
      <CandidateForm key={JSON.stringify(c)} mode="edit" initial={c} nextCode={c.code} existingEmails={[]} />
    </>
  );
}
