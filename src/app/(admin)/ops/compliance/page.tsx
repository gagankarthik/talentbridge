import type { Metadata } from "next";
import { candidates, presentable } from "@/lib/data";
import { complianceIssues } from "@/lib/compliance";
import { PageHeader } from "@/components/layout/app-shell";
import { ComplianceQueue, type QueueItem } from "@/features/ops/compliance-queue";

export const metadata: Metadata = { title: "Compliance queue" };

export default function CompliancePage() {
  const items: QueueItem[] = candidates.flatMap((c) =>
    complianceIssues(c).map((i) => ({
      id: `${c.id}:${i.key}`,
      candidateCode: c.code,
      name: `${c.firstName} ${c.lastName}`,
      title: c.title,
      stage: c.benchStage,
      label: i.label,
      detail: i.detail,
      severity: i.severity,
      dueInDays: i.dueInDays,
    })),
  );
  const count = (key: string) => candidates.filter((c) => complianceIssues(c).some((i) => i.key === key)).length;

  return (
    <>
      <PageHeader
        title="Compliance"
      />
      <ComplianceQueue
        items={items}
        stats={{
          presentable: presentable.length,
          presentableVerified: presentable.filter((c) => c.compliance.workAuthVerified).length,
          visa90: count("visa"),
          bgPending: count("bg"),
          stale: count("fresh"),
        }}
      />
    </>
  );
}
