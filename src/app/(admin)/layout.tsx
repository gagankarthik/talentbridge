import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import type { PaletteGroup } from "@/components/layout/command-palette";
import { candidates } from "@/lib/data";
import { complianceIssues } from "@/lib/compliance";
import { CURRENT_STAFF, ORGS } from "@/lib/platform";
import { AdminProvider } from "@/features/admin/admin-store";
import { SupportBanner } from "@/features/admin/support-banner";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Command-palette index for staff: full candidate records and every organization.
const palette: PaletteGroup[] = [
  {
    heading: "Candidates",
    entries: candidates.map((c) => ({
      id: c.code,
      code: c.code,
      label: `${c.firstName} ${c.lastName}`,
      meta: c.title,
      href: `/admin/candidates/${c.code}`,
      keywords: [c.title, c.discipline, ...c.skills.map((s) => s.skill)],
    })),
  },
  {
    heading: "Organizations",
    entries: ORGS.map((o) => ({ id: o.id, label: o.name, meta: `${o.type} · ${o.plan}`, href: `/admin/organizations/${o.id}`, keywords: [o.domain] })),
  },
];

// TalentBridge's internal platform console. Staff only.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const flags = candidates.reduce((n, c) => n + complianceIssues(c).filter((i) => i.severity === "flag").length, 0);
  return (
    <AdminProvider>
      <AppShell
        variant="platform"
        palette={palette}
        complianceFlags={flags}
        banner={<SupportBanner />}
        user={{ name: CURRENT_STAFF.name, company: "TalentBridge platform", email: CURRENT_STAFF.email }}
      >
        {children}
      </AppShell>
    </AdminProvider>
  );
}
