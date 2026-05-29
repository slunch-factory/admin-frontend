import type { StoreProduct } from "@/types/product";

/**
 * 카페24 상세 페이지에 그대로 붙여넣을 수 있는 인라인 스타일 HTML 생성.
 * slunch-admin.html renderCafe24() (line 3934-4156) 그대로 포팅.
 */

function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s: unknown): string {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

export function renderCafe24(product: StoreProduct): string {
  const e = (f: keyof StoreProduct) => escapeHtml(product[f] as string);
  const p = (f: keyof StoreProduct) => nl2br(product[f] as string);
  const cImg = (f: string, h: string) => {
    const v = (product as unknown as Record<string, string>)[f] ?? "";
    if (!v) return "";
    if (v.startsWith("http")) {
      return (
        '<img src="' +
        escapeHtml(v) +
        '" style="width:100%!important;max-width:100%!important;height:' +
        h +
        ';object-fit:cover;border-radius:12px;display:block;box-sizing:border-box;" alt="">'
      );
    }
    return "";
  };

  const wrap =
    "max-width:860px;margin:0 auto;font-family:Pretendard,-apple-system,BlinkMacSystemFont,sans-serif;line-height:1.6;color:#250a00;overflow:hidden;";
  const secW = "padding:72px 48px;text-align:center;background:#fcfaf8;";
  const secSand = "padding:72px 48px;text-align:center;background:#e8e2e2;";
  const secLime = "padding:72px 48px;text-align:center;background:#dcfd4a;";
  const secProc = secLime;
  const _noise =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";
  const _secGray = `padding:72px 48px;text-align:center;background-color:#c9bcbe;background-image:${_noise};background-blend-mode:overlay;background-size:150px 150px;`;
  const secIngr = _secGray;
  const secCert = _secGray;
  const secHeri = _secGray;
  const secRev = secLime;
  const tit =
    "font-size:38px;font-weight:700;margin-bottom:16px;color:#250a00;line-height:1.4;text-align:center;";
  const sub =
    "font-size:18px;font-weight:600;margin-bottom:10px;color:#6e5035;letter-spacing:1.5px;text-transform:uppercase;text-align:center;";
  const txt =
    "font-size:18px;line-height:1.6;color:#444;max-width:640px;margin-left:auto;margin-right:auto;text-align:center;";

  // build piece-by-piece, matching original's order
  let html = '<div style="' + wrap + '">';

  // Hero image
  if (cImg("hero_image", "auto")) {
    html += '<div style="width:100%;overflow:hidden;">' + cImg("hero_image", "auto") + "</div>";
  }

  // 1-1. Dish aerial (히어로 바로 아래)
  if (cImg("feature_image", "auto")) {
    html += '<div style="width:100%;overflow:hidden;">' + cImg("feature_image", "auto") + "</div>";
  }

  // 1. Hero
  html +=
    '<div style="' + secW + '">' +
    '<div style="' + tit + '">' + p("hero_title") + "</div>" +
    '<div style="' + txt + '">' + p("hero_desc") + "</div>" +
    "</div>";

  // 2. Intro
  html +=
    '<div style="' + secSand + '">' +
    '<div style="' + sub + '">' + e("intro_label") + "</div>" +
    '<div style="' + tit + '">' + p("intro_title") + "</div>" +
    '<div style="' + txt + '">' + p("intro_body") + "</div>" +
    "</div>";

  // 2-1. Sharing (풀와이드 5:4) — sharing_image 필드는 admin StoreProduct에 없을 수 있음, 안전하게 처리
  if (cImg("sharing_image", "auto")) {
    html +=
      '<div style="width:100%;overflow:hidden;">' + cImg("sharing_image", "auto") + "</div>";
  }

  // 3. Feature
  html +=
    '<div style="' + secW + '">' +
    '<div style="' + tit + '">' + p("feature_title") + "</div>" +
    '<div style="' + txt + '">' + p("feature_body") + "</div>" +
    "</div>";

  // 4. Process (Cooking)
  html +=
    '<div style="' + secProc + '">' +
    cImg("process_image", "300px") +
    '<div style="' + tit + 'margin-top:24px;">' + p("process_title") + "</div>" +
    '<div style="' + txt + '">' + p("process_body") + "</div>" +
    '<div style="margin-top:45px;max-width:480px;margin-left:auto;margin-right:auto;">';
  for (let i = 1; i <= 5; i++) {
    const step = (product as unknown as Record<string, string>)["process_" + i];
    if (!step) continue;
    const nextStep = (product as unknown as Record<string, string>)["process_" + (i + 1)];
    const arrow =
      i < 5 && nextStep
        ? '<div style="text-align:center;color:#6e5035;font-size:16px;padding:2px 0;">↓</div>'
        : "";
    html +=
      '<div style="padding:10px 24px;background:#fcfaf8;border:none;border-radius:28px;font-size:17px;color:#250a00;text-align:center;"><span style="font-weight:700;color:#6e5035;font-size:19px;margin-right:10px;">' +
      i +
      "</span>" +
      escapeHtml(step) +
      "</div>" +
      arrow;
  }
  html += "</div></div>";

  // 5. Ingredient
  html +=
    '<div style="' + secIngr + '">' +
    cImg("ingredient_image", "400px") +
    '<div style="' + tit + 'margin-top:24px;">' + p("ingredient_title") + "</div>" +
    '<div style="' + txt + '">' + p("ingredient_body") + "</div>";
  if (cImg("ingredient_detail_image", "auto")) {
    html +=
      '<div style="max-width:80%;margin:24px auto 0;">' +
      cImg("ingredient_detail_image", "auto") +
      "</div>";
  }
  html += "</div>";

  // 6. Certification
  html +=
    '<div style="' + secCert + '">' +
    '<div style="' + sub + '">' + e("cert_subtitle") + "</div>" +
    '<div style="' + tit + '">' + p("cert_title") + "</div>" +
    '<div style="' + txt + '">' + p("cert_body") + "</div>" +
    '<table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:54px;"><tr>' +
    '<td width="50%" style="vertical-align:top;padding-right:16px;">' +
    (cImg("cert_image", "280px") ||
      '<div style="width:100%;height:280px;background:linear-gradient(135deg,#e8e2e2,#c9bcbe);border-radius:12px;"></div>') +
    "</td>" +
    '<td width="50%" style="vertical-align:middle;">' +
    '<table cellpadding="0" cellspacing="0" border="0" width="100%">';
  for (let i = 1; i <= 5; i++) {
    const t = (product as unknown as Record<string, string>)["cert_" + i + "_title"];
    if (!t) continue;
    const d = (product as unknown as Record<string, string>)["cert_" + i + "_desc"] || "";
    const borderTop = i === 1 ? "border-top:1px solid #e0b6e5;" : "";
    html +=
      '<tr><td style="padding:14px 0;border-bottom:1px solid #e0b6e5;' +
      borderTop +
      'text-align:left;"><span style="font-size:17px;font-weight:700;color:#250a00;white-space:nowrap;">' +
      escapeHtml(t) +
      "</span>&nbsp;&nbsp;<span style=\"font-size:14px;color:#666;font-weight:400;\">" +
      escapeHtml(d) +
      "</span></td></tr>";
  }
  html += "</table></td></tr></table></div>";

  // Heritage image
  if (cImg("heritage_image", "auto")) {
    html +=
      '<div style="width:100%;overflow:hidden;">' + cImg("heritage_image", "auto") + "</div>";
  }

  // 7. Heritage
  html +=
    '<div style="' + secHeri + '">' +
    '<div style="' + sub + '">' + e("heritage_label") + "</div>" +
    '<div style="' + tit + '">' + p("heritage_title") + "</div>" +
    '<table cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;margin-top:72px;"><tr>';
  for (let i = 1; i <= 3; i++) {
    const num = (product as unknown as Record<string, string>)["heritage_stat" + i + "_num"];
    const unit = (product as unknown as Record<string, string>)["heritage_stat" + i + "_unit"];
    const label = (product as unknown as Record<string, string>)["heritage_stat" + i + "_label"];
    html +=
      '<td style="text-align:center;padding:0 20px;vertical-align:top;"><div style="font-size:53px;font-weight:700;color:#6e5035;line-height:1.1;">' +
      escapeHtml(num) +
      '<span style="font-size:22px;color:#6e5035;margin-left:2px;">' +
      escapeHtml(unit) +
      "</span></div><div style=\"font-size:17px;color:#250a00;margin-top:8px;\">" +
      escapeHtml(label) +
      "</div></td>";
  }
  html +=
    "</tr></table>" +
    '<div style="' + txt + 'margin-top:72px;">' + p("heritage_body") + "</div>" +
    "</div>";

  // 8. Serving
  html +=
    '<div style="' + secW + '">' +
    '<div style="' + tit + '">' + p("serving_title") + "</div>" +
    '<div style="' + txt + 'margin-bottom:24px;">' + p("serving_subtitle") + "</div>" +
    '<div style="text-align:center;margin-bottom:24px;">' +
    cImg("serving_center_image", "180px") +
    "</div>" +
    '<table cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;margin-top:63px;"><tr>';
  for (let i = 1; i <= 5; i++) {
    const t = (product as unknown as Record<string, string>)["serving_" + i + "_title"];
    if (!t) continue;
    const desc = (product as unknown as Record<string, string>)["serving_" + i + "_desc"] || "";
    html +=
      '<td style="text-align:center;padding:0 12px;vertical-align:top;width:160px;">' +
      cImg("serving_" + i + "_image", "140px") +
      '<div style="font-size:17px;font-weight:700;margin-top:14px;color:#250a00;">' +
      escapeHtml(t) +
      "</div>" +
      '<div style="font-size:14px;color:#666;margin-top:6px;">' +
      nl2br(desc) +
      "</div></td>";
  }
  html +=
    "</tr></table>" +
    '<div style="' + txt +
    'margin-top:48px;text-decoration:underline;color:#6e5035;font-size:15px;">' +
    p("serving_tip") +
    "</div>" +
    "</div>";

  // 9. Strength
  html +=
    '<div style="' + secSand + '">' +
    '<div style="' + tit + '">' + p("strength_summary_title") + "</div>" +
    '<div style="font-size:18px;font-weight:600;color:#555;text-align:center;">' +
    p("strength_quote") +
    "</div>" +
    '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:24px;margin-top:72px;margin-bottom:72px;max-width:520px;margin-left:auto;margin-right:auto;">';
  for (let i = 1; i <= 5; i++) {
    const main = (product as unknown as Record<string, string>)["strength_circle" + i + "_main"];
    const subv = (product as unknown as Record<string, string>)["strength_circle" + i + "_sub"];
    html +=
      '<div style="width:140px;height:140px;border-radius:50%;background:#250a00;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;"><div style="font-size:28px;font-weight:700;color:#fcfaf8;line-height:1.2;">' +
      escapeHtml(main) +
      '</div><div style="font-size:14px;color:rgba(252,250,248,0.7);margin-top:4px;">' +
      escapeHtml(subv) +
      "</div></div>";
  }
  html += "</div>";
  for (let i = 1; i <= 5; i++) {
    const t = (product as unknown as Record<string, string>)["strength" + i + "_title"];
    const d = (product as unknown as Record<string, string>)["strength" + i + "_desc"];
    if (!t && !d) continue;
    const imgHtml = cImg("strength" + i + "_image", "auto");
    const imgBlock = imgHtml
      ? '<div style="width:100%;overflow:hidden;border-radius:12px;background:#c9bcbe;">' +
        imgHtml +
        "</div>"
      : "";
    html +=
      '<div style="margin-top:0;">' +
      imgBlock +
      '<div style="padding:12px 24px 28px;text-align:left;">' +
      '<div style="font-size:13px;font-weight:600;color:#6e5035;margin-bottom:4px;letter-spacing:0.5px;">' +
      i +
      "</div>" +
      '<div style="font-size:20px;font-weight:700;margin-bottom:4px;color:#250a00;line-height:1.2;">' +
      escapeHtml(t) +
      "</div>" +
      '<div style="font-size:15px;color:#555;line-height:1.35;">' +
      nl2br(d) +
      "</div>" +
      "</div>" +
      "</div>";
  }
  html += "</div>";

  // 10. Reveal
  html +=
    '<div style="' + secW + '">' +
    cImg("reveal_image", "300px") +
    '<div style="font-size:26px;font-weight:700;margin:24px 0 14px;text-align:center;color:#250a00;">' +
    p("reveal_quote") +
    "</div>" +
    '<div style="' + txt + '">' + p("reveal_body") + "</div>" +
    "</div>";

  // 10-1. Gathering (풀와이드 5:4)
  if (cImg("gathering_image", "auto")) {
    html +=
      '<div style="width:100%;overflow:hidden;">' + cImg("gathering_image", "auto") + "</div>";
  }

  // 11. Review
  html +=
    '<div style="' + secRev + '">' +
    '<div style="' + tit + '">' + p("review_title") + "</div>" +
    '<div style="' + txt + 'margin-bottom:20px;">' + p("review_subtitle") + "</div>" +
    '<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:54px;width:680px;max-width:100%;">';
  for (let i = 1; i <= 7; i++) {
    const r = (product as unknown as Record<string, string>)["review_" + i];
    if (!r) continue;
    html +=
      '<tr><td style="padding:16px 0;border-bottom:1px solid #250a00;font-size:18px;color:#250a00;line-height:1.6;text-align:center;">"' +
      escapeHtml(r) +
      '"</td></tr>';
  }
  html += "</table></div>";

  // 12. QnA
  html +=
    '<div style="' + secW + '">' +
    '<div style="' + tit + '">' + p("qna_title") + "</div>" +
    '<div style="' + txt + 'margin-bottom:24px;">' + p("qna_subtitle") + "</div>" +
    '<table cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse;width:600px;">';
  for (let i = 1; i <= 3; i++) {
    const q = (product as unknown as Record<string, string>)["qna_q" + i];
    const a = (product as unknown as Record<string, string>)["qna_a" + i];
    if (!q) continue;
    html +=
      '<tr><td style="padding:18px 0;border-bottom:1px solid #c9bcbe;text-align:left;">' +
      '<div style="font-weight:700;margin-bottom:10px;color:#250a00;font-size:18px;">Q. ' +
      escapeHtml(q) +
      "</div>" +
      '<div style="color:#555;font-size:17px;line-height:1.6;">A. ' +
      nl2br(a) +
      "</div>" +
      "</td></tr>";
  }
  html += "</table></div>";

  // Ending Image
  if (cImg("ending_image", "auto")) {
    html +=
      '<div style="width:100%;overflow:hidden;">' + cImg("ending_image", "auto") + "</div>";
  }

  // 13. Info
  html +=
    '<div style="padding:40px 48px;text-align:left;background:#fcfaf8;">' +
    '<div style="font-size:15px;font-weight:700;color:#250a00;padding:14px 0;border-bottom:2px solid #250a00;">' +
    (e("info_제품명") || e("product_id")) +
    "</div>" +
    '<div style="display:grid;grid-template-columns:1fr 1fr;">';
  const halfKeys = ["제품명", "식품유형", "품목보고번호", "내용량", "내포장재질", "유통기한"];
  for (const k of halfKeys) {
    const val = (product as unknown as Record<string, string>)["info_" + k];
    if (!val) continue;
    html +=
      '<div style="display:flex;gap:16px;border-bottom:1px solid #c9bcbe;font-size:13px;line-height:1.6;padding:10px 0;"><div style="width:80px;flex-shrink:0;font-weight:600;color:#555;">' +
      k +
      '</div><div style="flex:1;color:#333;">' +
      escapeHtml(val) +
      "</div></div>";
  }
  const fullKeys = ["제조원", "소분원", "판매원"];
  for (const k of fullKeys) {
    const val = (product as unknown as Record<string, string>)["info_" + k];
    if (!val) continue;
    html +=
      '<div style="display:flex;gap:16px;border-bottom:1px solid #c9bcbe;font-size:13px;line-height:1.6;padding:10px 0;grid-column:1/-1;"><div style="width:80px;flex-shrink:0;font-weight:600;color:#555;">' +
      k +
      '</div><div style="flex:1;color:#333;">' +
      escapeHtml(val) +
      "</div></div>";
  }
  if ((product as unknown as Record<string, string>).info_원료명) {
    html +=
      '<div style="display:flex;gap:16px;border-bottom:1px solid #c9bcbe;font-size:13px;line-height:1.6;padding:10px 0;grid-column:1/-1;"><div style="width:80px;flex-shrink:0;font-weight:600;color:#555;">원료명</div><div style="flex:1;color:#333;">' +
      nl2br((product as unknown as Record<string, string>).info_원료명) +
      "</div></div>";
  }
  html += "</div>";

  if ((product as unknown as Record<string, string>).info_알레르기) {
    html +=
      '<div style="background:#250a00;color:#DDE94E;padding:12px 20px;font-size:13px;border-radius:4px;margin-top:16px;">알레르기 유발물질: ' +
      escapeHtml((product as unknown as Record<string, string>).info_알레르기) +
      "</div>";
  }
  if ((product as unknown as Record<string, string>).info_참고사항) {
    html +=
      '<div style="padding:8px 0;font-size:10px;color:#999;line-height:1.5;">' +
      escapeHtml((product as unknown as Record<string, string>).info_참고사항) +
      "</div>";
  }
  html += "</div>";

  // close wrap
  html += "</div>";

  return html;
}
