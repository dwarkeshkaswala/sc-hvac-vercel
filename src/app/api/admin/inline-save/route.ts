import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { saveContent, getContent } from "@/lib/content";

/**
 * Inline save endpoint — allows admin to save partial field updates
 * from the public site in edit mode.
 */
export async function POST(req: NextRequest) {
  // Verify admin session
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { key, data } = body;

  if (!key || !data || typeof key !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate allowed keys
  const allowedKeys = [
    "site:hero",
    "site:services",
    "site:testimonials",
    "site:trust",
    "site:contact",
    "site:dealers",
    "site:navbar",
    "site:branding",
    "site:portfolio",
    "site:products",
  ];

  if (!allowedKeys.includes(key)) {
    return NextResponse.json({ error: "Invalid content key" }, { status: 400 });
  }

  try {
    // Merge partial update into existing content
    const existing = await getContent(key);
    let updated: unknown;

    if (existing && typeof existing === "object" && typeof data === "object" && !Array.isArray(data)) {
      // Merge fields into existing object
      updated = { ...existing, ...data };
    } else {
      // Replace entirely (for arrays like services/testimonials)
      updated = data;
    }

    await saveContent(key, updated);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inline-save] Error:", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
