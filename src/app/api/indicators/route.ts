import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_INDICATORS } from "@/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "50");

  let indicators = [...SAMPLE_INDICATORS];

  if (category && category !== "all") {
    indicators = indicators.filter((i) => i.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    indicators = indicators.filter(
      (i) =>
        i.name.toLowerCase().includes(searchLower) ||
        i.short_name.toLowerCase().includes(searchLower)
    );
  }

  const total = indicators.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = indicators.slice(start, start + perPage);

  return NextResponse.json({
    data: paginated.map((ind) => ({
      ...ind,
      parameters: [
        {
          name: "period",
          label: "Period",
          type: "number",
          default_value: 14,
          min: 1,
          max: 200,
          step: 1,
          description: "The lookback period for calculation",
        },
      ],
      created_at: "2024-01-01T00:00:00Z",
    })),
    total,
    page,
    per_page: perPage,
    total_pages: totalPages,
  });
}
