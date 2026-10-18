import type { Metadata } from "next";
import { candidates } from "@/lib/data";
import { complianceIssues } from "@/lib/compliance";
import type { BenchStage } from "@/lib/types";
import { AdminOverview, type OpsData } from "@/features/admin/overview";

export const metadata: Metadata = { title: "Platform overview" };

const STAGES: BenchStage[] = ["Onboarding", "Vetting", "Available", "Interview", "Placed"];

export default function AdminOverviewPage() {
  const ops: OpsData = {
    stages: STAGES.map((stage) => ({
      label: stage === "Interview" ? "Client interview" : stage,
      value: candidates.filter((c) => c.benchStage === stage).length,
    })),
    attention: candidates
      .flatMap((c) =>
        complianceIssues(c).map((i) => ({ code: c.code, name: `${c.firstName} ${c.lastName}`, label: i.label, severity: i.severity, due: i.dueInDays })),
      )
      .sort((a, b) => (a.severity === b.severity ? (a.due ?? 999) - (b.due ?? 999) : a.severity === "flag" ? -1 : 1)),
  };
  return <AdminOverview ops={ops} />;
}
