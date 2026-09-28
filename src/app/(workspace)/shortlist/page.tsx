import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/app-shell";
import { ShortlistView } from "@/features/shortlist/shortlist-view";

export const metadata: Metadata = { title: "Shortlist" };

export default function ShortlistPage() {
  return (
    <>
      <PageHeader
        title="Shortlist"
      />
      <ShortlistView />
    </>
  );
}
