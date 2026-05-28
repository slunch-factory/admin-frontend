import { promises as fs } from "fs";
import path from "path";
import type { StoreProduct, SubscribeProduct } from "@/types/product";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "store-products.json");
const SUBSCRIBE_FILE = path.join(DATA_DIR, "subscribe-products.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T) {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf-8");
}

export async function listStoreProducts(): Promise<StoreProduct[]> {
  return readJson<StoreProduct[]>(STORE_FILE, []);
}

export async function getStoreProduct(id: string): Promise<StoreProduct | null> {
  const list = await listStoreProducts();
  return list.find((p) => p.product_id === id) ?? null;
}

export async function upsertStoreProduct(product: StoreProduct): Promise<StoreProduct> {
  const list = await listStoreProducts();
  const idx = list.findIndex((p) => p.product_id === product.product_id);
  if (idx >= 0) list[idx] = product;
  else list.push(product);
  await writeJson(STORE_FILE, list);
  return product;
}

export async function deleteStoreProduct(id: string): Promise<boolean> {
  const list = await listStoreProducts();
  const next = list.filter((p) => p.product_id !== id);
  if (next.length === list.length) return false;
  await writeJson(STORE_FILE, next);
  return true;
}

export async function listSubscribeProducts(): Promise<SubscribeProduct[]> {
  return readJson<SubscribeProduct[]>(SUBSCRIBE_FILE, []);
}

export async function getSubscribeProduct(id: number): Promise<SubscribeProduct | null> {
  const list = await listSubscribeProducts();
  return list.find((p) => p.id === id) ?? null;
}

export async function upsertSubscribeProduct(product: SubscribeProduct): Promise<SubscribeProduct> {
  const list = await listSubscribeProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx >= 0) list[idx] = product;
  else list.push(product);
  await writeJson(SUBSCRIBE_FILE, list);
  return product;
}

export async function deleteSubscribeProduct(id: number): Promise<boolean> {
  const list = await listSubscribeProducts();
  const next = list.filter((p) => p.id !== id);
  if (next.length === list.length) return false;
  await writeJson(SUBSCRIBE_FILE, next);
  return true;
}
