"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload";
import type { SubscribeProduct, SubscribeSellingPoint } from "@/types/product";

type Props = {
  product: SubscribeProduct;
  onChange: (next: SubscribeProduct) => void;
};

const SECTIONS: ReadonlyArray<{ id: string; title: string }> = [
  { id: "basic", title: "① 기본 정보" },
  { id: "selling", title: "② 소구 포인트" },
  { id: "image", title: "③ 이미지 · 링크" },
  { id: "nutrition", title: "④ 영양 정보" },
  { id: "info", title: "⑤ 식품 정보 (라벨)" },
];

export function SubscribeProductForm({ product, onChange }: Props) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((s, i) => [s.id, i === 0])),
  );

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function update<K extends keyof SubscribeProduct>(key: K, value: SubscribeProduct[K]) {
    onChange({ ...product, [key]: value });
  }

  function updateNutrient(key: keyof SubscribeProduct["nutrients"], value: number) {
    onChange({ ...product, nutrients: { ...product.nutrients, [key]: value } });
  }

  function updateSellingPoint(idx: number, patch: Partial<SubscribeSellingPoint>) {
    const next = product.selling_points.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange({ ...product, selling_points: next });
  }

  function addSellingPoint() {
    onChange({
      ...product,
      selling_points: [...product.selling_points, { title: "", desc: "" }],
    });
  }

  function removeSellingPoint(idx: number) {
    onChange({
      ...product,
      selling_points: product.selling_points.filter((_, i) => i !== idx),
    });
  }

  return (
    <div className="store-form">
      <Section
        id="basic"
        title={SECTIONS[0].title}
        open={open.basic}
        onToggle={() => toggle("basic")}
      >
        <Row>
          <Field label="ID" en="ID">
            <input
              type="number"
              value={product.id}
              onChange={(e) => update("id", Number(e.target.value))}
              className="form-input"
            />
          </Field>
          <Field label="CODE" en="CODE">
            <input
              type="text"
              value={product.code}
              onChange={(e) => update("code", e.target.value)}
              className="form-input"
            />
          </Field>
        </Row>
        <Field label="메뉴명" en="NAME">
          <input
            type="text"
            value={product.name}
            onChange={(e) => update("name", e.target.value)}
            className="form-input"
          />
        </Field>
        <Row>
          <Field label="등급" en="TIER">
            <input
              type="text"
              value={product.tier}
              onChange={(e) => update("tier", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="식단" en="DIET">
            <input
              type="text"
              value={product.diet}
              onChange={(e) => update("diet", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="ORIGIN" en="ORIGIN">
            <input
              type="text"
              value={product.origin}
              onChange={(e) => update("origin", e.target.value)}
              className="form-input"
            />
          </Field>
        </Row>
        <Row>
          <Field label="원가" en="COST">
            <input
              type="number"
              value={product.cost}
              onChange={(e) => update("cost", Number(e.target.value))}
              className="form-input"
            />
          </Field>
          <Field label="판매가" en="PRICE">
            <input
              type="number"
              value={product.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className="form-input"
            />
          </Field>
        </Row>
      </Section>

      <Section
        id="selling"
        title={SECTIONS[1].title}
        open={open.selling}
        onToggle={() => toggle("selling")}
      >
        <Field label="TAGLINE" en="TAGLINE">
          <input
            type="text"
            value={product.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="DESCRIPTION" en="DESCRIPTION">
          <textarea
            value={product.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="form-input form-textarea"
          />
        </Field>

        {product.selling_points.map((sp, idx) => (
          <div key={idx} className="selling-point-card">
            <div className="selling-point-head">
              <span className="form-label-en">소구 포인트 #{idx + 1}</span>
              <button
                type="button"
                className="upload-btn upload-btn-danger"
                onClick={() => removeSellingPoint(idx)}
              >
                삭제
              </button>
            </div>
            <Field label={`소구 ${idx + 1} — 타이틀`} en={`SELLING ${idx + 1} TITLE`}>
              <input
                type="text"
                value={sp.title}
                onChange={(e) => updateSellingPoint(idx, { title: e.target.value })}
                className="form-input"
              />
            </Field>
            <Field label={`소구 ${idx + 1} — 설명`} en={`SELLING ${idx + 1} DESC`}>
              <textarea
                value={sp.desc}
                onChange={(e) => updateSellingPoint(idx, { desc: e.target.value })}
                rows={2}
                className="form-input form-textarea"
              />
            </Field>
          </div>
        ))}
        <button
          type="button"
          className="upload-btn"
          onClick={addSellingPoint}
          style={{ alignSelf: "flex-start" }}
        >
          + 소구 포인트 추가
        </button>

        <Field label="해시태그" en="HASHTAGS">
          <input
            type="text"
            value={product.hashtags}
            onChange={(e) => update("hashtags", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="조리 팁" en="COOKING TIP">
          <textarea
            value={product.cooking_tip}
            onChange={(e) => update("cooking_tip", e.target.value)}
            rows={2}
            className="form-input form-textarea"
          />
        </Field>
      </Section>

      <Section
        id="image"
        title={SECTIONS[2].title}
        open={open.image}
        onToggle={() => toggle("image")}
      >
        <Field label="대표 이미지" en="IMAGE URL" badge="IMAGE">
          <ImageUploadField
            value={product.image_url}
            onChange={(v) => update("image_url", v)}
          />
        </Field>
        <Field label="상세 페이지 URL" en="DETAIL URL">
          <input
            type="text"
            value={product.detail_url}
            onChange={(e) => update("detail_url", e.target.value)}
            className="form-input"
          />
        </Field>
      </Section>

      <Section
        id="nutrition"
        title={SECTIONS[3].title}
        open={open.nutrition}
        onToggle={() => toggle("nutrition")}
      >
        <Row>
          <Field label="kcal" en="KCAL">
            <input
              type="number"
              value={product.nutrients.kcal}
              onChange={(e) => updateNutrient("kcal", Number(e.target.value))}
              className="form-input"
            />
          </Field>
          <Field label="단백질 (g)" en="PROTEIN">
            <input
              type="number"
              value={product.nutrients.protein}
              onChange={(e) => updateNutrient("protein", Number(e.target.value))}
              className="form-input"
            />
          </Field>
          <Field label="탄수화물 (g)" en="CARBS">
            <input
              type="number"
              value={product.nutrients.carbs}
              onChange={(e) => updateNutrient("carbs", Number(e.target.value))}
              className="form-input"
            />
          </Field>
        </Row>
        <Row>
          <Field label="지방 (g)" en="FAT">
            <input
              type="number"
              value={product.nutrients.fat}
              onChange={(e) => updateNutrient("fat", Number(e.target.value))}
              className="form-input"
            />
          </Field>
          <Field label="나트륨 (mg)" en="SODIUM">
            <input
              type="number"
              value={product.nutrients.sodium}
              onChange={(e) => updateNutrient("sodium", Number(e.target.value))}
              className="form-input"
            />
          </Field>
        </Row>
        <Field label="알러젠 (쉼표 구분)" en="ALLERGENS">
          <input
            type="text"
            value={product.allergens.join(", ")}
            onChange={(e) =>
              update(
                "allergens",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            className="form-input"
          />
        </Field>
        <Field label="원료 (재료 — 미리보기 ingredients 리스트에 사용)" en="INGREDIENTS">
          <textarea
            value={product.ingredients}
            onChange={(e) => update("ingredients", e.target.value)}
            rows={3}
            className="form-input form-textarea"
            placeholder="예) 비트 300g, 발사믹 글레이즈 30ml, 아루굴라 50g"
          />
        </Field>
      </Section>

      <Section
        id="info"
        title={SECTIONS[4].title}
        open={open.info}
        onToggle={() => toggle("info")}
      >
        <Field label="제품명" en="INFO 제품명">
          <input
            type="text"
            value={product.info_제품명}
            onChange={(e) => update("info_제품명", e.target.value)}
            className="form-input"
          />
        </Field>
        <Row>
          <Field label="식품유형" en="INFO 식품유형">
            <input
              type="text"
              value={product.info_식품유형}
              onChange={(e) => update("info_식품유형", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="품목보고번호" en="INFO 품목보고번호">
            <input
              type="text"
              value={product.info_품목보고번호}
              onChange={(e) => update("info_품목보고번호", e.target.value)}
              className="form-input"
            />
          </Field>
        </Row>
        <Row>
          <Field label="내용량" en="INFO 내용량">
            <input
              type="text"
              value={product.info_내용량}
              onChange={(e) => update("info_내용량", e.target.value)}
              className="form-input"
            />
          </Field>
          <Field label="유통기한" en="INFO 유통기한">
            <input
              type="text"
              value={product.info_유통기한}
              onChange={(e) => update("info_유통기한", e.target.value)}
              className="form-input"
            />
          </Field>
        </Row>
        <Field label="제조원" en="INFO 제조원">
          <input
            type="text"
            value={product.info_제조원}
            onChange={(e) => update("info_제조원", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="소분원" en="INFO 소분원">
          <input
            type="text"
            value={product.info_소분원}
            onChange={(e) => update("info_소분원", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="판매원" en="INFO 판매원">
          <input
            type="text"
            value={product.info_판매원}
            onChange={(e) => update("info_판매원", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="원료명" en="INFO 원료명">
          <textarea
            value={product.info_원료명}
            onChange={(e) => update("info_원료명", e.target.value)}
            rows={2}
            className="form-input form-textarea"
          />
        </Field>
        <Field label="알레르기" en="INFO 알레르기">
          <input
            type="text"
            value={product.info_알레르기}
            onChange={(e) => update("info_알레르기", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="참고사항" en="INFO 참고사항">
          <textarea
            value={product.info_참고사항}
            onChange={(e) => update("info_참고사항", e.target.value)}
            rows={3}
            className="form-input form-textarea"
          />
        </Field>
      </Section>
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`form-section ${open ? "open" : ""}`}>
      <button type="button" onClick={onToggle} className="form-section-header">
        <span>{title}</span>
        <span className="form-section-caret">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="form-section-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  en,
  badge,
  children,
}: {
  label?: string;
  en: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-field" style={{ marginBottom: 8 }}>
      <div className="form-label-row">
        <span className="form-label-en">{en}</span>
        {badge && <span className="form-label-badge">{badge}</span>}
        {label && label !== en && (
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{label}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0 }}>
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

function ImageUploadField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isImageRef = /^(https?:\/\/|\/uploads\/|data:image\/)/.test(value);

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
        placeholder="이미지 URL"
        className="form-input form-input-dashed"
      />
      <div className="image-field-actions">
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
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: "none" }}
        />
      </div>
      {error && <div className="image-field-error">{error}</div>}
      {isImageRef && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="image-field-preview" />
      )}
    </div>
  );
}
