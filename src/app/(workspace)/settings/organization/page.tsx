import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/app-shell";
import { OrganizationSettings } from "@/features/settings/organization-settings";

export const metadata: Metadata = { title: "Organization" };

export default function OrganizationPage() {
  return (
    <>
      <PageHeader title="Organization" />
      <OrganizationSettings />
    </>
  );
}
