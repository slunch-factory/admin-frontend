"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchStoreProducts();
      setProducts(list);
      if (list.length > 0 && !selectedId) {
        setSelectedId(list[0].product_id);
        setDraft(list[0]);
        setOriginalId(list[0].product_id);
        setIsCreating(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function selectProduct(id: string) {
    const p = products.find((x) => x.product_id === id);
    if (!p) return;
    setSelectedId(id);
    setDraft(p);
    setOriginalId(p.product_id);
    setIsCreating(false);
    setError(null);
  }

  function addProduct() {
    const newProduct: StoreProduct = {
      ...SEED_STORE_PRODUCT,
      product_id: `새 제품 ${Date.now()}`,
    };
    setDraft(newProduct);
    setSelectedId(newProduct.product_id);
    setOriginalId(null);
    setIsCreating(true);
  }

  async function deleteProduct() {
    if (!selectedId || isCreating) return;
    if (!window.confirm(`'${selectedId}'을(를) 삭제하시겠습니까?`)) return;
    try {
      await deleteStoreProductApi(selectedId);
      setSelectedId(null);
      setDraft(null);
      setOriginalId(null);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 실패");
    }
  }

  async function handleSave(editorName: string) {
    if (!draft) return;
    if (isCreating) {
      const saved = await createStoreProduct(draft, editorName);
      setIsCreating(false);
      setSelectedId(saved.product_id);
      setOriginalId(saved.product_id);
      setDraft(saved);
    } else if (originalId) {
      // product_id might have changed; if so, delete old then create new
      if (originalId !== draft.product_id) {
        await createStoreProduct(draft, editorName);
        await deleteStoreProductApi(originalId);
      } else {
        await updateStoreProduct(originalId, draft, editorName);
      }
      setSelectedId(draft.product_id);
      setOriginalId(draft.product_id);
    }
    await loadProducts();
  }

  // 한 섹션 안에서 이미지와 텍스트를 같이 편집 — 좌측 입력 → 우측 미리보기 즉시 반영
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
                      disabled={!draft}
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
