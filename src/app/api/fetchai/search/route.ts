import { NextResponse } from "next/server";
import { agentverseSearch } from "@/lib/fetchai";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 5);
  try {
    const items = await agentverseSearch(q, limit);
    return NextResponse.json({ q, items });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Search failed" },
      { status: 500 }
    );
  }
}
