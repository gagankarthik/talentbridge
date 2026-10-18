import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/app-shell";
import { ProfileSettings } from "@/features/settings/profile-settings";

export const metadata: Metadata = { title: "Profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profile"
        breadcrumb={[{ label: "Account" }, { label: "Profile" }]} description="Your details, notifications and sign-in security." />
      <ProfileSettings />
    </>
  );
}
