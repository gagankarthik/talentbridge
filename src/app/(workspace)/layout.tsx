import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { currentRecruiter } from "@/lib/data";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// A customer organization's workspace. Internal operations live in the platform console.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <AppShell user={{ name: currentRecruiter.contactName, company: currentRecruiter.companyName, email: currentRecruiter.workEmail }}>{children}</AppShell>;
}
