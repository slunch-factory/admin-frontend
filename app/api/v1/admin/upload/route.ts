import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 4 * 1024 * 1024; // 4MB — keeps base64 payload under Vercel's request body cap
const ALLOWED = /^image\/(png|jpe?g|gif|webp|avif|svg\+xml)$/;

/**
 * Image upload endpoint.
 *
 * - Local dev: writes the file to /public/uploads/ and returns a `/uploads/...` URL.
 * - Vercel (read-only FS): falls back to returning a base64 `data:` URL so the
 *   upload still works. The base64 image is embedded into the product JSON;
 *   it lives only as long as in-memory state since /data/*.json writes also
 *   fail on Vercel.
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (!ALLOWED.test(file.type)) {
    return NextResponse.json({ error: "이미지 파일만 업로드할 수 있습니다." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "파일이 너무 큽니다 (4MB 이하)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Read-only filesystem (Vercel, etc.) → base64 fallback
  if (process.env.VERCEL || process.env.READONLY_FS) {
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ url: dataUrl });
  }

  // Local: write to disk and return a public URL
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const ext = (file.name.match(/\.([a-zA-Z0-9]+)$/)?.[1] || "bin").toLowerCase();
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(filepath, buffer);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.warn("[upload] disk write failed, falling back to base64:", err);
    const dataUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    return NextResponse.json({ url: dataUrl });
  }
}
