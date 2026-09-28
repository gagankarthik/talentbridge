import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { candidates } from "@/lib/data";
import { complianceIssues } from "@/lib/compliance";
import { CURRENT_STAFF } from "@/lib/platform";
import { AdminProvider } from "@/features/admin/admin-store";
import { SupportBanner } from "@/features/admin/support-banner";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// TalentBridge's internal platform console. Staff only.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const flags = candidates.reduce((n, c) => n + complianceIssues(c).filter((i) => i.severity === "flag").length, 0);
  return (
    <AdminProvider>
      <AppShell variant="platform" complianceFlags={flags} banner={<SupportBanner />} user={{ name: CURRENT_STAFF.name, company: "TalentBridge platform", email: CURRENT_STAFF.email }}>
        {children}
      </AppShell>
    </AdminProvider>
  );
}
