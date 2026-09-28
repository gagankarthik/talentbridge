import type { Metadata } from "next";
import { Suspense } from "react";
import { candidates } from "@/lib/data";
import { PageHeader } from "@/components/layout/app-shell";
import { CandidateList } from "@/features/admin/candidate-list";

export const metadata: Metadata = { title: "Candidates" };

export default function CandidatesPage() {
  return (
    <>
      <PageHeader title="Candidates" />
      <Suspense>
        <CandidateList seed={candidates} />
      </Suspense>
    </>
  );
}
