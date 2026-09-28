import type { Metadata } from "next";
import { candidates } from "@/lib/data";
import { NewCandidate } from "@/features/admin/candidate-record";

export const metadata: Metadata = { title: "Add candidate" };

export default function NewCandidatePage() {
  return <NewCandidate seed={candidates} />;
}
