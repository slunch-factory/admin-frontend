"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorNameModal } from "@/components/EditorNameModal";
import { ProductSidebar } from "@/components/ProductSidebar";
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
import {
  DESIGN_MD,
  downloadFile,
  renderCafe24,
  renderJSON,
} from "@/lib/preview-export";
import type { StoreProduct } from "@/types/product";

type PaneTab = "preview" | "cafe24" | "json" | "design";

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
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [paneTab, setPaneTab] = useState<PaneTab>("preview");
  const [copiedTab, setCopiedTab] = useState<PaneTab | null>(null);

  const editScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);

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

  // Focus pulse — 포커스된 input의 조상에서 [data-field-id] (개별 필드) 또는
  // [data-section-id] (섹션 전체)를 찾아 미리보기 대응 요소에 클래스 토글.
  useEffect(() => {
    const editEl = editScrollRef.current;
    if (!editEl) return;
    let blurTimer: ReturnType<typeof setTimeout> | null = null;
    let active: HTMLElement | null = null;

    function setActive(selector: string | null) {
      const root = previewScrollRef.current;
      if (active) {
        active.classList.remove("preview-focus-pulse");
        active = null;
      }
      if (!root || !selector) return;
      const el = root.querySelector<HTMLElement>(selector);
      if (el) {
        el.classList.add("preview-focus-pulse");
        active = el;
      }
    }

    function handleFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement | null;
      if (!target || !target.matches("input, textarea, select")) return;
      const fieldEl = target.closest<HTMLElement>("[data-field-id]");
      const sectionEl = target.closest<HTMLElement>("[data-section-id]");
      const selector = fieldEl?.dataset.fieldId
        ? `[data-field-id="${fieldEl.dataset.fieldId}"]`
        : sectionEl?.dataset.sectionId
          ? `[data-section-id="${sectionEl.dataset.sectionId}"]`
          : null;
      if (blurTimer) {
        clearTimeout(blurTimer);
        blurTimer = null;
      }
      setActive(selector);
    }
    function handleFocusOut() {
      if (blurTimer) clearTimeout(blurTimer);
      blurTimer = setTimeout(() => setActive(null), 300);
    }

    editEl.addEventListener("focusin", handleFocusIn);
    editEl.addEventListener("focusout", handleFocusOut);
    return () => {
      editEl.removeEventListener("focusin", handleFocusIn);
      editEl.removeEventListener("focusout", handleFocusOut);
      if (blurTimer) clearTimeout(blurTimer);
      setActive(null);
    };
  }, []);

  const isDirty = useMemo(() => {
    if (!draft) return false;
    if (isCreating) return true;
    return savedSnapshot !== JSON.stringify(draft);
  }, [draft, isCreating, savedSnapshot]);

  // Cmd/Ctrl+S 단축키 — 저장 모달 열기
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        if (draft && isDirty && !modalOpen) {
          setModalOpen(true);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [draft, isDirty, modalOpen]);

  function selectProduct(id: string) {
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
    // Reset both panes to top when switching products
    editScrollRef.current?.scrollTo({ top: 0 });
    previewScrollRef.current?.scrollTo({ top: 0 });
  }

  function addProduct() {
    const tempId = `새 제품 ${Date.now()}`;
    const newProduct: StoreProduct = {
      ...SEED_STORE_PRODUCT,
      product_id: tempId,
    };
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

  /**
   * Sync preview scroll to the edit pane, proportionally within each section.
   *
   * Edit and preview sections are tagged with matching `data-section-id`.
   * For each scroll event we compute how far through the current edit section
   * we are (0–1), then map that to the same proportional offset within the
   * matching preview section. This gives continuous scrolling that aligns
   * at section boundaries — no jumpy snapping.
   */
  function handleEditScroll() {
    if (syncingRef.current) return;
    const editEl = editScrollRef.current;
    const previewEl = previewScrollRef.current;
    if (!editEl || !previewEl) return;

    const editSections = Array.from(
      editEl.querySelectorAll<HTMLElement>("[data-section-id]"),
    );
    if (editSections.length === 0) return;

    const editScrollY = editEl.scrollTop;

    // Find current edit section (last one whose top is at or above scrollY)
    let idx = 0;
    for (let i = 0; i < editSections.length; i++) {
      if (editSections[i].offsetTop <= editScrollY) idx = i;
      else break;
    }

    const currentEdit = editSections[idx];
    const nextEdit = editSections[idx + 1];
    const currentId = currentEdit.dataset.sectionId;
    if (!currentId) return;

    const currentPreview = previewEl.querySelector<HTMLElement>(
      `[data-section-id="${currentId}"]`,
    );
    if (!currentPreview) return;

    const nextId = nextEdit?.dataset.sectionId;
    const nextPreview = nextId
      ? previewEl.querySelector<HTMLElement>(`[data-section-id="${nextId}"]`)
      : null;

    // How far through the current section (0..1)
    const editStart = currentEdit.offsetTop;
    const editEnd = nextEdit ? nextEdit.offsetTop : editEl.scrollHeight;
    const editSpan = Math.max(1, editEnd - editStart);
    const progress = Math.max(0, Math.min(1, (editScrollY - editStart) / editSpan));

    // Map to preview
    const prevStart = currentPreview.offsetTop;
    const prevEnd = nextPreview ? nextPreview.offsetTop : previewEl.scrollHeight;
    const prevSpan = Math.max(1, prevEnd - prevStart);
    const target = prevStart + progress * prevSpan;

    syncingRef.current = true;
    previewEl.scrollTop = target;
    window.requestAnimationFrame(() => {
      syncingRef.current = false;
    });
  }

  const sections = STORE_SECTIONS;

  const cafe24Html = useMemo(() => (draft ? renderCafe24(draft) : ""), [draft]);
  const jsonText = useMemo(() => (draft ? renderJSON(draft) : ""), [draft]);

  async function copyTab(tab: PaneTab) {
    const text =
      tab === "cafe24" ? cafe24Html : tab === "json" ? jsonText : tab === "design" ? DESIGN_MD : "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      window.setTimeout(() => setCopiedTab(null), 1500);
    } catch (e) {
      console.error("clipboard write failed", e);
    }
  }

  function handleExportHtml() {
    if (!draft) return;
    const filename = `${(draft.product_id || "product").replace(/[\\/:*?"<>|]/g, "_")}.html`;
    downloadFile(filename, cafe24Html, "text/html;charset=utf-8");
  }

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
            <div style={{ flex: 1 }} />
            <button
              type="button"
              className="btn-export-html"
              onClick={handleExportHtml}
              disabled={!draft}
              title={!draft ? "제품을 먼저 선택하세요" : "현재 제품의 카페24 HTML 다운로드"}
            >
              HTML 내보내기
            </button>
          </div>

          <div className="content split-fixed">
            <div
              className="pane-edit"
              style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
            >
              <div
                ref={editScrollRef}
                onScroll={handleEditScroll}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 20,
                  position: "relative", // anchor for descendants' offsetTop
                }}
              >
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
                  <StoreProductForm product={draft} sections={sections} onChange={setDraft} />
                )}
              </div>
              <div className="pane-edit-footer">
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => setModalOpen(true)}
                  disabled={!draft || !isDirty}
                  title={!isDirty ? "변경사항이 없습니다" : "저장 (⌘S / Ctrl+S)"}
                >
                  저장{isDirty && <span style={{ marginLeft: 6, opacity: 0.85 }}>•</span>}
                </button>
              </div>
            </div>

            <div
              className="pane-right"
              style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
            >
              <div className="pane-right-tabs">
                <button
                  type="button"
                  className={`pane-tab-btn ${paneTab === "preview" ? "active" : ""}`}
                  onClick={() => setPaneTab("preview")}
                >
                  미리보기
                </button>
                <button
                  type="button"
                  className={`pane-tab-btn ${paneTab === "cafe24" ? "active" : ""}`}
                  onClick={() => setPaneTab("cafe24")}
                >
                  카페24 HTML
                </button>
                <button
                  type="button"
                  className={`pane-tab-btn ${paneTab === "json" ? "active" : ""}`}
                  onClick={() => setPaneTab("json")}
                >
                  JSON
                </button>
                <button
                  type="button"
                  className={`pane-tab-btn ${paneTab === "design" ? "active" : ""}`}
                  onClick={() => setPaneTab("design")}
                >
                  DESIGN.md
                </button>
                {paneTab === "preview" && (
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
                )}
              </div>

              {paneTab === "preview" && (
                <div
                  ref={previewScrollRef}
                  className={`preview-frame preview-${viewport}`}
                >
                  <div className="preview-content">
                    {draft && <StorePreview product={draft} />}
                  </div>
                </div>
              )}

              {paneTab === "cafe24" && (
                <CodePane
                  content={cafe24Html}
                  copied={copiedTab === "cafe24"}
                  onCopy={() => copyTab("cafe24")}
                  emptyText="제품을 선택하세요"
                />
              )}

              {paneTab === "json" && (
                <CodePane
                  content={jsonText}
                  copied={copiedTab === "json"}
                  onCopy={() => copyTab("json")}
                  emptyText="제품을 선택하세요"
                />
              )}

              {paneTab === "design" && (
                <CodePane
                  content={DESIGN_MD}
                  copied={copiedTab === "design"}
                  onCopy={() => copyTab("design")}
                />
              )}
            </div>
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

function CodePane({
  content,
  copied,
  onCopy,
  emptyText,
}: {
  content: string;
  copied: boolean;
  onCopy: () => void;
  emptyText?: string;
}) {
  if (!content) {
    return (
      <div
        className="pane-tab-content active"
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}
      >
        {emptyText || "내용이 없습니다."}
      </div>
    );
  }
  return (
    <div
      className="pane-tab-content active"
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: 0 }}
    >
      <div className="code-container" style={{ flex: 1, overflow: "auto", position: "relative" }}>
        <button
          type="button"
          className={`code-copy-btn ${copied ? "copied" : ""}`}
          onClick={onCopy}
        >
          {copied ? "복사됨" : "복사"}
        </button>
        <pre style={{ margin: 0, padding: 16, whiteSpace: "pre-wrap", wordBreak: "break-all", fontSize: 12, lineHeight: 1.5 }}>
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}
