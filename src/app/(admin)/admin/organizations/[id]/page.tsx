import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/app-shell";
import { OrgDetail } from "@/features/admin/org-detail";

export const metadata: Metadata = { title: "Organization" };

export default async function OrgDetailPage({ params }: PageProps<"/admin/organizations/[id]">) {
  const { id } = await params;
  return (
    <>
      <PageHeader title="Organization" />
      <OrgDetail id={id} />
    </>
  );
}
