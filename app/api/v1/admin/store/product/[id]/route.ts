import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteStoreProduct,
  getStoreProduct,
  upsertStoreProduct,
} from "@/lib/store";
import type { StoreProduct } from "@/types/product";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const product = await getStoreProduct(decodeURIComponent(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const existing = await getStoreProduct(decodedId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as
    | (Partial<StoreProduct> & { last_edited_by?: string })
    | null;

  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  if (!body.last_edited_by) {
    return NextResponse.json({ error: "last_edited_by is required" }, { status: 400 });
  }

  const merged: StoreProduct = {
    ...existing,
    ...body,
    product_id: existing.product_id,
    last_edited_at: new Date().toISOString(),
  };

  const saved = await upsertStoreProduct(merged);
  return NextResponse.json({ product: saved });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteStoreProduct(decodeURIComponent(id));
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
