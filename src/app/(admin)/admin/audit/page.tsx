import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/app-shell";
import { AuditLog } from "@/features/admin/audit-log";

export const metadata: Metadata = { title: "Audit log" };

export default function AuditPage() {
  return (
    <>
      <PageHeader title="Audit log" />
      <Suspense>
        <AuditLog />
      </Suspense>
    </>
  );
}
