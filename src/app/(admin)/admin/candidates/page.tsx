import type { Metadata } from "next";
import { Suspense } from "react";
import { candidates } from "@/lib/data";
import { CandidateList } from "@/features/admin/candidate-list";

export const metadata: Metadata = { title: "Candidates" };

export default function CandidatesPage() {
  return (
    <Suspense>
      <CandidateList seed={candidates} />
    </Suspense>
  );
}
