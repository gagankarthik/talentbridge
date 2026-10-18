import type { Metadata } from "next";
import { TeamView } from "@/features/admin/team-view";

export const metadata: Metadata = { title: "Platform team" };

export default function TeamPage() {
  return <TeamView />;
}
