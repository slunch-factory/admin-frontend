"use client";

import type { StoreProduct } from "@/types/product";

type Props = { product: StoreProduct };

/**
 * Faithful 1:1 port of slunch-admin.html renderPreview() (line 3658-3932).
 * preview-* CSS 클래스와 인라인 스타일을 원본과 동일하게 사용. 마진/패딩/배경/
 * 이미지 비율까지 그대로 맞춤. sharing_image / gathering_image / 등 placeholder
 * 디자인까지 보존.
 */
export function StorePreview({ product }: Props) {
  // Helper: get string field (admin StoreProduct may not have every slunch field)
  const f = (key: string): string => {
    const v = (product as unknown as Record<string, string>)[key];
    return typeof v === "string" ? v : "";
  };
  const isUrl = (v: string): boolean => v.startsWith("http") || v.startsWith("/uploads/") || v.startsWith("data:image/");

  return (
    <div className="preview-wrapper">
      {/* Hero Image (full-width, 1:3) */}
      <div className="preview-hero-image" data-section-id="hero" data-field-id="hero_image">
        {isUrl(f("hero_image")) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={f("hero_image")} alt="" />
        ) : (
          <PreviewPlaceholder
            label={`히어로 이미지 (1:3) — hero_image${
              (f("hero_image") || "").replace("[이미지]", "").trim()
                ? `\n${(f("hero_image") || "").replace("[이미지]", "").substring(0, 60)}`
                : ""
            }`}
            fullHero
          />
        )}
      </div>

      {/* 1-1. Dish Aerial (히어로 바로 아래) */}
      <div style={{ margin: 0, overflow: "hidden" }} data-field-id="feature_image">
        {isUrl(f("feature_image")) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={f("feature_image")} alt="" style={{ width: "100%", display: "block" }} />
        ) : (
          <PreviewPlaceholder label="디쉬 항공샷 — feature_image" fullHero />
        )}
      </div>

      {/* 1. Hero */}
      <div className="preview-section">
        <div className="preview-badge">1</div>
        <div className="preview-title" data-field-id="hero_title">{nl2br(f("hero_title"))}</div>
        <div className="preview-text" data-field-id="hero_desc">{nl2br(f("hero_desc"))}</div>
      </div>

      {/* 2. Intro */}
      <div className="preview-section preview-sec-sand" data-section-id="intro">
        <div className="preview-badge">2</div>
        <div className="preview-subtitle" data-field-id="intro_label">{f("intro_label")}</div>
        <div className="preview-title" data-field-id="intro_title">{nl2br(f("intro_title"))}</div>
        <div className="preview-text" data-field-id="intro_body">{nl2br(f("intro_body"))}</div>
      </div>

      {/* 2-1. Sharing (풀와이드) */}
      <div style={{ margin: 0, overflow: "hidden" }} data-field-id="sharing_image">
        {isUrl(f("sharing_image")) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={f("sharing_image")} alt="" style={{ width: "100%", display: "block" }} />
        ) : (
          <PreviewPlaceholder label="함께 나눠먹기 이미지 (5:4) — sharing_image" aspectRatio="5 / 4" />
        )}
      </div>

      {/* 3. Feature */}
      <div className="preview-section" data-section-id="feature">
        <div className="preview-badge">3</div>
        <div className="preview-title" data-field-id="feature_title">{nl2br(f("feature_title"))}</div>
        <div className="preview-text" data-field-id="feature_body">{nl2br(f("feature_body"))}</div>
      </div>

      {/* 4. Process */}
      <div className="preview-section preview-sec-lime" data-section-id="process">
        <div className="preview-badge">4</div>
        <div style={{ margin: "0 -32px", padding: "0 16px" }}>
          <ImageBlock value={f("process_image")} height="480px" fallback="제조 공정 이미지" fieldId="process_image" />
        </div>
        <div className="preview-title" data-field-id="process_title" style={{ marginTop: 24 }}>{nl2br(f("process_title"))}</div>
        <div className="preview-text" data-field-id="process_body">{nl2br(f("process_body"))}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            marginTop: 45,
            maxWidth: 480,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            const step = f(`process_${i}`);
            if (!step) return null;
            const nextStep = f(`process_${i + 1}`);
            return (
              <div key={i}>
                <div className="preview-process-step" data-field-id={`process_${i}`}>
                  <span className="step-num">{i}</span>
                  <span>{step}</span>
                </div>
                {i < 5 && nextStep && <div className="preview-process-arrow">↓</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Ingredient */}
      <div className="preview-section preview-sec-gray" data-section-id="ingredient">
        <div className="preview-badge">5</div>
        <div style={{ margin: "0 -32px", padding: "0 16px" }}>
          <ImageBlock value={f("ingredient_image")} height="480px" fallback="재료 그리드 배너 이미지" fieldId="ingredient_image" />
        </div>
        <div className="preview-title" data-field-id="ingredient_title" style={{ marginTop: 24 }}>{nl2br(f("ingredient_title"))}</div>
        <div className="preview-text" data-field-id="ingredient_body">{nl2br(f("ingredient_body"))}</div>
        <div style={{ margin: "24px auto 0", maxWidth: "80%", padding: 0 }} data-field-id="ingredient_detail_image">
          {isUrl(f("ingredient_detail_image")) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={f("ingredient_detail_image")}
              alt=""
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                display: "block",
                borderRadius: 12,
              }}
            />
          ) : (
            <PreviewPlaceholder
              label="재료 상세 이미지 (1:1) — ingredient_detail_image"
              square
            />
          )}
        </div>
      </div>

      {/* 6. Certification */}
      <div className="preview-section preview-sec-gray" data-section-id="cert">
        <div className="preview-badge">6</div>
        <div className="preview-subtitle" data-field-id="cert_subtitle">{f("cert_subtitle")}</div>
        <div className="preview-title" data-field-id="cert_title">{nl2br(f("cert_title"))}</div>
        <div className="preview-text" data-field-id="cert_body">{nl2br(f("cert_body"))}</div>
        <div className="preview-cert-split">
          <div className="preview-cert-image" data-field-id="cert_image">
            {isUrl(f("cert_image")) ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={f("cert_image")} alt="" />
            ) : (
              <PreviewPlaceholder
                label={`인증 이미지 — cert_image${
                  (f("cert_image") || "").replace("[이미지]", "").trim()
                    ? `\n${(f("cert_image") || "").replace("[이미지]", "").substring(0, 60)}`
                    : ""
                }`}
                height="100%"
              />
            )}
          </div>
          <div className="preview-cert-list">
            {[1, 2, 3, 4, 5].map((i) => {
              const title = f(`cert_${i}_title`);
              if (!title) return null;
              return (
                <div key={i} className="preview-cert-item">
                  <span className="preview-cert-name" data-field-id={`cert_${i}_title`}>{title}</span>
                  <span className="preview-cert-desc" data-field-id={`cert_${i}_desc`}>{f(`cert_${i}_desc`)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. Heritage Image (full-width 1:3) */}
      <div className="preview-hero-image" data-section-id="heritage" data-field-id="heritage_image">
        {isUrl(f("heritage_image")) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={f("heritage_image")} alt="" />
        ) : (
          <PreviewPlaceholder
            label="브랜드 스토리 이미지 (3:1) — heritage_image"
            fullHero
          />
        )}
      </div>

      {/* 7. Heritage */}
      <div className="preview-section preview-sec-gray">
        <div className="preview-badge">7</div>
        <div className="preview-subtitle" data-field-id="heritage_label">{f("heritage_label")}</div>
        <div className="preview-title" data-field-id="heritage_title">{nl2br(f("heritage_title"))}</div>
        <div className="preview-stats">
          {[1, 2, 3].map((i) => (
            <div key={i} className="preview-stat" data-field-id={`heritage_stat${i}_num`}>
              <div className="preview-stat-number">
                {f(`heritage_stat${i}_num`)}
                <span className="preview-stat-unit" data-field-id={`heritage_stat${i}_unit`}>{f(`heritage_stat${i}_unit`)}</span>
              </div>
              <div className="preview-stat-label" data-field-id={`heritage_stat${i}_label`}>{f(`heritage_stat${i}_label`)}</div>
            </div>
          ))}
        </div>
        <div className="preview-text" data-field-id="heritage_body" style={{ marginTop: 72 }}>{nl2br(f("heritage_body"))}</div>
      </div>

      {/* 8. Serving */}
      <div className="preview-section" data-section-id="serving">
        <div className="preview-badge">8</div>
        <div className="preview-title" data-field-id="serving_title">{nl2br(f("serving_title"))}</div>
        <div className="preview-text" data-field-id="serving_subtitle" style={{ marginBottom: 24 }}>{nl2br(f("serving_subtitle"))}</div>
        <div style={{ margin: "0 -48px 24px", overflow: "hidden" }} data-field-id="serving_center_image">
          {isUrl(f("serving_center_image")) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={f("serving_center_image")} alt="" style={{ width: "100%", display: "block" }} />
          ) : (
            <PreviewPlaceholder
              label="서빙 배너 이미지 (풀와이드) — serving_center_image"
              fullHero
            />
          )}
        </div>
        <div className="preview-servings">
          {[1, 2, 3, 4, 5].map((i) => {
            const title = f(`serving_${i}_title`);
            const desc = f(`serving_${i}_desc`);
            const img = f(`serving_${i}_image`);
            if (!title) return null;
            return (
              <div key={i} className="preview-serving-item">
                <div style={{ width: 180, height: 180, overflow: "hidden", borderRadius: 12 }}>
                  <ImageBlock
                    value={img}
                    height="180px"
                    fallback={`서빙 ${i}`}
                    square
                    fieldId={`serving_${i}_image`}
                  />
                </div>
                <div className="preview-serving-title" data-field-id={`serving_${i}_title`}>{title}</div>
                <div className="preview-serving-desc" data-field-id={`serving_${i}_desc`}>{nl2br(desc)}</div>
              </div>
            );
          })}
        </div>
        <div className="preview-text" data-field-id="serving_tip" style={{ marginTop: 48, textDecoration: "underline", color: "#6e5035", fontSize: 15 }}>
          {nl2br(f("serving_tip"))}
        </div>
      </div>

      {/* 9. Strength */}
      <div className="preview-section preview-sec-sand" data-section-id="strength">
        <div className="preview-badge">9</div>
        <div className="preview-title" data-field-id="strength_summary_title">{nl2br(f("strength_summary_title"))}</div>
        <div className="preview-subtitle" data-field-id="strength_quote" style={{ letterSpacing: 0, textTransform: "none", color: "#555" }}>
          {nl2br(f("strength_quote"))}
        </div>
        <div className="preview-circles">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="preview-circle" data-field-id={`strength_circle${i}_main`}>
              <div className="preview-circle-main">{f(`strength_circle${i}_main`)}</div>
              <div className="preview-circle-sub" data-field-id={`strength_circle${i}_sub`}>{f(`strength_circle${i}_sub`)}</div>
            </div>
          ))}
        </div>
        <div className="preview-strengths">
          {[1, 2, 3, 4, 5].map((i) => {
            const title = f(`strength${i}_title`);
            const desc = f(`strength${i}_desc`);
            const img = f(`strength${i}_image`);
            if (!title && !desc) return null;
            return (
              <div key={i} className="preview-strength-item">
                <div className="strength-img">
                  <ImageBlock
                    value={img}
                    height="100%"
                    fallback={`강점 ${i} — strength${i}_image`}
                    fieldId={`strength${i}_image`}
                  />
                </div>
                <div className="preview-strength-text">
                  <div className="preview-strength-num">{i}</div>
                  <div className="preview-strength-title" data-field-id={`strength${i}_title`}>{title}</div>
                  <div className="preview-strength-desc" data-field-id={`strength${i}_desc`}>{nl2br(desc)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10. Reveal */}
      <div className="preview-section" data-section-id="reveal">
        <div className="preview-badge">10</div>
        <div style={{ margin: "0 -32px", padding: "0 16px" }}>
          <ImageBlock value={f("reveal_image")} height="480px" fallback="리빌 이미지" fieldId="reveal_image" />
        </div>
        <div data-field-id="reveal_quote" style={{ fontSize: 26, fontWeight: 700, margin: "24px 0 14px", textAlign: "center", color: "#250a00" }}>
          {nl2br(f("reveal_quote"))}
        </div>
        <div className="preview-text" data-field-id="reveal_body">{nl2br(f("reveal_body"))}</div>
      </div>

      {/* 10-1. Gathering (풀와이드 5:4) */}
      <div style={{ margin: 0, overflow: "hidden" }} data-field-id="gathering_image">
        {isUrl(f("gathering_image")) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={f("gathering_image")}
            alt=""
            style={{ width: "100%", aspectRatio: "5 / 4", objectFit: "cover", display: "block" }}
          />
        ) : (
          <PreviewPlaceholder
            label="다같이 모여먹기 이미지 (5:4) — gathering_image"
            aspectRatio="5 / 4"
          />
        )}
      </div>

      {/* 11. Review */}
      <div className="preview-section preview-sec-lime" data-section-id="review">
        <div className="preview-badge">11</div>
        <div className="preview-title" data-field-id="review_title">{nl2br(f("review_title"))}</div>
        <div className="preview-text" data-field-id="review_subtitle" style={{ marginBottom: 20 }}>{nl2br(f("review_subtitle"))}</div>
        <div className="preview-reviews">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => {
            const r = f(`review_${i}`);
            if (!r) return null;
            return (
              <div key={i} className="preview-review-item" data-field-id={`review_${i}`}>
                &ldquo;{r}&rdquo;
              </div>
            );
          })}
        </div>
      </div>

      {/* 12. QnA */}
      <div className="preview-section" data-section-id="qna">
        <div className="preview-badge">12</div>
        <div className="preview-title" data-field-id="qna_title">{nl2br(f("qna_title"))}</div>
        <div className="preview-text" data-field-id="qna_subtitle" style={{ marginBottom: 24 }}>{nl2br(f("qna_subtitle"))}</div>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
          {[1, 2, 3].map((i) => {
            const q = f(`qna_q${i}`);
            const a = f(`qna_a${i}`);
            if (!q) return null;
            return (
              <div key={i} style={{ padding: "18px 0", borderBottom: "1px solid #c9bcbe" }}>
                <div data-field-id={`qna_q${i}`} style={{ fontWeight: 700, marginBottom: 10, color: "#250a00", fontSize: 18 }}>
                  Q. {q}
                </div>
                <div data-field-id={`qna_a${i}`} style={{ color: "#666", fontSize: 17, lineHeight: 1.6 }}>
                  A. {nl2br(a)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ending Image */}
      <div className="preview-hero-image" data-section-id="ending" data-field-id="ending_image">
        {isUrl(f("ending_image")) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={f("ending_image")} alt="" />
        ) : (
          <PreviewPlaceholder
            label="제품 엔딩샷 (패키지+내용물 병렬) — ending_image"
            fullHero
          />
        )}
      </div>

      {/* 13. Info (OH NUTTY clean line style) */}
      <div className="preview-section" style={{ padding: "40px 48px", textAlign: "left" }} data-section-id="info">
        <div className="preview-info-header">{f("info_제품명") || f("product_id") || product.product_id}</div>
        <InfoGrid product={product} f={f} />
        {f("info_알레르기") && (
          <div className="preview-info-allergy" style={{ marginTop: 16 }}>
            알레르기 유발물질: {f("info_알레르기")}
          </div>
        )}
        {f("info_참고사항") && <div className="preview-info-notes">{f("info_참고사항")}</div>}
      </div>
    </div>
  );
}

/* =========================================================================
   Info section (matches slunch-admin renderPreview info block)
   ========================================================================= */

function InfoGrid({
  product,
  f,
}: {
  product: StoreProduct;
  f: (key: string) => string;
}) {
  void product;
  const halfKeys = ["제품명", "식품유형", "품목보고번호", "내용량", "내포장재질", "유통기한"];
  const filled = halfKeys.filter((k) => f(`info_${k}`));

  const pairRows: React.ReactNode[] = [];
  for (let i = 0; i < filled.length; i += 2) {
    const a = filled[i];
    const b = filled[i + 1];
    pairRows.push(
      <div key={`p-${i}`} className="preview-info-row">
        <div className="preview-info-cell">
          <div className="preview-info-key">{a}</div>
          <div className="preview-info-val">{f(`info_${a}`)}</div>
        </div>
        {b && (
          <div className="preview-info-cell">
            <div className="preview-info-key">{b}</div>
            <div className="preview-info-val">{f(`info_${b}`)}</div>
          </div>
        )}
      </div>,
    );
  }

  const fullKeys = ["제조원", "소분원", "판매원"];
  const fullRows = fullKeys
    .filter((k) => f(`info_${k}`))
    .map((k) => (
      <div key={`f-${k}`} className="preview-info-row">
        <div className="preview-info-cell full-row">
          <div className="preview-info-key">{k}</div>
          <div className="preview-info-val">{f(`info_${k}`)}</div>
        </div>
      </div>
    ));

  return (
    <div className="preview-info-grid">
      {pairRows}
      {fullRows}
      {f("info_원료명") && (
        <div className="preview-info-row">
          <div className="preview-info-cell full-row">
            <div className="preview-info-key">원료명</div>
            <div className="preview-info-val">{nl2br(f("info_원료명"))}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Image block — used inside sections (non full-width)
   ========================================================================= */

function ImageBlock({
  value,
  height,
  fallback,
  square,
  fieldId,
}: {
  value: string;
  height?: string;
  fallback: string;
  square?: boolean;
  fieldId?: string;
}) {
  const isUrl =
    value.startsWith("http") || value.startsWith("/uploads/") || value.startsWith("data:image/");
  if (isUrl) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={value}
        alt=""
        data-field-id={fieldId}
        style={{
          width: "100%",
          maxWidth: "100%",
          height: height || "auto",
          objectFit: "cover",
          borderRadius: 12,
          display: "block",
          boxSizing: "border-box",
        }}
      />
    );
  }
  return (
    <div data-field-id={fieldId}>
      <PreviewPlaceholder
        label={fallback || "이미지"}
        height={height}
        square={square}
      />
    </div>
  );
}

/* =========================================================================
   Preview placeholder — 이미지 미설정 시 점선 박스 + 아이콘 + 라벨.
   섹션 배경(white/sand/lime/gray) 어디에서도 보이도록 translucent 톤 사용.
   ========================================================================= */

function PreviewPlaceholder({
  label,
  height,
  aspectRatio,
  square,
  fullHero,
}: {
  label?: string;
  height?: string;
  aspectRatio?: string;
  square?: boolean;
  fullHero?: boolean;
}) {
  const style: React.CSSProperties = {
    width: "100%",
    padding: 20,
    border: "2px dashed rgba(110,80,53,0.35)",
    borderRadius: fullHero ? 0 : 12,
    background: "rgba(232,226,226,0.55)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#6e5035",
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.5,
    boxSizing: "border-box",
    textAlign: "center",
  };
  if (square) {
    style.aspectRatio = "1 / 1";
  } else if (aspectRatio) {
    style.aspectRatio = aspectRatio;
  } else if (height) {
    style.minHeight = height;
  } else if (fullHero) {
    style.minHeight = 220;
  }
  return (
    <div style={style}>
      <span style={{ fontSize: 32, opacity: 0.45, lineHeight: 1 }}>🖼</span>
      {label && <span>{label}</span>}
    </div>
  );
}

/* =========================================================================
   nl2br helper — converts \n to <br/>
   ========================================================================= */

function nl2br(text: string | undefined): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}
