import type { SubscribeProduct } from "@/types/product";

/**
 * 구독 메뉴 카페24 HTML 생성.
 * slunch-admin.html mealApp.renderCafe24 (line 7819-7973) 그대로 포팅.
 */

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseIngredientParts(ingredients: string): { names: string[]; amounts: string[]; raw: string[] } {
  const raw = ingredients
    ? ingredients.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const names = raw.map((s) => s.replace(/\s*[\d.]+\s*[gmlkg리터oz]+[^\s,]*/i, "").trim());
  const amounts = raw.map((s) => {
    const m = s.match(/([\d.]+\s*[gmlkg리터oz]+[^\s,]*)/i);
    return m ? m[1].trim() : "";
  });
  return { raw, names, amounts };
}

export function renderSubscribeCafe24(p: SubscribeProduct): string {
  const allergenText = p.allergens && p.allergens.length > 0 ? p.allergens.join(", ") : "";
  const { raw: ingArr, names: ingNames, amounts: ingAmounts } = parseIngredientParts(p.ingredients || "");
  const sp = p.selling_points || [];
  const priceStr = p.price ? p.price.toLocaleString() + "원" : "";
  const mono = "'Courier New', Courier, monospace";
  const accordionId = "slunch-acc-" + (p.id || "1");

  let h = "";

  /* ===== Cafe24 에디토리얼 레이아웃 ===== */
  h += "<style>";
  h += "#slunch-detail{max-width:800px;margin:0 auto;background:#250a00;font-family:" + mono + ";}";
  h +=
    "#slunch-detail .sd-hero{width:100%;aspect-ratio:16/9;background:#250a00;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}";
  h += "#slunch-detail .sd-split{display:flex;min-height:380px;}";
  h +=
    "#slunch-detail .sd-text{flex:1;background:#fcfaf8;padding:48px 40px;display:flex;flex-direction:column;justify-content:center;}";
  h +=
    "#slunch-detail .sd-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;}";
  h += "#slunch-detail .sd-table{background:#250a00;padding:60px 48px;}";
  h +=
    "#slunch-detail .sd-acc-wrap{background:#250a00;border-top:1px solid rgba(253,251,243,0.06);padding:0 48px;}";
  h +=
    "#slunch-detail .sd-acc-hd{display:flex;align-items:center;justify-content:space-between;padding:28px 0;cursor:pointer;border-bottom:1px solid rgba(253,251,243,0.06);}";
  h += "#slunch-detail .sd-acc-bd{display:none;padding:32px 0 40px;}";
  h += "</style>";

  h += '<div id="slunch-detail">';

  /* ── 1. 메인 이미지 ── */
  h += '<div class="sd-hero">';
  h += '<div style="color:rgba(253,251,243,0.1);font-size:10px;letter-spacing:3px;">[PRODUCT IMAGE]</div>';
  h += '<div style="position:absolute;bottom:0;left:0;padding:20px 24px;">';
  h +=
    '<div style="font-size:9px;letter-spacing:2px;color:rgba(253,251,243,0.4);margin-bottom:4px;">' +
    (p.tier ? esc(p.tier) : "SLUNCH FACTORY") +
    "</div>";
  h +=
    '<div style="font-size:22px;font-weight:700;color:#fcfaf8;font-family:' +
    mono +
    ';">' +
    esc(p.name) +
    "</div>";
  if (p.tagline)
    h +=
      '<div style="font-size:11px;font-style:italic;color:#dcfd4a;margin-top:4px;font-family:' +
      mono +
      ';">' +
      esc(p.tagline) +
      "</div>";
  h += "</div>";
  if (priceStr) {
    h += '<div style="position:absolute;bottom:0;right:0;padding:20px 24px;text-align:right;">';
    h +=
      '<div style="font-size:9px;letter-spacing:2px;color:rgba(253,251,243,0.4);margin-bottom:4px;">PRICE</div>';
    h +=
      '<div style="font-size:22px;font-weight:700;color:#dcfd4a;font-family:' +
      mono +
      ';">' +
      priceStr +
      "</div>";
    h += "</div>";
  }
  h += "</div>"; /* /hero */

  /* ── 2. 스플릿: 텍스트 좌 + 2×2 그리드 우 ── */
  h += '<div class="sd-split">';

  /* 왼쪽 텍스트 */
  h += '<div class="sd-text">';
  h +=
    '<div style="font-size:10px;letter-spacing:2.5px;color:rgba(15,15,15,0.35);margin-bottom:28px;">IMAGINE :</div>';
  if (p.tagline)
    h +=
      '<div style="font-size:16px;color:#250a00;line-height:2;">' +
      esc(p.tagline) +
      "</div>";
  if (sp.length > 0) {
    sp.forEach((s, i) => {
      if (!s || !s.title) return;
      h +=
        '<div style="font-size:13px;color:rgba(15,15,15,0.6);line-height:1.9;margin-top:' +
        (i === 0 && p.tagline ? "20px" : "0") +
        ';">— ' +
        esc(s.title) +
        "</div>";
    });
  }
  h += '<div style="margin-top:32px;width:24px;height:2px;background:#250a00;opacity:0.15;"></div>';
  h += '<div style="margin-top:20px;display:flex;gap:6px;flex-wrap:wrap;">';
  if (p.diet)
    h +=
      '<span style="font-size:9px;letter-spacing:1.5px;border:1px solid rgba(15,15,15,0.25);padding:3px 10px;color:#250a00;">' +
      esc(p.diet) +
      "</span>";
  if (allergenText)
    h +=
      '<span style="font-size:9px;letter-spacing:1px;color:rgba(15,15,15,0.45);">알레르기: ' +
      esc(allergenText) +
      "</span>";
  h += "</div>";
  h += "</div>"; /* /sd-text */

  /* 오른쪽 2×2 컬러 그리드 */
  const blockColors = ["#dcfd4a", "#250a00", "#250a00", "#fcfaf8"];
  const blockTextColors = ["#250a00", "#dcfd4a", "#fcfaf8", "#250a00"];
  const blockLabelColors = [
    "rgba(0,0,0,0.4)",
    "rgba(220,253,74,0.5)",
    "rgba(253,251,243,0.35)",
    "rgba(0,0,0,0.4)",
  ];
  h += '<div class="sd-grid">';
  for (let bi = 0; bi < 4; bi++) {
    h +=
      '<div style="background:' +
      blockColors[bi] +
      ";display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;min-height:190px;\">";
    h +=
      '<div style="font-size:8px;letter-spacing:2px;color:' +
      blockLabelColors[bi] +
      ';margin-bottom:10px;">ING 0' +
      (bi + 1) +
      "</div>";
    h +=
      '<div style="font-size:16px;font-weight:700;color:' +
      blockTextColors[bi] +
      ";text-align:center;line-height:1.3;font-family:" +
      mono +
      ';">' +
      (ingNames[bi] ? esc(ingNames[bi]) : "—") +
      "</div>";
    if (ingAmounts[bi])
      h +=
        '<div style="font-size:10px;color:' +
        blockLabelColors[bi] +
        ';margin-top:8px;">' +
        esc(ingAmounts[bi]) +
        "</div>";
    h += "</div>";
  }
  h += "</div>"; /* /sd-grid */
  h += "</div>"; /* /sd-split */

  /* ── 3. 재료 테이블 ── */
  h += '<div class="sd-table">';
  h += '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:32px;">';
  h += '<div style="font-size:10px;letter-spacing:3px;color:#dcfd4a;">INGREDIENTS</div>';
  h +=
    '<div style="font-size:9px;letter-spacing:1.5px;color:rgba(253,251,243,0.2);">NAME · AMOUNT</div>';
  h += "</div>";
  h += '<div style="height:1px;background:rgba(253,251,243,0.08);"></div>';
  h += '<div style="display:flex;padding:10px 0;border-bottom:1px solid rgba(253,251,243,0.06);">';
  h += '<div style="width:40px;font-size:8px;color:rgba(253,251,243,0.2);">#</div>';
  h +=
    '<div style="flex:1;font-size:8px;letter-spacing:1.5px;color:rgba(253,251,243,0.2);">INGREDIENT</div>';
  h +=
    '<div style="width:100px;text-align:right;font-size:8px;letter-spacing:1.5px;color:rgba(253,251,243,0.2);">AMOUNT</div>';
  h += "</div>";
  ingArr.forEach((raw, idx) => {
    const nm = ingNames[idx] || raw;
    const am = ingAmounts[idx] || "";
    if (!nm) return;
    const isLime = idx % 5 === 0;
    h += '<div style="display:flex;align-items:center;padding:14px 0;border-bottom:1px solid rgba(253,251,243,0.04);">';
    h +=
      '<div style="width:40px;font-size:10px;color:' +
      (isLime ? "#dcfd4a" : "rgba(253,251,243,0.2)") +
      ';">' +
      (idx < 9 ? "0" + (idx + 1) : String(idx + 1)) +
      "</div>";
    h +=
      '<div style="flex:1;font-size:14px;color:#fcfaf8;letter-spacing:0.5px;">' +
      esc(nm) +
      "</div>";
    h +=
      '<div style="width:100px;text-align:right;font-size:13px;color:' +
      (am ? "#dcfd4a" : "rgba(253,251,243,0.2)") +
      ";font-weight:" +
      (am ? "600" : "400") +
      ';">' +
      (am ? esc(am) : "—") +
      "</div>";
    h += "</div>";
  });
  /* 영양정보 박스 */
  h += '<div style="margin-top:48px;">';
  h += '<div style="font-size:9px;letter-spacing:2.5px;color:rgba(253,251,243,0.25);margin-bottom:16px;">NUTRITION FACTS</div>';
  h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(253,251,243,0.06);">';
  const nuts: [string | number, string][] = [
    [p.nutrients.kcal, "KCAL"],
    [p.nutrients.protein + "g", "PROTEIN"],
    [p.nutrients.carbs + "g", "CARBS"],
    [p.nutrients.fat + "g", "FAT"],
  ];
  for (const [val, label] of nuts) {
    h += '<div style="background:#250a00;padding:20px 12px;text-align:center;">';
    h += '<div style="font-size:22px;font-weight:700;color:#fcfaf8;letter-spacing:-0.5px;">' + String(val) + "</div>";
    h +=
      '<div style="font-size:8px;letter-spacing:2px;color:rgba(253,251,243,0.3);margin-top:6px;">' +
      label +
      "</div>";
    h += "</div>";
  }
  h += "</div>";
  h += "</div>";
  h += "</div>"; /* /sd-table */

  /* ── 4. 제품 정보 아코디언 ── */
  h += '<div class="sd-acc-wrap">';
  h +=
    '<div class="sd-acc-hd" onclick="(function(){var el=document.getElementById(\'' +
    accordionId +
    '\');var ar=document.getElementById(\'' +
    accordionId +
    "-ar');if(el.style.display==='none'||el.style.display===''){el.style.display='block';ar.innerHTML='▲';}else{el.style.display='none';ar.innerHTML='▼';}})();\">";
  h += '<div style="font-size:10px;letter-spacing:3px;color:#fcfaf8;">BY THE WAY...</div>';
  h +=
    '<div id="' +
    accordionId +
    '-ar" style="font-size:12px;color:rgba(253,251,243,0.4);">▼</div>';
  h += "</div>";
  h += '<div id="' + accordionId + '" style="display:none;" class="sd-acc-bd">';
  const infoRows: [string, string][] = [];
  if (p.diet) infoRows.push(["식단 유형", p.diet]);
  if (p.tier) infoRows.push(["등급", p.tier]);
  if (priceStr) infoRows.push(["가격", priceStr]);
  if (allergenText) infoRows.push(["알레르기", allergenText]);
  for (const [label, val] of infoRows) {
    h += '<div style="display:flex;padding:13px 0;border-bottom:1px solid rgba(253,251,243,0.05);">';
    h +=
      '<div style="width:120px;font-size:10px;letter-spacing:1.5px;color:rgba(253,251,243,0.3);">' +
      esc(label) +
      "</div>";
    h += '<div style="flex:1;font-size:13px;color:#fcfaf8;">' + esc(val) + "</div>";
    h += "</div>";
  }
  if (sp.length > 0 && sp[0] && sp[0].title) {
    h +=
      '<div style="font-size:9px;letter-spacing:2.5px;color:rgba(253,251,243,0.25);margin:24px 0 16px;">WHY SLUNCH</div>';
    sp.forEach((s) => {
      if (!s || !s.title) return;
      h += '<div style="padding:14px 0;border-bottom:1px solid rgba(253,251,243,0.04);display:flex;gap:12px;align-items:flex-start;">';
      h += '<span style="color:#dcfd4a;font-size:10px;flex-shrink:0;margin-top:2px;">→</span>';
      h += "<div>";
      h +=
        '<div style="font-size:13px;font-weight:700;color:#fcfaf8;margin-bottom:4px;">' +
        esc(s.title) +
        "</div>";
      if (s.desc)
        h +=
          '<div style="font-size:11px;color:rgba(253,251,243,0.45);line-height:1.7;">' +
          esc(s.desc) +
          "</div>";
      h += "</div>";
      h += "</div>";
    });
  }
  h += "</div>"; /* /acc-bd */
  h += "</div>"; /* /acc-wrap */

  h += "</div>"; /* /slunch-detail */

  return h;
}

export function renderSubscribeJSON(p: SubscribeProduct): string {
  return JSON.stringify(p, null, 2);
}
