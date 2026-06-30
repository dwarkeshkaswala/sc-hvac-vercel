import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { redis } from "@/lib/redis";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete stale Redis keys so defaults take over
  await redis.del("site:navbar");
  await redis.del("site:products");

  return NextResponse.json({ ok: true, message: "Navbar and products reset to defaults. Refresh the page." });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  if (key !== process.env.RESET_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await redis.del("site:navbar");
  await redis.del("site:products");

  return NextResponse.json({ ok: true, message: "Reset complete." });
}
