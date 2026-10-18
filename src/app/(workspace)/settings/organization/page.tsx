import type { Metadata } from "next";
import { OrganizationSettings } from "@/features/settings/organization-settings";

export const metadata: Metadata = { title: "Organization" };

// The settings component owns its header so the section tabs sit directly under the title.
export default function OrganizationPage() {
  return <OrganizationSettings />;
}
