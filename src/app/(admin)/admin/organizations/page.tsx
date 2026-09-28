import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/app-shell";
import { OrgList } from "@/features/admin/org-list";

export const metadata: Metadata = { title: "Organizations" };

export default function OrganizationsPage() {
  return (
    <>
      <PageHeader title="Organizations" />
      <Suspense>
        <OrgList />
      </Suspense>
    </>
  );
}
