import { NextResponse, type NextRequest } from "next/server";
import { facetCounts, paramsToQuery, searchTalent } from "@/lib/search";

// GET /api/candidates?q=&discipline=&skills=... — blind inventory search.
// Mirrors the FastAPI search endpoint contract; PII is never returned.
export function GET(req: NextRequest) {
  const query = paramsToQuery(req.nextUrl.searchParams);
  const results = searchTalent(query);
  return NextResponse.json({ total: results.length, results, facets: facetCounts(query) });
}
