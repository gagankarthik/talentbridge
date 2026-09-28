import type { Metadata } from "next";
import { candidateById, currentRecruiter, presentable, requests } from "@/lib/data";
import { availabilityOf, blindName, DEMO_NOW } from "@/lib/format";
import type { EngagementStatus } from "@/lib/types";
import { PageHeader } from "@/components/layout/app-shell";
import { RequestTalentButton } from "@/features/request-engine/talent-request";
import { DashboardView, type DashboardData } from "@/features/dashboard/dashboard-view";

export const metadata: Metadata = { title: "Dashboard" };

const PRACTICES = [
  ["Data & AI", "Data & AI"],
  ["DevOps / Cloud", "Cloud & DevOps"],
  ["Full-Stack", "Full-Stack"],
] as const;

export default function DashboardPage() {
  const mine = requests.filter((r) => r.recruiterId === currentRecruiter.id);
  const submitted = mine.filter((r) => r.status !== "DRAFT");
  const reached = (s: EngagementStatus[]) => submitted.filter((r) => s.includes(r.status)).length;
  const interviewed = reached(["INTERVIEWING", "OFFERED", "ACTIVE", "COMPLETED"]);
  const onBench = presentable.filter((c) => c.benchStage === "Available");


  const data: DashboardData = {
    availableNow: onBench.filter((c) => c.availability === "IMMEDIATE").length,
    onBench: onBench.length,
    submitted30: submitted.filter((r) => DEMO_NOW - new Date(r.createdAt).getTime() < 30 * 86_400_000).length,
    interviewRate: submitted.length ? Math.round((interviewed / submitted.length) * 100) : 0,
    availability: PRACTICES.map(([key, label]) => {
      const list = onBench.filter((c) => c.discipline === key);
      return { label, parts: [list.filter((c) => c.availability === "IMMEDIATE").length, list.filter((c) => c.availability === "TWO_WEEKS").length, list.filter((c) => c.availability === "SPECIFIC_DATE").length] };
    }),
    funnel: [
      { label: "Submitted", value: submitted.length },
      { label: "Interviewing", value: interviewed },
      { label: "Offered", value: reached(["OFFERED", "ACTIVE", "COMPLETED"]) },
      { label: "Placed", value: reached(["ACTIVE", "COMPLETED"]) },
    ],
    holds: mine
      .filter((r) => r.lockExpiresAt)
      .map((r) => {
        const c = candidateById.get(r.candidateId)!;
        return { id: r.id, code: c.code, title: c.title, name: blindName(c), client: r.clientName, expiresAt: r.lockExpiresAt! };
      }),
    recent: [...onBench]
      .sort((a, b) => b.lastVerifiedAt.localeCompare(a.lastVerifiedAt))
      .slice(0, 6)
      .map((c) => ({ code: c.code, title: c.title, available: availabilityOf(c).label, lastVerifiedAt: c.lastVerifiedAt })),
  };

  return (
    <>
      <PageHeader title="Dashboard" actions={<RequestTalentButton variant="primary" size="md">Match a job spec</RequestTalentButton>} />
      <DashboardView data={data} />
    </>
  );
}
