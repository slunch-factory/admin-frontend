"use client";

import { useId } from "react";
import type { SubscribeProduct } from "@/types/product";

function hasInfoFields(p: SubscribeProduct): boolean {
  return Boolean(
    p.info_제품명 ||
      p.info_식품유형 ||
      p.info_품목보고번호 ||
      p.info_내용량 ||
      p.info_유통기한 ||
      p.info_제조원 ||
      p.info_소분원 ||
      p.info_판매원 ||
      p.info_원료명 ||
      p.info_알레르기 ||
      p.info_참고사항,
  );
}

type Props = { product: SubscribeProduct };

/**
 * Faithful 1:1 port of slunch-admin.html mealApp.renderPreview (line 7672-7817).
 * 960px 카드 (img 44% / body flex). 마진/패딩/폰트/컬러를 원본과 동일하게 유지.
 * 모바일(640px 미만)에서 column 레이아웃으로 전환.
 * scroll-sync 호환을 위한 data-section-id 마커 유지.
 */
export function SubscribePreview({ product: p }: Props) {
  const sf = "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
  const mono = "'Courier New', Courier, monospace";
  const cardId = useId().replace(/:/g, "_");

  const ingArr = p.ingredients ? p.ingredients.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const ingNames = ingArr.map((s) => s.replace(/\s*[\d.]+\s*[gmlkg리터oz]+[^\s,]*/i, "").trim());
  const ingAmounts = ingArr.map((s) => {
    const m = s.match(/([\d.]+\s*[gmlkg리터oz]+[^\s,]*)/i);
    return m ? m[1].trim() : "";
  });
  const priceStr = p.price ? p.price.toLocaleString() + "원" : "";
  const hasImage = Boolean(p.image_url);

  return (
    <>
      {/* 반응형 스타일 주입 — mealApp 원본과 동일. body는 내부 스크롤. */}
      <style>
        {`
          #${cardId}{max-width:960px;margin:0 auto;display:flex;flex-direction:row;border-radius:20px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.18);background:#fff;}
          #${cardId} .slp-img{width:44%;flex-shrink:0;background:#250a00;position:relative;min-height:560px;}
          #${cardId} .slp-body{flex:1;overflow-y:auto;max-height:580px;padding:40px 36px;position:relative;}
          @media(max-width:640px){
            #${cardId}{flex-direction:column;border-radius:16px;}
            #${cardId} .slp-img{width:100%;min-height:0;aspect-ratio:4/3;}
            #${cardId} .slp-body{max-height:none;overflow-y:visible;padding:28px 22px;}
          }
        `}
      </style>

      <div id={cardId}>
        {/* ── 이미지 영역 ── (data-section-id 마커는 slp-body 내부에만 배치 — sync 단순화) */}
        <div className="slp-img" data-field-id="field-image-url">
          {hasImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={p.image_url}
              alt={p.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                bottom: 24,
                left: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 12,
                border: "2px dashed rgba(255,255,255,0.35)",
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                padding: 16,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 40, opacity: 0.55 }}>🖼</span>
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.65)",
                  fontFamily: mono,
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                이미지 URL을 입력해주세요
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: sf,
                  lineHeight: 1.5,
                }}
              >
                image_url 필드를 채우면 여기 표시됩니다
              </span>
            </div>
          )}

          {/* 로고 오버레이 */}
          <div style={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: 1.5,
                lineHeight: 1.2,
                textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                fontFamily: sf,
              }}
            >
              SLUNCH
              <br />
              FACTORY
            </div>
            <div
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 1,
                marginTop: 3,
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                fontFamily: sf,
              }}
            >
              Slow &amp; Lunch
            </div>
          </div>

          {p.detail_url && (
            <a
              href={p.detail_url}
              target="_blank"
              rel="noreferrer"
              data-field-id="field-detail-url"
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                zIndex: 2,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 10,
                letterSpacing: 1.5,
                color: "#fff",
                textDecoration: "none",
                fontFamily: mono,
              }}
            >
              상세보기 →
            </a>
          )}
        </div>

        {/* ── 콘텐츠 영역 ── */}
        <div className="slp-body">
          {/* basic: 제품명 / 태그라인 / 뱃지 / 가격 */}
          <div data-section-id="basic" style={{ padding: "4px 6px", margin: "-4px -6px 0" }}>
            {/* 제품명 — H1, 위계 최상위 */}
            <div
              data-field-id="field-name"
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#250a00",
                lineHeight: 1.25,
                letterSpacing: -0.5,
                fontFamily: sf,
              }}
            >
              {p.name}
            </div>

            {/* 태그라인 */}
            {p.tagline && (
              <div
                data-field-id="field-tagline"
                style={{ marginTop: 8, fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.55, fontFamily: sf }}
              >
                {p.tagline}
              </div>
            )}

            {/* 뱃지 */}
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.diet && (
                <span
                  data-field-id="field-diet"
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    border: "1px solid #111",
                    borderRadius: 100,
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: "#250a00",
                    fontFamily: sf,
                  }}
                >
                  {p.diet}
                </span>
              )}
              {p.allergens && p.allergens.length > 0 && (
                <span data-field-id="field-allergens" style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
                  {p.allergens.map((al) => (
                    <span
                      key={al}
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        border: "1px solid #e6863f",
                        borderRadius: 100,
                        fontSize: 10.5,
                        color: "#e6863f",
                        fontFamily: sf,
                      }}
                    >
                      Allergy · {al}
                    </span>
                  ))}
                </span>
              )}
            </div>

            {/* 가격 — H2, 제목보다 한 단계 아래 */}
            {priceStr && (
              <div
                data-field-id="field-price"
                style={{
                  marginTop: 18,
                  fontSize: 21,
                  fontWeight: 700,
                  color: "#250a00",
                  letterSpacing: -0.4,
                  fontFamily: sf,
                }}
              >
                {priceStr}
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div style={{ margin: "24px 0", height: 1, background: "#c9bcbe" }} />

          {/* SELLING POINTS */}
          {p.selling_points && p.selling_points.length > 0 && (
            <>
              <div data-section-id="selling" style={{ padding: "4px 6px", margin: "-4px -6px 0" }}>
                <div
                  style={{
                    marginBottom: 8,
                    fontSize: 9,
                    letterSpacing: 3,
                    color: "rgba(0,0,0,0.35)",
                    fontFamily: mono,
                  }}
                >
                  SELLING POINTS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {p.selling_points.map((s, i) =>
                    s && s.title ? (
                      <div key={i} data-field-id={`selling-${i}`}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 18,
                              height: 18,
                              background: "#250a00",
                              color: "#fff",
                              borderRadius: 999,
                              fontSize: 10,
                              fontWeight: 700,
                              flexShrink: 0,
                              fontFamily: sf,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: "#250a00",
                              fontFamily: sf,
                              lineHeight: 1.3,
                            }}
                          >
                            {s.title}
                          </span>
                        </div>
                        {s.desc && (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: "rgba(0,0,0,0.55)",
                              lineHeight: 1.55,
                              paddingLeft: 26,
                              fontFamily: sf,
                            }}
                          >
                            {s.desc}
                          </div>
                        )}
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
              {/* 구분선 */}
              <div style={{ margin: "24px 0", height: 1, background: "#c9bcbe" }} />
            </>
          )}

          {/* nutrition: INGREDIENTS + NUTRITION */}
          <div data-section-id="nutrition" style={{ padding: "4px 6px", margin: "-4px -6px 0" }}>
          {/* INGREDIENTS */}
          {ingArr.length > 0 && (
            <div data-field-id="field-ingredients">
              <div style={{ marginBottom: 8, fontSize: 9, letterSpacing: 3, color: "rgba(0,0,0,0.35)", fontFamily: mono }}>
                INGREDIENTS
              </div>
              {ingArr.map((raw, idx) => {
                const nm = ingNames[idx] || raw;
                const am = ingAmounts[idx] || "";
                if (!nm) return null;
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "9px 0",
                      borderBottom: "1px solid #e8e2e2",
                    }}
                  >
                    <span style={{ fontSize: 12.5, color: "#250a00", fontFamily: sf }}>{nm}</span>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: "rgba(0,0,0,0.38)",
                        fontFamily: sf,
                        marginLeft: 12,
                        flexShrink: 0,
                      }}
                    >
                      {am}
                    </span>
                  </div>
                );
              })}
              <div style={{ height: 24 }} />
            </div>
          )}

          {/* NUTRITION — 5 cells incl. sodium */}
          <div style={{ marginBottom: 8, fontSize: 9, letterSpacing: 3, color: "rgba(0,0,0,0.35)", fontFamily: mono }}>
            NUTRITION
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 1,
              background: "#c9bcbe",
              border: "1px solid #c9bcbe",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {(
              [
                [p.nutrients.kcal, "kcal", "nutri-kcal"],
                [`${p.nutrients.protein}g`, "단백질", "nutri-protein"],
                [`${p.nutrients.carbs}g`, "탄수화물", "nutri-carbs"],
                [`${p.nutrients.fat}g`, "지방", "nutri-fat"],
                [`${p.nutrients.sodium}mg`, "나트륨", "nutri-sodium"],
              ] as Array<[string | number, string, string]>
            ).map(([val, label, fid]) => (
              <div
                key={fid}
                data-field-id={fid}
                style={{ background: "#fff", padding: "14px 8px", textAlign: "center" }}
              >
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "#250a00", fontFamily: sf, lineHeight: 1.2 }}>{val}</div>
                <div style={{ fontSize: 9, color: "rgba(0,0,0,0.4)", marginTop: 4, fontFamily: sf, letterSpacing: 0.3 }}>{label}</div>
              </div>
            ))}
          </div>
          </div>{/* /data-section-id="nutrition" */}

          {/* DESCRIPTION */}
          {p.description && (
            <>
              <div style={{ margin: "24px 0", height: 1, background: "#c9bcbe" }} />
              <div data-field-id="field-description">
                <div style={{ marginBottom: 8, fontSize: 9, letterSpacing: 3, color: "rgba(0,0,0,0.35)", fontFamily: mono }}>
                  DESCRIPTION
                </div>
                <div style={{ fontSize: 12.5, color: "#444", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: sf }}>
                  {p.description}
                </div>
              </div>
            </>
          )}

          {/* COOKING TIP */}
          {p.cooking_tip && (
            <>
              <div style={{ margin: "24px 0", height: 1, background: "#c9bcbe" }} />
              <div data-field-id="field-cooking-tip">
                <div style={{ marginBottom: 8, fontSize: 9, letterSpacing: 3, color: "rgba(0,0,0,0.35)", fontFamily: mono }}>
                  COOKING TIP
                </div>
                <div style={{ fontSize: 12.5, color: "#444", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: sf }}>
                  {p.cooking_tip}
                </div>
              </div>
            </>
          )}

          {/* PRODUCT INFO — info_* 필드 풀 테이블 */}
          {hasInfoFields(p) && (
            <>
              <div style={{ margin: "24px 0", height: 1, background: "#c9bcbe" }} />
              <div data-section-id="info">
                <div style={{ marginBottom: 12, fontSize: 9, letterSpacing: 3, color: "rgba(0,0,0,0.35)", fontFamily: mono }}>
                  PRODUCT INFO
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {(
                    [
                      ["제품명", p.info_제품명, "info-제품명"],
                      ["식품유형", p.info_식품유형, "info-식품유형"],
                      ["품목보고번호", p.info_품목보고번호, "info-품목보고번호"],
                      ["내용량", p.info_내용량, "info-내용량"],
                      ["유통기한", p.info_유통기한, "info-유통기한"],
                      ["제조원", p.info_제조원, "info-제조원"],
                      ["소분원", p.info_소분원, "info-소분원"],
                      ["판매원", p.info_판매원, "info-판매원"],
                      ["원료명", p.info_원료명, "info-원료명"],
                      ["알레르기", p.info_알레르기, "info-알레르기"],
                      ["참고사항", p.info_참고사항, "info-참고사항"],
                    ] as Array<[string, string, string]>
                  )
                    .filter(([, v]) => v)
                    .map(([label, val, fid]) => (
                      <div
                        key={fid}
                        data-field-id={fid}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "110px 1fr",
                          gap: 12,
                          padding: "9px 0",
                          borderBottom: "1px solid #e8e2e2",
                        }}
                      >
                        <div style={{ fontSize: 10.5, color: "rgba(0,0,0,0.45)", fontFamily: sf, fontWeight: 600 }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.7)", fontFamily: sf, lineHeight: 1.6, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                          {val}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {/* HASHTAGS */}
          {p.hashtags && (
            <div
              data-field-id="field-hashtags"
              style={{
                marginTop: 24,
                paddingTop: 14,
                borderTop: "1px solid #e8e2e2",
                fontSize: 10.5,
                color: "#6e5035",
                fontFamily: sf,
                lineHeight: 1.6,
                letterSpacing: 0.2,
              }}
            >
              {p.hashtags}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
