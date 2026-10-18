import type { Metadata } from "next";
import { candidateById, currentRecruiter, requests } from "@/lib/data";
import { blindName } from "@/lib/format";
import { RequestsView, type RequestRow } from "@/features/requests/requests-view";

export const metadata: Metadata = { title: "Requests and holds" };

export default function RequestsPage() {
  const seeded: RequestRow[] = requests
    .filter((r) => r.recruiterId === currentRecruiter.id)
    .map((r) => {
      const c = candidateById.get(r.candidateId)!;
      return { ...r, code: c.code, title: c.title, revealedName: blindName(c) };
    });

  // The view owns its header: tab counts include holds placed in this browser session.
  return <RequestsView seeded={seeded} />;
}
