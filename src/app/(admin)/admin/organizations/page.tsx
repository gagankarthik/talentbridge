import type { Metadata } from "next";
import { Suspense } from "react";
import { OrgList } from "@/features/admin/org-list";

export const metadata: Metadata = { title: "Organizations" };

export default function OrganizationsPage() {
  return (
    <Suspense>
      <OrgList />
    </Suspense>
  );
}
