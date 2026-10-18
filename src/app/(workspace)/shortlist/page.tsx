import type { Metadata } from "next";
import { ShortlistView } from "@/features/shortlist/shortlist-view";

export const metadata: Metadata = { title: "Shortlist" };

// The view owns its header: the saved count comes from the browser-side workspace store.
export default function ShortlistPage() {
  return <ShortlistView />;
}
