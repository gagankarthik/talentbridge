import type { Metadata } from "next";
import { OrgDetail } from "@/features/admin/org-detail";

export const metadata: Metadata = { title: "Organization" };

export default async function OrgDetailPage({ params }: PageProps<"/admin/organizations/[id]">) {
  const { id } = await params;
  return <OrgDetail id={id} />;
}
