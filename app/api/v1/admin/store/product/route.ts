import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  listStoreProducts,
  upsertStoreProduct,
} from "@/lib/store";
import type { StoreProduct } from "@/types/product";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await listStoreProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | (StoreProduct & { last_edited_by?: string })
    | null;

  if (!body?.product_id) {
    return NextResponse.json({ error: "product_id is required" }, { status: 400 });
  }
  if (!body.last_edited_by) {
    return NextResponse.json({ error: "last_edited_by is required" }, { status: 400 });
  }

  const saved = await upsertStoreProduct({
    ...body,
    last_edited_at: new Date().toISOString(),
  });
  return NextResponse.json({ product: saved });
}
