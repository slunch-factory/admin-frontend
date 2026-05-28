"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { EditorNameModal } from "@/components/EditorNameModal";
import { ProductSidebar } from "@/components/ProductSidebar";
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
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

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
      setSavedSnapshot(JSON.stringify(first));
    }
  }, [products, selectedId]);

  const isDirty = useMemo(() => {
    if (!draft) return false;
    if (isCreating) return true;
    return savedSnapshot !== JSON.stringify(draft);
  }, [draft, isCreating, savedSnapshot]);

  function selectProduct(id: number) {
    if (isCreating && draft) {
      setProducts((prev) => prev.filter((p) => p.id !== draft.id));
    }
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setSelectedId(id);
    setDraft(p);
    setOriginalId(id);
    setIsCreating(false);
    setSavedSnapshot(JSON.stringify(p));
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
    setProducts((prev) => [newProduct, ...prev]);
    setDraft(newProduct);
    setSelectedId(nextId);
    setOriginalId(null);
    setIsCreating(true);
    setSavedSnapshot(null);
  }

  async function deleteProduct() {
    if (selectedId == null || isCreating) return;
    if (!window.confirm(`#${selectedId} 메뉴를 삭제하시겠습니까?`)) return;
    try {
      await deleteSubscribeProductApi(selectedId);
      setProducts((prev) => prev.filter((p) => p.id !== selectedId));
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
      let saved: SubscribeProduct;
      if (isCreating) {
        saved = await createSubscribeProduct(draft, editorName);
        setProducts((prev) => [
          saved,
          ...prev.filter((p) => p.id !== draft.id),
        ]);
        setIsCreating(false);
      } else if (originalId != null) {
        if (originalId !== draft.id) {
          saved = await createSubscribeProduct(draft, editorName);
          await deleteSubscribeProductApi(originalId);
          setProducts((prev) => [
            saved,
            ...prev.filter((p) => p.id !== originalId),
          ]);
        } else {
          saved = await updateSubscribeProduct(originalId, draft, editorName);
          setProducts((prev) =>
            prev.map((p) => (p.id === originalId ? saved : p)),
          );
        }
      } else {
        return;
      }
      setSelectedId(saved.id);
      setOriginalId(saved.id);
      setDraft(saved);
      setSavedSnapshot(JSON.stringify(saved));
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
      throw err;
    }
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
          <div className="content split-fixed">
            <div
              className="pane-edit"
              style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
            >
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
                  disabled={!draft || !isDirty}
                  title={!isDirty ? "변경사항이 없습니다" : undefined}
                >
                  저장
                </button>
              </div>
            </div>
            <div
              className="pane-right"
              style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
            >
              <div className="pane-right-tabs">
                <button className="pane-tab-btn active" type="button">
                  미리보기
                </button>
                <div className="viewport-toggle">
                  <button
                    type="button"
                    className={`viewport-btn ${viewport === "desktop" ? "active" : ""}`}
                    onClick={() => setViewport("desktop")}
                    aria-pressed={viewport === "desktop"}
                  >
                    💻 데스크톱
                  </button>
                  <button
                    type="button"
                    className={`viewport-btn ${viewport === "mobile" ? "active" : ""}`}
                    onClick={() => setViewport("mobile")}
                    aria-pressed={viewport === "mobile"}
                  >
                    📱 모바일
                  </button>
                </div>
              </div>
              <div className={`preview-frame preview-${viewport}`}>
                <div className="preview-content">
                  {draft && <SubscribePreview product={draft} />}
                </div>
              </div>
            </div>
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
