import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_LEADERBOARD } from "@/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const market = searchParams.get("market");
  const period = searchParams.get("period") || "all_time";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "20");

  let entries = [...SAMPLE_LEADERBOARD];

  if (market && market !== "all") {
    entries = entries.filter((e) => e.market === market);
  }

  const total = entries.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = entries.slice(start, start + perPage);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    per_page: perPage,
    total_pages: totalPages,
    period,
  });
}
