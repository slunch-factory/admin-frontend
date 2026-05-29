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
                {section.fields.map((field) => (
                  <FieldRow
                    key={field.key as string}
                    field={field}
                    value={(product[field.key] ?? "") as string}
                    onChange={(v) =>
                      update(field.key, v as StoreProduct[typeof field.key])
                    }
                  />
                ))}
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
