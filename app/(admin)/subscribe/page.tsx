"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorNameModal } from "@/components/EditorNameModal";
import { ProductSidebar } from "@/components/ProductSidebar";
import { SplitPane } from "@/components/SplitPane";
import { SubscribePreview } from "@/components/SubscribePreview";
import { SubscribeProductForm } from "@/components/SubscribeProductForm";
import {
  createSubscribeProduct,
  deleteSubscribeProductApi,
  fetchSubscribeProducts,
  updateSubscribeProduct,
} from "@/lib/api-client";
import { SEED_SUBSCRIBE_PRODUCT } from "@/lib/seed";
import type { SubscribeProduct } from "@/types/product";

export default function SubscribePage() {
  const [products, setProducts] = useState<SubscribeProduct[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<SubscribeProduct | null>(null);
  const [originalId, setOriginalId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Stable — see comment in store/page.tsx (avoids infinite refetch loop)
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchSubscribeProducts();
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
      setSelectedId(first.id);
      setDraft(first);
      setOriginalId(first.id);
      setIsCreating(false);
    }
  }, [products, selectedId]);

  function selectProduct(id: number) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setSelectedId(id);
    setDraft(p);
    setOriginalId(id);
    setIsCreating(false);
    setError(null);
  }

  function addProduct() {
    const nextId =
      products.length === 0 ? 1 : Math.max(...products.map((p) => p.id)) + 1;
    const newProduct: SubscribeProduct = {
      ...SEED_SUBSCRIBE_PRODUCT,
      id: nextId,
      code: `NEW${nextId}`,
      name: "새 구독 메뉴",
    };
    setDraft(newProduct);
    setSelectedId(nextId);
    setOriginalId(null);
    setIsCreating(true);
  }

  async function deleteProduct() {
    if (selectedId == null || isCreating) return;
    if (!window.confirm(`#${selectedId} 메뉴를 삭제하시겠습니까?`)) return;
    try {
      await deleteSubscribeProductApi(selectedId);
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
      const saved = await createSubscribeProduct(draft, editorName);
      setIsCreating(false);
      setSelectedId(saved.id);
      setOriginalId(saved.id);
      setDraft(saved);
    } else if (originalId != null) {
      if (originalId !== draft.id) {
        await createSubscribeProduct(draft, editorName);
        await deleteSubscribeProductApi(originalId);
      } else {
        await updateSubscribeProduct(originalId, draft, editorName);
      }
      setSelectedId(draft.id);
      setOriginalId(draft.id);
    }
    await loadProducts();
  }

  return (
    <div className="tab-panel tab-subscribe active">
      <div className="container">
        <ProductSidebar
          title="구독 상세"
          items={products.map((p) => ({
            id: String(p.id),
            label: `${p.code} · ${p.name}`,
          }))}
          selectedId={selectedId == null ? null : String(selectedId)}
          onSelect={(id) => selectProduct(Number(id))}
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
                    {!loading && !draft && (
                      <div style={{ padding: 40, color: "var(--text-secondary)" }}>
                        등록된 구독 메뉴가 없습니다. 좌측 &lsquo;추가&rsquo; 버튼으로 시작하세요.
                      </div>
                    )}
                    {draft && <SubscribeProductForm product={draft} onChange={setDraft} />}
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
                    {draft && <SubscribePreview product={draft} />}
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
        title={isCreating ? "새 메뉴 저장" : "변경사항 저장"}
      />
    </div>
  );
}
