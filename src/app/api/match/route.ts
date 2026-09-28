import { NextResponse, type NextRequest } from "next/server";
import { matchSpec } from "@/lib/match";

// POST /api/match { spec: string } — job spec to ranked blind shortlist.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const spec = typeof body?.spec === "string" ? body.spec.slice(0, 20_000) : "";
  if (spec.trim().length < 20) {
    return NextResponse.json({ error: "Paste at least a few lines of the role requirements so we can match on skills." }, { status: 422 });
  }
  return NextResponse.json(matchSpec(spec));
}
