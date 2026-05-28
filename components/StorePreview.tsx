"use client";

import type { StoreProduct } from "@/types/product";

type Props = { product: StoreProduct };

/**
 * Faithful preview of slunch.co.kr/store detail page.
 * Uses the .preview-* class names ported from slunch-admin.html into globals.css.
 */
export function StorePreview({ product }: Props) {
  return (
    <div className="preview-wrapper">
      <div data-section-id="hero">
        <ImageBlock value={product.hero_image} fallback="히어로 이미지 영역 (1:3 비율)" full />
        <ImageBlock value={product.feature_image} fallback="디쉬 항공샷 이미지" full />
        <Section label="1" tone="white">
          <Title text={product.hero_title} />
          <Text text={product.hero_desc} />
        </Section>
      </div>

      <div data-section-id="intro">
        <Section label="2" tone="sand">
          <Subtitle text={product.intro_label} />
          <Title text={product.intro_title} />
          <Text text={product.intro_body} />
        </Section>
      </div>

      <div data-section-id="feature">
        <Section label="3" tone="white">
          <Title text={product.feature_title} />
          <Text text={product.feature_body} />
        </Section>
      </div>

      <div data-section-id="process">
      <Section label="4" tone="lime">
        <ImageBlock value={product.process_image} fallback="제조 공정 이미지" height={480} />
        <Title text={product.process_title} margin />
        <Text text={product.process_body} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 32,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            const step = product[`process_${i}` as keyof StoreProduct] as string;
            if (!step) return null;
            const nextStep = product[`process_${i + 1}` as keyof StoreProduct] as string;
            return (
              <div key={i}>
                <div className="preview-process-step">
                  <span className="step-num">{i}</span>
                  <span>{step}</span>
                </div>
                {i < 5 && nextStep && <div className="preview-process-arrow">↓</div>}
              </div>
            );
          })}
        </div>
      </Section>

      </div>

      <div data-section-id="ingredient">
      <Section label="5" tone="gray">
        <ImageBlock value={product.ingredient_image} fallback="재료 그리드 배너 이미지" height={480} />
        <Title text={product.ingredient_title} margin />
        <Text text={product.ingredient_body} />
        <div style={{ margin: "24px auto 0", maxWidth: "80%" }}>
          <ImageBlock
            value={product.ingredient_detail_image}
            fallback="재료 상세 이미지 (1:1)"
            square
          />
        </div>
      </Section>

      </div>

      <div data-section-id="cert">
      <Section label="6" tone="gray">
        <Subtitle text={product.cert_subtitle} />
        <Title text={product.cert_title} />
        <Text text={product.cert_body} />
        <div className="preview-cert-split">
          <div className="preview-cert-image">
            <ImageBlock value={product.cert_image} fallback="인증 메인 이미지" />
          </div>
          <div className="preview-cert-list">
            {[1, 2, 3, 4, 5].map((i) => {
              const title = product[`cert_${i}_title` as keyof StoreProduct] as string;
              const desc = product[`cert_${i}_desc` as keyof StoreProduct] as string;
              if (!title) return null;
              return (
                <div key={i} className="preview-cert-item">
                  <span className="preview-cert-name">{title}</span>
                  <span className="preview-cert-desc">{desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      </div>

      <div data-section-id="heritage">
      <ImageBlock value={product.heritage_image} fallback="브랜드 스토리 이미지 (3:1)" full />

      <Section label="7" tone="gray">
        <Subtitle text={product.heritage_label} />
        <Title text={product.heritage_title} />
        <div className="preview-stats">
          {[1, 2, 3].map((i) => {
            const num = product[`heritage_stat${i}_num` as keyof StoreProduct] as string;
            const unit = product[`heritage_stat${i}_unit` as keyof StoreProduct] as string;
            const label = product[`heritage_stat${i}_label` as keyof StoreProduct] as string;
            return (
              <div key={i} className="preview-stat">
                <div className="preview-stat-number">
                  {num}
                  <span className="preview-stat-unit">{unit}</span>
                </div>
                <div className="preview-stat-label">{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 48 }}>
          <Text text={product.heritage_body} />
        </div>
      </Section>

      </div>

      <div data-section-id="serving">
      <Section label="8" tone="white">
        <Title text={product.serving_title} />
        <Text text={product.serving_subtitle} />
        <ImageBlock value={product.serving_center_image} fallback="서빙 배너 (풀와이드)" full />
        <div className="preview-servings">
          {[1, 2, 3, 4, 5].map((i) => {
            const title = product[`serving_${i}_title` as keyof StoreProduct] as string;
            const desc = product[`serving_${i}_desc` as keyof StoreProduct] as string;
            const img = product[`serving_${i}_image` as keyof StoreProduct] as string;
            if (!title) return null;
            return (
              <div key={i} className="preview-serving-item">
                <div style={{ width: 180, height: 180, overflow: "hidden", borderRadius: 12 }}>
                  <ImageBlock value={img} fallback="" square />
                </div>
                <div className="preview-serving-title">{title}</div>
                <div className="preview-serving-desc">{nl2br(desc)}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 32, textDecoration: "underline", color: "#6e5035" }}>
          <Text text={product.serving_tip} />
        </div>
      </Section>

      </div>

      <div data-section-id="strength">
      <Section label="9" tone="sand">
        <Title text={product.strength_summary_title} />
        <Text text={product.strength_quote} />
        <div className="preview-circles">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="preview-circle">
              <div className="preview-circle-main">
                {product[`strength_circle${i}_main` as keyof StoreProduct] as string}
              </div>
              <div className="preview-circle-sub">
                {product[`strength_circle${i}_sub` as keyof StoreProduct] as string}
              </div>
            </div>
          ))}
        </div>
        <div className="preview-strengths">
          {[1, 2, 3, 4, 5].map((i) => {
            const title = product[`strength${i}_title` as keyof StoreProduct] as string;
            const desc = product[`strength${i}_desc` as keyof StoreProduct] as string;
            const img = product[`strength${i}_image` as keyof StoreProduct] as string;
            if (!title && !desc) return null;
            return (
              <div key={i} className="preview-strength-item">
                <div className="strength-img">
                  <ImageBlock value={img} fallback="" />
                </div>
                <div className="preview-strength-text">
                  <div className="preview-strength-num">{i}</div>
                  <div className="preview-strength-title">{title}</div>
                  <div className="preview-strength-desc">{nl2br(desc)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      </div>

      <div data-section-id="reveal">
        <Section label="10" tone="white">
          <ImageBlock value={product.reveal_image} fallback="리빌 이미지" height={480} />
          <div style={{ fontSize: 26, fontWeight: 700, margin: "24px 0 14px", color: "#250a00" }}>
            {nl2br(product.reveal_quote)}
          </div>
          <Text text={product.reveal_body} />
        </Section>
        <ImageBlock value={product.gathering_image} fallback="다같이 모여먹기 이미지 (5:4)" full />
      </div>

      <div data-section-id="review">
      <Section label="11" tone="lime">
        <Title text={product.review_title} />
        <Text text={product.review_subtitle} />
        <div className="preview-reviews">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => {
            const r = product[`review_${i}` as keyof StoreProduct] as string;
            if (!r) return null;
            return (
              <div key={i} className="preview-review-item">
                &ldquo;{r}&rdquo;
              </div>
            );
          })}
        </div>
      </Section>

      </div>

      <div data-section-id="qna">
      <Section label="12" tone="white">
        <Title text={product.qna_title} />
        <Text text={product.qna_subtitle} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          {[1, 2, 3].map((i) => {
            const q = product[`qna_q${i}` as keyof StoreProduct] as string;
            const a = product[`qna_a${i}` as keyof StoreProduct] as string;
            if (!q) return null;
            return (
              <div key={i} style={{ padding: "18px 0", borderBottom: "1px solid #c9bcbe" }}>
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 18 }}>Q. {q}</div>
                <div style={{ color: "#666", fontSize: 17, lineHeight: 1.6 }}>A. {nl2br(a)}</div>
              </div>
            );
          })}
        </div>
      </Section>

      </div>

      <div data-section-id="ending">
        <ImageBlock value={product.ending_image} fallback="제품 엔딩샷" full />
      </div>

      <div data-section-id="info">
        <Section tone="white" align="left">
          <div className="preview-info-header">
            {product.info_제품명 || product.product_id}
          </div>
          <InfoGrid product={product} />
        </Section>
      </div>
    </div>
  );
}

function InfoGrid({ product }: { product: StoreProduct }) {
  const pairKeys: Array<keyof StoreProduct> = [
    "info_제품명",
    "info_식품유형",
    "info_품목보고번호",
    "info_내용량",
    "info_내포장재질",
  ];
  const labels: Record<string, string> = {
    info_제품명: "제품명",
    info_식품유형: "식품유형",
    info_품목보고번호: "품목보고번호",
    info_내용량: "내용량",
    info_내포장재질: "내포장재질",
  };

  const filledPairs = pairKeys.filter((k) => product[k]);

  const rows = [];
  for (let i = 0; i < filledPairs.length; i += 2) {
    const a = filledPairs[i];
    const b = filledPairs[i + 1];
    rows.push(
      <div key={i} className="preview-info-row">
        <div className="preview-info-cell">
          <div className="preview-info-key">{labels[a]}</div>
          <div className="preview-info-val">{product[a] as string}</div>
        </div>
        {b && (
          <div className="preview-info-cell">
            <div className="preview-info-key">{labels[b]}</div>
            <div className="preview-info-val">{product[b] as string}</div>
          </div>
        )}
      </div>,
    );
  }

  return (
    <div className="preview-info-grid">
      {rows}
      {product.info_원료명 && (
        <div className="preview-info-row">
          <div className="preview-info-cell full-row">
            <div className="preview-info-key">원료명</div>
            <div className="preview-info-val">{nl2br(product.info_원료명)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  label,
  tone,
  align,
  children,
}: {
  label?: string;
  tone: "white" | "sand" | "lime" | "gray";
  align?: "left" | "center";
  children: React.ReactNode;
}) {
  const cls = ["preview-section"];
  if (tone === "sand") cls.push("preview-sec-sand");
  if (tone === "lime") cls.push("preview-sec-lime");
  if (tone === "gray") cls.push("preview-sec-gray");
  return (
    <div className={cls.join(" ")} style={align === "left" ? { textAlign: "left" } : undefined}>
      {label && <div className="preview-badge">{label}</div>}
      {children}
    </div>
  );
}

function Title({ text, margin }: { text: string; margin?: boolean }) {
  return <div className="preview-title" style={margin ? { marginTop: 24 } : undefined}>{nl2br(text)}</div>;
}

function Subtitle({ text }: { text: string }) {
  return <div className="preview-subtitle">{text}</div>;
}

function Text({ text }: { text: string }) {
  return <div className="preview-text">{nl2br(text)}</div>;
}

function ImageBlock({
  value,
  fallback,
  full,
  square,
  height,
}: {
  value: string;
  fallback: string;
  full?: boolean;
  square?: boolean;
  height?: number;
}) {
  const isUrl = /^(https?:\/\/|\/uploads\/|data:image\/)/.test(value || "");
  if (isUrl) {
    return (
      <div className={full ? "preview-hero-image" : undefined} style={!full ? { margin: "0 auto" } : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt=""
          style={{
            width: "100%",
            display: "block",
            objectFit: "cover",
            ...(square ? { aspectRatio: "1 / 1" } : {}),
            ...(height ? { maxHeight: height } : {}),
            borderRadius: square ? 12 : 0,
          }}
        />
      </div>
    );
  }
  if (!fallback) return null;
  return (
    <div
      style={{
        padding: 40,
        textAlign: "center",
        color: "#999",
        fontSize: 13,
        background: "#f3eded",
        borderRadius: square ? 12 : 0,
        ...(square ? { aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center" } : {}),
      }}
    >
      {fallback}
    </div>
  );
}

function nl2br(text: string | undefined): React.ReactNode {
  if (!text) return null;
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}
