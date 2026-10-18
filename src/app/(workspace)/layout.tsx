import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import type { PaletteGroup } from "@/components/layout/command-palette";
import { currentRecruiter, presentable } from "@/lib/data";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Command-palette index of the blind inventory: codes, titles and skills only, never names.
const palette: PaletteGroup[] = [
  {
    heading: "Candidates",
    entries: presentable.map((c) => ({
      id: c.code,
      code: c.code,
      label: c.title,
      meta: `${c.yearsExperience} yrs · ${c.discipline}`,
      href: `/talent?q=${encodeURIComponent(c.code)}`,
      keywords: c.skills.map((s) => s.skill),
    })),
  },
];

// A customer organization's workspace. Internal operations live in the platform console.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell palette={palette} user={{ name: currentRecruiter.contactName, company: currentRecruiter.companyName, email: currentRecruiter.workEmail }}>
      {children}
    </AppShell>
  );
}
