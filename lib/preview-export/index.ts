export { renderCafe24 } from "./cafe24";
export { DESIGN_MD } from "./design-md";
export { renderSubscribeCafe24, renderSubscribeJSON } from "./subscribe-cafe24";

import type { StoreProduct } from "@/types/product";

export function renderJSON(product: StoreProduct): string {
  return JSON.stringify(product, null, 2);
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
