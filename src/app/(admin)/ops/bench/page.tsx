import type { Metadata } from "next";
import { candidates } from "@/lib/data";
import { complianceIssues } from "@/lib/compliance";
import { PageHeader } from "@/components/layout/app-shell";
import { BenchBoard, type BenchCard } from "@/features/ops/bench-board";

export const metadata: Metadata = { title: "Bench tracker" };

export default function BenchPage() {
  const cards: BenchCard[] = candidates.map((c) => {
    const issues = complianceIssues(c);
    return {
      id: c.id,
      code: c.code,
      name: `${c.firstName} ${c.lastName}`,
      title: c.title,
      discipline: c.discipline,
      stage: c.benchStage,
      rateC2C: c.rateC2C,
      score: c.technicalScreenScore,
      lastVerifiedAt: c.lastVerifiedAt,
      flags: issues.filter((i) => i.severity === "flag").map((i) => i.label),
      notices: issues.filter((i) => i.severity === "notice").map((i) => i.label),
    };
  });

  return (
    <>
      <PageHeader
        title="Bench tracker"
      />
      <BenchBoard initial={cards} />
    </>
  );
}
