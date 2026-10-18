import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/app-shell";
import { HelpCenter } from "@/features/settings/help-center";

export const metadata: Metadata = { title: "Help and support" };

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Help and support"
        breadcrumb={[{ label: "Workspace", href: "/dashboard" }, { label: "Help and support" }]} description="Answers to common questions, and a direct line to the TalentBridge client team." />
      <HelpCenter />
    </>
  );
}
