import type { Metadata } from "next";
import { Suspense } from "react";
import { allSkills } from "@/lib/data";
import { TalentExplorer } from "@/features/talent/talent-explorer";

export const metadata: Metadata = { title: "Talent inventory" };

// The explorer owns its header: the saved-view tabs and result count depend on client state.
export default function TalentPage() {
  return (
    <Suspense>
      <TalentExplorer skills={allSkills} />
    </Suspense>
  );
}
