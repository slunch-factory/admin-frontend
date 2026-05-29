"use client";

import { useRef, useState } from "react";
import type { FieldDef, SectionDef } from "@/lib/store-field-config";
import type { StoreProduct } from "@/types/product";
import { uploadImage } from "@/lib/upload";

type Props = {
  product: StoreProduct;
  sections: SectionDef[];
  onChange: (next: StoreProduct) => void;
};

export function StoreProductForm({ product, sections, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s, i) => [s.id, i === 0])),
  );

  function toggle(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function update<K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) {
    onChange({ ...product, [key]: value });
  }

  return (
    <div className="store-form">
      <div className="form-field">
        <div className="form-label-row">
          <span className="form-label-en">PRODUCT NAME</span>
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            메뉴명 / 사이드바 표시명
          </span>
        </div>
        <input
          type="text"
          value={product.product_id}
          onChange={(e) => update("product_id", e.target.value)}
          className="form-input"
        />
      </div>

      {sections.map((section) => {
        const isOpen = openSections[section.id];
        return (
          <div
            key={section.id}
            className={`form-section ${isOpen ? "open" : ""}`}
            data-section-id={section.id}
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="form-section-header"
            >
              <span>{section.title}</span>
              <span className="form-section-caret">{isOpen ? "▾" : "▸"}</span>
            </button>
            {isOpen && (
              <div className="form-section-body">
                {section.fields
                  .filter((field) => {
                    // 강점 섹션: 항목 카드(이미지/타이틀/설명) + 원(circle) 필드들은
                    // 전용 에디터로 따로 렌더하므로 일반 loop에서 제외
                    if (section.id === "strength") {
                      const k = field.key as string;
                      if (/^strength\d_(image|title|desc)$/.test(k)) return false;
                      if (/^strength_circle\d_(main|sub)$/.test(k)) return false;
                    }
                    return true;
                  })
                  .map((field) => {
                    const k = field.key as string;
                    // strength_summary_title 옆에 자동 추천 표기
                    const isSummary = section.id === "strength" && k === "strength_summary_title";
                    return (
                      <div key={k}>
                        <FieldRow
                          field={field}
                          value={(product[field.key] ?? "") as string}
                          onChange={(v) =>
                            update(field.key, v as StoreProduct[typeof field.key])
                          }
                        />
                        {isSummary && (
                          <StrengthSummaryHint
                            product={product}
                            onApply={(v) =>
                              update(
                                "strength_summary_title",
                                v as StoreProduct["strength_summary_title"],
                              )
                            }
                          />
                        )}
                      </div>
                    );
                  })}
                {section.id === "strength" && (
                  <>
                    <StrengthCirclesEditor product={product} onChange={onChange} />
                    <StrengthItemsEditor product={product} onChange={onChange} />
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="form-field" data-field-id={field.key as string}>
      <div className="form-label-row">
        <span className="form-label-en">{field.labelEn}</span>
        {field.type === "image" && <span className="form-label-badge">IMAGE</span>}
      </div>

      {field.type === "image" ? (
        <ImageField value={value} onChange={onChange} />
      ) : field.type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="form-input form-textarea"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-input"
        />
      )}
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isImageRef = /^(https?:\/\/|\/uploads\/|data:image\/)/.test(value);
  const isPromptText = value && !isImageRef;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="image-field-wrap">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="이미지 URL 또는 설명 텍스트"
        className="form-input form-input-dashed"
      />

      <div className="image-field-actions" style={{ alignItems: "flex-start" }}>
        <button
          type="button"
          className="upload-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "업로드 중..." : "📁 파일 선택"}
        </button>
        {isImageRef && (
          <button
            type="button"
            className="upload-btn upload-btn-danger"
            onClick={() => onChange("")}
          >
            삭제
          </button>
        )}
        {isPromptText && (
          <div className="image-field-hint" style={{ flex: 1, minWidth: 0 }}>
            <span className="image-field-hint-label">DALL-E 프롬프트:</span>{" "}
            {String(value).replace(/^\[이미지\]\s*/, "")}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>

      {error && <div className="image-field-error">{error}</div>}

      {isImageRef ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="image-field-preview" />
      ) : (
        <button
          type="button"
          className="image-field-placeholder"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="이미지 업로드"
        >
          <span className="image-field-placeholder-icon">🖼</span>
          <span className="image-field-placeholder-label">
            {uploading ? "업로드 중..." : "이미지를 업로드하세요"}
          </span>
          <span className="image-field-placeholder-sub">
            {isPromptText
              ? "DALL-E 프롬프트가 입력되어 있습니다. 클릭해서 실제 이미지로 교체"
              : "클릭해서 파일 선택 · PNG/JPG/WebP, 최대 4MB"}
          </span>
        </button>
      )}
    </div>
  );
}

/* =========================================================================
   StrengthItemsEditor — 강점 1~5 항목을 카드로 묶고 각자 "비우기" 버튼 제공.
   미리보기에서 image/title/desc 가 모두 비어있는 항목은 자동 숨김.
   ========================================================================= */

function StrengthItemsEditor({
  product,
  onChange,
}: {
  product: StoreProduct;
  onChange: (next: StoreProduct) => void;
}) {
  // 활성 = title/desc/image 중 하나라도 채워진 항목
  function isActive(i: number) {
    const t = (product[`strength${i}_title` as keyof StoreProduct] ?? "") as string;
    const d = (product[`strength${i}_desc` as keyof StoreProduct] ?? "") as string;
    const img = (product[`strength${i}_image` as keyof StoreProduct] ?? "") as string;
    return Boolean(t || d || img);
  }

  // 표시할 항목: 활성된 항목 + 마지막 활성 항목 다음 빈 슬롯 1개 (최대 5)
  const activeCount = [1, 2, 3, 4, 5].filter(isActive).length;
  const lastActive = [5, 4, 3, 2, 1].find(isActive) ?? 0;
  const visibleCount = Math.min(5, Math.max(lastActive + 1, Math.min(activeCount + 1, 5)));

  function updateField<K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) {
    onChange({ ...product, [key]: value });
  }

  function clearItem(i: number) {
    onChange({
      ...product,
      [`strength${i}_image`]: "",
      [`strength${i}_title`]: "",
      [`strength${i}_desc`]: "",
    } as StoreProduct);
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          marginBottom: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        강점 항목 ({activeCount} / 5)
        <span style={{ marginLeft: 8, fontWeight: 400, color: "var(--text-dim)" }}>
          · 비어있는 항목은 미리보기에 자동으로 숨겨집니다
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: visibleCount }, (_, idx) => idx + 1).map((i) => {
          const titleKey = `strength${i}_title` as keyof StoreProduct;
          const descKey = `strength${i}_desc` as keyof StoreProduct;
          const imgKey = `strength${i}_image` as keyof StoreProduct;
          const active = isActive(i);
          return (
            <div
              key={i}
              data-field-id={`strength${i}_title`}
              style={{
                border: `1px solid ${active ? "var(--border)" : "rgba(201,188,190,0.5)"}`,
                borderRadius: 8,
                padding: 14,
                background: active ? "white" : "#fcfaf8",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                  강점 #{i}
                </span>
                {active && (
                  <button
                    type="button"
                    onClick={() => clearItem(i)}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--danger)",
                      background: "white",
                      border: "1px solid rgba(255,23,20,0.3)",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    비우기
                  </button>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div className="form-label-row" style={{ marginBottom: 4 }}>
                  <span className="form-label-en">STRENGTH {i} IMAGE</span>
                  <span className="form-label-badge">IMAGE</span>
                </div>
                <ImageField
                  value={(product[imgKey] ?? "") as string}
                  onChange={(v) => updateField(imgKey, v as StoreProduct[typeof imgKey])}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <div className="form-label-row" style={{ marginBottom: 4 }}>
                  <span className="form-label-en">STRENGTH {i} TITLE</span>
                </div>
                <input
                  type="text"
                  value={(product[titleKey] ?? "") as string}
                  onChange={(e) =>
                    updateField(titleKey, e.target.value as StoreProduct[typeof titleKey])
                  }
                  className="form-input"
                />
              </div>
              <div>
                <div className="form-label-row" style={{ marginBottom: 4 }}>
                  <span className="form-label-en">STRENGTH {i} DESC</span>
                </div>
                <textarea
                  value={(product[descKey] ?? "") as string}
                  onChange={(e) =>
                    updateField(descKey, e.target.value as StoreProduct[typeof descKey])
                  }
                  rows={2}
                  className="form-input form-textarea"
                />
              </div>
            </div>
          );
        })}
      </div>
      {activeCount < 5 && visibleCount < 5 && (
        <button
          type="button"
          onClick={() => {
            // 다음 빈 슬롯을 채워서 카드로 표시되게 — 빈 string으로 setting하면 trigger
            // 실제로는 visibleCount가 useState 없이 active 기반이라, 그냥 title 빈 string으로 마킹
            updateField(`strength${visibleCount + 1}_title` as keyof StoreProduct, " " as never);
          }}
          style={{
            marginTop: 12,
            padding: "10px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
            background: "white",
            border: "1px dashed var(--border)",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
          }}
        >
          + 강점 항목 추가 ({activeCount + 1}/5)
        </button>
      )}
    </div>
  );
}

/* =========================================================================
   StrengthCirclesEditor — 동그란 원 (메인/서브) 1~5개 가변 카드.
   ========================================================================= */

function StrengthCirclesEditor({
  product,
  onChange,
}: {
  product: StoreProduct;
  onChange: (next: StoreProduct) => void;
}) {
  function isActive(i: number) {
    const m = (product[`strength_circle${i}_main` as keyof StoreProduct] ?? "") as string;
    const s = (product[`strength_circle${i}_sub` as keyof StoreProduct] ?? "") as string;
    return Boolean(m || s);
  }

  const activeCount = [1, 2, 3, 4, 5].filter(isActive).length;
  const lastActive = [5, 4, 3, 2, 1].find(isActive) ?? 0;
  const visibleCount = Math.min(5, Math.max(lastActive + 1, Math.min(activeCount + 1, 5)));

  function updateField<K extends keyof StoreProduct>(key: K, value: StoreProduct[K]) {
    onChange({ ...product, [key]: value });
  }

  function clearCircle(i: number) {
    onChange({
      ...product,
      [`strength_circle${i}_main`]: "",
      [`strength_circle${i}_sub`]: "",
    } as StoreProduct);
  }

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          marginBottom: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
        }}
      >
        강조 원 (Circles) ({activeCount} / 5)
        <span style={{ marginLeft: 8, fontWeight: 400, color: "var(--text-dim)" }}>
          · 비어있는 원은 미리보기에 자동으로 숨겨집니다
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: visibleCount }, (_, idx) => idx + 1).map((i) => {
          const mainKey = `strength_circle${i}_main` as keyof StoreProduct;
          const subKey = `strength_circle${i}_sub` as keyof StoreProduct;
          const active = isActive(i);
          return (
            <div
              key={i}
              data-field-id={`strength_circle${i}_main`}
              style={{
                border: `1px solid ${active ? "var(--border)" : "rgba(201,188,190,0.5)"}`,
                borderRadius: 8,
                padding: 12,
                background: active ? "white" : "#fcfaf8",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <div style={{ flexShrink: 0, paddingTop: 6, width: 56 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                  원 #{i}
                </span>
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div className="form-label-row" style={{ marginBottom: 4 }}>
                    <span className="form-label-en">CIRCLE {i} MAIN</span>
                  </div>
                  <input
                    type="text"
                    value={(product[mainKey] ?? "") as string}
                    onChange={(e) =>
                      updateField(mainKey, e.target.value as StoreProduct[typeof mainKey])
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <div className="form-label-row" style={{ marginBottom: 4 }}>
                    <span className="form-label-en">CIRCLE {i} SUB</span>
                  </div>
                  <input
                    type="text"
                    value={(product[subKey] ?? "") as string}
                    onChange={(e) =>
                      updateField(subKey, e.target.value as StoreProduct[typeof subKey])
                    }
                    className="form-input"
                  />
                </div>
              </div>
              {active && (
                <button
                  type="button"
                  onClick={() => clearCircle(i)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--danger)",
                    background: "white",
                    border: "1px solid rgba(255,23,20,0.3)",
                    borderRadius: 4,
                    cursor: "pointer",
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                >
                  비우기
                </button>
              )}
            </div>
          );
        })}
      </div>
      {activeCount < 5 && visibleCount < 5 && (
        <button
          type="button"
          onClick={() => {
            updateField(
              `strength_circle${visibleCount + 1}_main` as keyof StoreProduct,
              " " as never,
            );
          }}
          style={{
            marginTop: 10,
            padding: "10px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
            background: "white",
            border: "1px dashed var(--border)",
            borderRadius: 6,
            cursor: "pointer",
            width: "100%",
          }}
        >
          + 원 추가 ({activeCount + 1}/5)
        </button>
      )}
    </div>
  );
}

/* =========================================================================
   StrengthSummaryHint — strength_summary_title 자동 추천 ("특별한 점 N가지")
   ========================================================================= */

function StrengthSummaryHint({
  product,
  onApply,
}: {
  product: StoreProduct;
  onApply: (value: string) => void;
}) {
  const circleCount = [1, 2, 3, 4, 5].filter((i) => {
    const m = (product[`strength_circle${i}_main` as keyof StoreProduct] ?? "") as string;
    const s = (product[`strength_circle${i}_sub` as keyof StoreProduct] ?? "") as string;
    return Boolean(m || s);
  }).length;

  const suggested = `특별한 점 ${circleCount || "N"}가지`;
  const current = product.strength_summary_title || "";
  const matches = current === suggested;

  return (
    <div
      style={{
        marginTop: -8,
        marginBottom: 14,
        padding: "8px 12px",
        background: "#fcfaf8",
        border: "1px dashed var(--border)",
        borderRadius: 6,
        fontSize: 11,
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span>💡 자동 추천:</span>
      <strong style={{ color: "var(--text-primary)" }}>{suggested}</strong>
      <span style={{ color: "var(--text-dim)" }}>
        (원 개수 {circleCount}개 기준)
      </span>
      {!matches && circleCount > 0 && (
        <button
          type="button"
          onClick={() => onApply(suggested)}
          style={{
            marginLeft: "auto",
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--accent-primary)",
            background: "white",
            border: "1px solid var(--accent-primary)",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          적용
        </button>
      )}
    </div>
  );
}
