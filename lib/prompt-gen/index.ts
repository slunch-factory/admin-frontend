import type { FobData, PromptContext, ShotPrompt } from "./types";
import type { StoreProduct } from "@/types/product";
import { getProductStyle } from "./style-map";
import { createTemplates, OREF_FOOD_OW, OREF_PKG_OW } from "./templates";
import { SHOTS } from "./shots";

export { KO_EN, koToEn } from "./koen";
export { PRODUCT_STYLE_MAP, getProductStyle } from "./style-map";
export { SHOTS } from "./shots";
export { createTemplates, parseIngredients, LIGHT } from "./templates";
export type {
  FobData,
  PromptInputs,
  PromptContext,
  StyleEntry,
  ShotMeta,
  Template,
  ShotPrompt,
} from "./types";

/**
 * 프롬프트 생성 진입점.
 * slunch-admin.html generateAll() 의 핵심 로직 그대로 포팅 (DOM/토스트 부분 제외).
 */
export function generatePrompts(ctx: PromptContext, activeShots: string[]): ShotPrompt[] {
  const TEMPLATES = createTemplates(ctx);
  const orefFoodUrl = (ctx.inputs.orefFood || '').trim();
  const orefPkgUrl = (ctx.inputs.orefPackage || '').trim();

  const result: ShotPrompt[] = [];

  for (const shotKey of activeShots) {
    const tmpl = TEMPLATES[shotKey];
    if (!tmpl) continue;

    let prompt = tmpl.build();
    let orefApplied: string | undefined;

    // package-type cuts → pkg URL
    const owPkg = OREF_PKG_OW[shotKey];
    if (owPkg && orefPkgUrl) {
      prompt += ` --oref ${orefPkgUrl} --ow ${owPkg}`;
      orefApplied = orefPkgUrl;
    }
    // food-type cuts → food URL
    const owFood = OREF_FOOD_OW[shotKey];
    if (owFood && orefFoodUrl) {
      prompt += ` --oref ${orefFoodUrl} --ow ${owFood}`;
      orefApplied = orefFoodUrl;
    }

    result.push({
      key: shotKey,
      label: tmpl.label,
      type: tmpl.type,
      target: tmpl.target,
      sref: !!tmpl.sref,
      refNote: tmpl.refNote || '',
      prompt,
      koDesc: tmpl.buildKo ? tmpl.buildKo() : '',
      orefApplied,
    });
  }

  return result;
}

/**
 * StoreProduct.product_id 기반으로 FobData 후보 매칭.
 * "슬런치 김치칼국수 밀키트(3인분)" ↔ FOB nameKr "비건 김치칼국수 밀키트(3인분)" 같은
 * 케이스를 잡기 위해 양쪽 정규화 후 substring 양방향 매칭.
 */
export function matchFob(product: StoreProduct | null, fobs: FobData[]): FobData | null {
  if (!product) return null;
  const norm = (s: string) =>
    s
      .replace(/\s*\(.*?\)/g, '')
      .replace(/^(슬런치|비건)\s+/, '')
      .trim();
  const pn = norm(product.product_id);
  for (const f of fobs) {
    const fn = norm(f.nameKr);
    if (!pn || !fn) continue;
    if (pn === fn || pn.includes(fn) || fn.includes(pn)) return f;
  }
  return null;
}

/** PRODUCT_STYLE_MAP에서 매칭된 스타일을 PromptInputs 기본값으로 변환. */
export function inputsFromStyle(fob: FobData | null): {
  plate: string;
  garnish: string;
  bgColor: string;
  utensil: string;
  wallColor: string;
  foodDesc: string;
  orefFood: string;
  orefPackage: string;
} {
  const s = getProductStyle(fob);
  return {
    plate: s?.plate || '',
    garnish: s?.garnish || '',
    bgColor: s?.bgColor || '',
    utensil: s?.utensil || '',
    wallColor: s?.wallColor || '',
    foodDesc: s?.foodDesc || '',
    orefFood: s?.orefFood || '',
    orefPackage: s?.orefPackage || '',
  };
}

export { SHOTS as DEFAULT_SHOTS };
