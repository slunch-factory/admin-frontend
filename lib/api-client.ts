import type { StoreProduct, SubscribeProduct } from "@/types/product";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? `요청 실패 (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function fetchStoreProducts() {
  const data = await handle<{ products: StoreProduct[] }>(
    await fetch("/api/v1/admin/store/product", { cache: "no-store" }),
  );
  return data.products;
}

export async function createStoreProduct(product: StoreProduct, editor: string) {
  const data = await handle<{ product: StoreProduct }>(
    await fetch("/api/v1/admin/store/product", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...product, last_edited_by: editor }),
    }),
  );
  return data.product;
}

export async function updateStoreProduct(
  id: string,
  patch: Partial<StoreProduct>,
  editor: string,
) {
  const data = await handle<{ product: StoreProduct }>(
    await fetch(`/api/v1/admin/store/product/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...patch, last_edited_by: editor }),
    }),
  );
  return data.product;
}

export async function deleteStoreProductApi(id: string) {
  return handle<{ ok: true }>(
    await fetch(`/api/v1/admin/store/product/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  );
}

export async function fetchSubscribeProducts() {
  const data = await handle<{ products: SubscribeProduct[] }>(
    await fetch("/api/v1/admin/subscribe/product", { cache: "no-store" }),
  );
  return data.products;
}

export async function createSubscribeProduct(product: SubscribeProduct, editor: string) {
  const data = await handle<{ product: SubscribeProduct }>(
    await fetch("/api/v1/admin/subscribe/product", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...product, last_edited_by: editor }),
    }),
  );
  return data.product;
}

export async function updateSubscribeProduct(
  id: number,
  patch: Partial<SubscribeProduct>,
  editor: string,
) {
  const data = await handle<{ product: SubscribeProduct }>(
    await fetch(`/api/v1/admin/subscribe/product/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...patch, last_edited_by: editor }),
    }),
  );
  return data.product;
}

export async function deleteSubscribeProductApi(id: number) {
  return handle<{ ok: true }>(
    await fetch(`/api/v1/admin/subscribe/product/${id}`, { method: "DELETE" }),
  );
}
