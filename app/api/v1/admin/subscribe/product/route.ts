import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { listSubscribeProducts, upsertSubscribeProduct } from "@/lib/store";
import type { SubscribeProduct } from "@/types/product";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await listSubscribeProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | (SubscribeProduct & { last_edited_by?: string })
    | null;

  if (!body?.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (!body.last_edited_by) {
    return NextResponse.json({ error: "last_edited_by is required" }, { status: 400 });
  }

  const saved = await upsertSubscribeProduct({
    ...body,
    last_edited_at: new Date().toISOString(),
  });
  return NextResponse.json({ product: saved });
}
