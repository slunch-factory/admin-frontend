"use client";

import type { SubscribeProduct } from "@/types/product";

type Props = { product: SubscribeProduct };

type Ingredient = { name: string; qty: string | null };

function parseIngredients(s: string): Ingredient[] {
  return s
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((entry) => {
      const m = entry.match(/^(.+?)\s+(\d+(?:\.\d+)?\s*(?:g|ml|kg|L|개|cc|mg|ea))$/i);
      if (m) return { name: m[1].trim(), qty: m[2].replace(/\s+/g, "") };
      return { name: entry, qty: null };
    });
}

/**
 * Subscribe preview card — uses INLINE styles for the entire layout so
 * the design is unaffected by external CSS specificity or Tailwind layers.
 * Mirrors the design in image #4: dark brown brand panel left, white
 * details panel right.
 */
export function SubscribePreview({ product }: Props) {
  const isUrl = /^(https?:\/\/|\/uploads\/|data:image\/)/.test(product.image_url || "");
  const ingredients = parseIngredients(product.ingredients);

  return (
    <div style={S.outer}>
      <div style={S.card}>
        {/* LEFT: brand panel */}
        <div style={S.left}>
          <div>
            <div style={S.brandName}>SLUNCH</div>
            <div style={S.brandName}>FACTORY</div>
            <div style={S.brandSub}>Slow &amp; Lunch</div>
          </div>

          <div style={S.imageSlot}>
            {isUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt="" style={S.image} />
            ) : (
              <div style={S.imagePlaceholder}>
                <div style={S.imageIcon}>🖼</div>
                <div>이미지 URL을 입력해주세요</div>
              </div>
            )}
          </div>

          <div style={S.brandFoot}>{product.code}</div>
        </div>

        {/* RIGHT: details panel */}
        <div style={S.right}>
          <div style={S.name}>{product.name}</div>
          {product.tagline && <div style={S.tagline}>{product.tagline}</div>}

          <div style={S.badgesRow}>
            {product.diet && <span style={S.badgeDiet}>{product.diet}</span>}
            {product.allergens.length > 0 && (
              <span style={S.badgeAllergy}>
                Allergy · {product.allergens.join(", ")}
              </span>
            )}
            {product.tier && product.tier !== product.diet && (
              <span style={S.badgeTier}>{product.tier}</span>
            )}
          </div>

          <div style={S.price}>{product.price.toLocaleString()}원</div>

          <hr style={S.divider} />

          {product.selling_points.length > 0 && (
            <>
              <div style={S.sectionLabel}>SELLING POINTS</div>
              <div style={S.sellingList}>
                {product.selling_points.map((sp, i) => (
                  <div key={i} style={S.sellingItem}>
                    <div style={S.sellingHead}>
                      <span style={S.sellingNum}>{i + 1}</span>
                      <span style={S.sellingTitle}>{sp.title}</span>
                    </div>
                    {sp.desc && <div style={S.sellingDesc}>{sp.desc}</div>}
                  </div>
                ))}
              </div>
              <hr style={{ ...S.divider, marginTop: 20 }} />
            </>
          )}

          <div style={S.sectionLabel}>INGREDIENTS</div>
          <div>
            {ingredients.length === 0 && (
              <div style={S.empty}>원료 정보가 없습니다</div>
            )}
            {ingredients.map((ing, i) => (
              <div
                key={i}
                style={{
                  ...S.ingRow,
                  ...(i === ingredients.length - 1 ? { borderBottom: "none" } : {}),
                }}
              >
                <span>{ing.name}</span>
                {ing.qty && <span style={S.ingQty}>{ing.qty}</span>}
              </div>
            ))}
          </div>

          <div style={{ ...S.sectionLabel, marginTop: 28 }}>NUTRITION</div>
          <div style={S.nutritionGrid}>
            <Nutrient label="kcal" value={product.nutrients.kcal} />
            <Nutrient label="단백질" value={`${product.nutrients.protein}g`} />
            <Nutrient label="탄수화물" value={`${product.nutrients.carbs}g`} />
            <Nutrient label="지방" value={`${product.nutrients.fat}g`} />
            <Nutrient label="나트륨" value={`${product.nutrients.sodium}mg`} />
          </div>

          {product.description && (
            <>
              <div style={{ ...S.sectionLabel, marginTop: 28 }}>DESCRIPTION</div>
              <div style={S.body}>{product.description}</div>
            </>
          )}

          {product.cooking_tip && (
            <>
              <div style={{ ...S.sectionLabel, marginTop: 20 }}>COOKING TIP</div>
              <div style={S.body}>{product.cooking_tip}</div>
            </>
          )}

          {hasInfoFields(product) && (
            <>
              <div style={{ ...S.sectionLabel, marginTop: 28 }}>PRODUCT INFO</div>
              <div style={S.infoTable}>
                {[
                  ["제품명", product.info_제품명],
                  ["식품유형", product.info_식품유형],
                  ["품목보고번호", product.info_품목보고번호],
                  ["내용량", product.info_내용량],
                  ["유통기한", product.info_유통기한],
                  ["제조원", product.info_제조원],
                  ["소분원", product.info_소분원],
                  ["판매원", product.info_판매원],
                  ["원료명", product.info_원료명],
                  ["알레르기", product.info_알레르기],
                  ["참고사항", product.info_참고사항],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} style={S.infoRow}>
                      <div style={S.infoKey}>{k}</div>
                      <div style={S.infoVal}>{v}</div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {product.hashtags && <div style={S.hashtags}>{product.hashtags}</div>}
        </div>
      </div>
    </div>
  );
}

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

function Nutrient({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={S.nutCell}>
      <div style={S.nutValue}>{value}</div>
      <div style={S.nutLabel}>{label}</div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  outer: {
    padding: 24,
    background: "#f6f3ee",
    minHeight: "100%",
    boxSizing: "border-box",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "minmax(220px, 5fr) minmax(280px, 6fr)",
    background: "white",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(37, 10, 0, 0.12)",
    maxWidth: "100%",
  },
  left: {
    background: "#250a00",
    color: "white",
    padding: "28px 28px 24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 540,
    gap: 16,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 1,
    lineHeight: 1.05,
    color: "white",
  },
  brandSub: {
    fontSize: 12,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.55)",
    marginTop: 4,
    fontStyle: "italic",
  },
  imageSlot: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "16px 0",
    minHeight: 220,
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: 8,
  },
  imagePlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: 12,
    textAlign: "center",
  },
  imageIcon: {
    fontSize: 36,
    opacity: 0.4,
  },
  brandFoot: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: '"Courier New", monospace',
  },
  right: {
    padding: 32,
    display: "flex",
    flexDirection: "column",
    background: "white",
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: "#250a00",
    lineHeight: 1.25,
  },
  tagline: {
    marginTop: 8,
    fontSize: 14,
    color: "#6e5035",
    lineHeight: 1.4,
  },
  badgesRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 16,
  },
  badgeDiet: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 999,
    lineHeight: 1.4,
    background: "white",
    color: "#250a00",
    border: "1.5px solid #250a00",
  },
  badgeAllergy: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 999,
    lineHeight: 1.4,
    background: "#e6863f",
    color: "white",
    border: "1.5px solid #e6863f",
  },
  badgeTier: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 999,
    lineHeight: 1.4,
    background: "#fbf582",
    color: "#250a00",
    border: "1.5px solid #d4cb6d",
  },
  price: {
    marginTop: 22,
    fontSize: 32,
    fontWeight: 700,
    color: "#250a00",
    letterSpacing: -0.5,
  },
  divider: {
    margin: "20px 0 16px",
    border: "none",
    borderTop: "1px solid #e8e2e2",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#b8a89a",
    marginBottom: 10,
  },
  ingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "10px 0",
    borderBottom: "1px solid #f3eded",
    fontSize: 14,
    color: "#333",
  },
  ingQty: {
    color: "#6e5035",
    fontWeight: 600,
    fontSize: 13,
  },
  nutritionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 6,
  },
  nutCell: {
    background: "#fcfaf8",
    border: "1px solid #f0eae3",
    borderRadius: 8,
    padding: "12px 6px",
    textAlign: "center",
  },
  nutValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#250a00",
  },
  nutLabel: {
    fontSize: 11,
    color: "#6e5035",
    marginTop: 4,
  },
  body: {
    fontSize: 13,
    color: "#444",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  hashtags: {
    marginTop: 24,
    fontSize: 12,
    color: "#6e5035",
    paddingTop: 16,
    borderTop: "1px solid #f3eded",
  },
  empty: {
    fontSize: 12,
    color: "var(--text-dim)",
    padding: "12px 0",
  },
  sellingList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sellingItem: {
    background: "#fcfaf8",
    border: "1px solid #f0eae3",
    borderRadius: 8,
    padding: "12px 14px",
  },
  sellingHead: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sellingNum: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    background: "#6e5035",
    color: "white",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  sellingTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#250a00",
    lineHeight: 1.3,
  },
  sellingDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 1.5,
    paddingLeft: 28,
  },
  infoTable: {
    display: "flex",
    flexDirection: "column",
    fontSize: 12,
  },
  infoRow: {
    display: "grid",
    gridTemplateColumns: "100px 1fr",
    gap: 12,
    padding: "8px 0",
    borderTop: "1px solid #f3eded",
  },
  infoKey: {
    color: "#6e5035",
    fontWeight: 600,
  },
  infoVal: {
    color: "#444",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
};
