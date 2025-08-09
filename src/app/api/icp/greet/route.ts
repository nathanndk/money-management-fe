import { NextResponse } from "next/server";
import { z } from "zod";
import { createEchoActor, echoDummy } from "@/lib/icp";

const Body = z.object({ name: z.string().min(1) });

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const { name } = parsed.data;
  try {
    const actor = createEchoActor();
    const text = await actor.greet(name);
    return NextResponse.json({ source: "icp", text });
  } catch (e) {
    const text = await echoDummy.greet(name);
    return NextResponse.json({ source: "dummy", text });
  }
}
