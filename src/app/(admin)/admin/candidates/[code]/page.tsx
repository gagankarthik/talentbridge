import type { Metadata } from "next";
import { candidates } from "@/lib/data";
import { CandidateRecord } from "@/features/admin/candidate-record";

export async function generateMetadata({ params }: PageProps<"/admin/candidates/[code]">): Promise<Metadata> {
  const { code } = await params;
  return { title: `Candidate ${code}` };
}

export default async function CandidatePage({ params }: PageProps<"/admin/candidates/[code]">) {
  const { code } = await params;
  return <CandidateRecord seed={candidates} code={decodeURIComponent(code)} />;
}
