"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorNameModal } from "@/components/EditorNameModal";
import { ProductSidebar } from "@/components/ProductSidebar";
import { SplitPane } from "@/components/SplitPane";
import { StorePreview } from "@/components/StorePreview";
import { StoreProductForm } from "@/components/StoreProductForm";
import {
  createStoreProduct,
  deleteStoreProductApi,
  fetchStoreProducts,
  updateStoreProduct,
} from "@/lib/api-client";
import { STORE_SECTIONS } from "@/lib/store-field-config";
import { SEED_STORE_PRODUCT } from "@/lib/seed";
import type { StoreProduct } from "@/types/product";

export default function StorePage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StoreProduct | null>(null);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // loadProducts must be stable — depending on selectedId caused an
  // infinite refetch loop. Auto-select is a separate effect below.
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchStoreProducts();
      setProducts(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (selectedId == null && products.length > 0) {
      const first = products[0];
      setSelectedId(first.product_id);
      setDraft(first);
      setOriginalId(first.product_id);
      setIsCreating(false);
      setSavedSnapshot(JSON.stringify(first));
    }
  }, [products, selectedId]);

  // dirty = the current draft differs from the last server-saved snapshot.
  // Saving a brand-new (unsaved) product is always allowed.
  const isDirty = useMemo(() => {
    if (!draft) return false;
    if (isCreating) return true;
    return savedSnapshot !== JSON.stringify(draft);
  }, [draft, isCreating, savedSnapshot]);

  function selectProduct(id: string) {
    // If user navigates away from an unsaved new product, drop the temp row.
    if (isCreating && draft) {
      setProducts((prev) => prev.filter((p) => p.product_id !== draft.product_id));
    }
    const p = products.find((x) => x.product_id === id);
    if (!p) return;
    setSelectedId(id);
    setDraft(p);
    setOriginalId(p.product_id);
    setIsCreating(false);
    setSavedSnapshot(JSON.stringify(p));
    setError(null);
  }

  function addProduct() {
    const tempId = `새 제품 ${Date.now()}`;
    const newProduct: StoreProduct = {
      ...SEED_STORE_PRODUCT,
      product_id: tempId,
    };
    // Prepend to the sidebar so the new item shows at the very top.
    setProducts((prev) => [newProduct, ...prev]);
    setDraft(newProduct);
    setSelectedId(tempId);
    setOriginalId(null);
    setIsCreating(true);
    setSavedSnapshot(null);
  }

  async function deleteProduct() {
    if (!selectedId || isCreating) return;
    if (!window.confirm(`'${selectedId}'을(를) 삭제하시겠습니까?`)) return;
    try {
      await deleteStoreProductApi(selectedId);
      // Local update — on Vercel the server can't actually delete from disk,
      // but the UI should still reflect the change.
      setProducts((prev) => prev.filter((p) => p.product_id !== selectedId));
      setSelectedId(null);
      setDraft(null);
      setOriginalId(null);
      setSavedSnapshot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 실패");
    }
  }

  async function handleSave(editorName: string) {
    if (!draft) return;
    try {
      let saved: StoreProduct;
      if (isCreating) {
        saved = await createStoreProduct(draft, editorName);
        // Replace the temp row with the saved row, at the top of the list.
        setProducts((prev) => [
          saved,
          ...prev.filter((p) => p.product_id !== draft.product_id),
        ]);
        setIsCreating(false);
      } else if (originalId) {
        if (originalId !== draft.product_id) {
          saved = await createStoreProduct(draft, editorName);
          await deleteStoreProductApi(originalId);
          setProducts((prev) => [
            saved,
            ...prev.filter((p) => p.product_id !== originalId),
          ]);
        } else {
          saved = await updateStoreProduct(originalId, draft, editorName);
          setProducts((prev) =>
            prev.map((p) => (p.product_id === originalId ? saved : p)),
          );
        }
      } else {
        return;
      }
      setSelectedId(saved.product_id);
      setOriginalId(saved.product_id);
      setDraft(saved);
      setSavedSnapshot(JSON.stringify(saved));
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
      throw err;
    }
  }

  const sections = STORE_SECTIONS;

  return (
    <div className="tab-panel tab-copy active">
      <div className="container">
        <ProductSidebar
          title="슬런치 스토어"
          items={products.map((p) => ({
            id: p.product_id,
            label: p.product_id,
          }))}
          selectedId={selectedId}
          onSelect={selectProduct}
          onAdd={addProduct}
          onDelete={deleteProduct}
        />

        <div className="main">
          <div className="toolbar">
            {draft?.last_edited_by && draft?.last_edited_at ? (
              <span style={{ color: "var(--text-secondary)" }}>
                최근 수정자: <b>{draft.last_edited_by}</b> ·{" "}
                {new Date(draft.last_edited_at).toLocaleString("ko-KR")}
              </span>
            ) : (
              <span style={{ color: "var(--text-dim)" }}>수정 이력 없음</span>
            )}
          </div>

          <div className="content">
            <SplitPane
              initialLeftPercent={50}
              left={
                <div className="pane-edit resizable" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                  <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                    {loading && <div style={{ padding: 20 }}>불러오는 중...</div>}
                    {error && (
                      <div style={{ color: "var(--danger)", padding: 12, marginBottom: 12 }}>
                        {error}
                      </div>
                    )}
                    {!loading && !draft && products.length === 0 && (
                      <div style={{ padding: 40, color: "var(--text-secondary)" }}>
                        등록된 제품이 없습니다. 좌측 &lsquo;추가&rsquo; 버튼으로 첫 제품을 만들어 주세요.
                      </div>
                    )}
                    {draft && (
                      <StoreProductForm
                        product={draft}
                        sections={sections}
                        onChange={setDraft}
                      />
                    )}
                  </div>
                  <div className="pane-edit-footer">
                    <button
                      type="button"
                      className="btn-save"
                      onClick={() => setModalOpen(true)}
                      disabled={!draft || !isDirty}
                      title={!isDirty ? "변경사항이 없습니다" : undefined}
                    >
                      저장
                    </button>
                  </div>
                </div>
              }
              right={
                <div className="pane-right resizable" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                  <div className="pane-right-tabs">
                    <button className="pane-tab-btn active" type="button">
                      미리보기
                    </button>
                  </div>
                  <div className="pane-tab-content active" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                    {draft && <StorePreview product={draft} />}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <EditorNameModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSave}
        title={isCreating ? "새 제품 저장" : "변경사항 저장"}
      />
    </div>
  );
}
