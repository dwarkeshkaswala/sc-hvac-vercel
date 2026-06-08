import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listFiles, uploadFile, deleteFile } from "@/lib/media";

/** GET /api/media — List files */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const files = await listFiles();
    return NextResponse.json({ files });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** POST /api/media — Upload file(s) */
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  // Validate file size (max 50MB each)
  const MAX_SIZE = 50 * 1024 * 1024;
  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File "${file.name}" exceeds 50MB limit` },
        { status: 400 }
      );
    }
  }

  // Sanitize filenames
  const sanitize = (name: string) =>
    name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");

  try {
    const results = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = sanitize(file.name);
      const result = await uploadFile(buffer, safeName);
      results.push(result);
    }
    return NextResponse.json({ files: results });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** DELETE /api/media — Delete a file */
export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = await req.json();
  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }

  try {
    await deleteFile(path);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
