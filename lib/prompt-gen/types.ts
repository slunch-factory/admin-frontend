import type { StoreProduct } from "@/types/product";

/** slunch-admin.html DEFAULT_ALL_PRODUCTS에서 추출한 FOB 메타데이터 */
export interface FobData {
  nameKr: string;
  nameEn: string;
  category: string;
  categoryEn: string;
  keyIngredients: string;
  packaging: string;
  foodVisual: string;
  description: string;
  feature?: string;
}

/** 사용자가 폼에서 직접 입력하는 한글 스타일 키워드 */
export interface PromptInputs {
  plate: string;
  garnish: string;
  bgColor: string;
  utensil: string;
  wallColor?: string;
  foodDesc?: string;
  orefFood?: string;
  orefPackage?: string;
}

export interface PromptContext {
  product: StoreProduct | null;
  fob: FobData | null;
  inputs: PromptInputs;
}

/** PRODUCT_STYLE_MAP 의 한 항목 */
export interface StyleEntry {
  match: (fob: FobData) => boolean;
  plate?: string;
  utensil?: string;
  noUtensil?: string;
  garnish?: string;
  noGarnish?: string;
  bgColor?: string;
  wallColor?: string;
  foodDesc?: string;
  eatingTool?: string;
  eatingAction?: string;
  liftTool?: string;
  liftAction?: string;
  cookAction?: string;
  ingredients?: string;
  pullAction?: string;
  altDipAction?: string;
  orefFood?: string;
  orefPackage?: string;
}

/** SHOTS 의 한 항목 (UI 메타) */
export interface ShotMeta {
  id: string;
  name: string;
  type: string;
  purpose: string;
  maps: string;
  default: boolean;
}

/** TEMPLATES 의 한 항목 (프롬프트 빌더) */
export interface Template {
  label: string;
  type: string;
  target: string;
  sref: boolean;
  refNote?: string;
  buildKo: () => string;
  build: () => string;
}

/** 최종 출력 — 사용자 화면에 표시하고 복사할 단위 */
export interface ShotPrompt {
  key: string;
  label: string;
  type: string;
  target: string;
  sref: boolean;
  refNote: string;
  prompt: string;
  koDesc: string;
  orefApplied?: string;
}
