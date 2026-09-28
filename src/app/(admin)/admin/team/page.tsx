import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/app-shell";
import { TeamView } from "@/features/admin/team-view";

export const metadata: Metadata = { title: "Platform team" };

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Platform team" />
      <TeamView />
    </>
  );
}
