import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_BLOG_POSTS } from "@/constants";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");

  if (slug) {
    const post = SAMPLE_BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) {
      return NextResponse.json(
        { data: null, error: "Post not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: post, error: null });
  }

  let posts = [...SAMPLE_BLOG_POSTS];

  if (category && category !== "all") {
    posts = posts.filter((p) => p.category === category);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.excerpt.toLowerCase().includes(searchLower)
    );
  }

  const total = posts.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = posts.slice(start, start + perPage);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    per_page: perPage,
    total_pages: totalPages,
  });
}
