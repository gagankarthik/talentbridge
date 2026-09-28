import { NextResponse } from "next/server";
import { benchSnapshot } from "@/lib/bench";

// GET /api/bench — live bench counter by discipline.
export function GET() {
  return NextResponse.json(benchSnapshot());
}
