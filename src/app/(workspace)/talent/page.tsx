import type { Metadata } from "next";
import { Suspense } from "react";
import { allSkills } from "@/lib/data";
import { PageHeader } from "@/components/layout/app-shell";
import { RequestTalentButton } from "@/features/request-engine/talent-request";
import { TalentExplorer } from "@/features/talent/talent-explorer";

export const metadata: Metadata = { title: "Talent inventory" };

export default function TalentPage() {
  return (
    <>
      <PageHeader
        title="Talent inventory"
        actions={<RequestTalentButton variant="primary" size="md">Match a job spec</RequestTalentButton>}
      />
      <Suspense>
        <TalentExplorer skills={allSkills} />
      </Suspense>
    </>
  );
}
