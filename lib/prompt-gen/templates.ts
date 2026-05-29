import { koToEn } from "./koen";
import { getProductStyle } from "./style-map";
import type { PromptContext, PromptInputs, StyleEntry, Template } from "./types";

/**
 * TEMPLATES + helpers — slunch-admin.html line 5577-5926 그대로 포팅.
 * 원본은 DOM/전역 변수에 의존했음. 여기선 PromptContext를 받는 factory로 감쌌고
 * 내부 클로저에서 ctx를 참조하므로 각 build() 본문은 원본과 거의 동일.
 */

export function parseIngredients(str: string): { name: string; pct: string | null }[] {
  const parts = str.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  return parts.map((p) => {
    const pctMatch = p.match(/(\d+(?:\.\d+)?)\s*%/);
    return {
      name: p.replace(/\s*\d+(?:\.\d+)?\s*%/, '').trim(),
      pct: pctMatch ? pctMatch[1] + '%' : null,
    };
  });
}

/** 통일된 라이팅(POPEYE magazine style) — 현재 직접 참조 안 하지만 보존 */
export const LIGHT =
  'direct on-camera flash, daylight-balanced 5600K true color, hard clean shadows, high contrast, bright whites, no warm cast, no color gel, clean editorial magazine look';

/**
 * Context에 바인딩된 헬퍼 + TEMPLATES를 만들어 반환.
 */
export function createTemplates(ctx: PromptContext): Record<string, Template> {
  const ko = (field: keyof PromptInputs): string => ctx.inputs[field] || '';
  const en = (field: keyof PromptInputs): string => koToEn(ctx.inputs[field] || '');

  const _style = (): StyleEntry | null => getProductStyle(ctx.fob);

  function buildIngredientVisualDesc(): string {
    if (!ctx.fob || !ctx.fob.keyIngredients) return '';
    const ings = parseIngredients(ctx.fob.keyIngredients);
    const ranks = [
      'prominently visible, largest portion, front and center',
      'clearly visible, significant portion',
      'visible, moderate portion',
      'subtle accent, small scattered bits',
      'hint of, barely visible trace',
    ];
    return ings
      .map((ing, i) => `${ranks[Math.min(i, ranks.length - 1)]} ${ing.name}`)
      .join(', ');
  }

  function getFoodName(): string {
    if (ctx.fob) return ctx.fob.nameEn;
    if (ctx.product) return koToEn(ctx.product.product_id);
    return 'food dish';
  }

  function getFoodVisual(): string {
    // Priority: fob foodVisual > inputs.foodDesc > fob feature > fallback
    if (ctx.fob && ctx.fob.foodVisual) return ctx.fob.foodVisual;
    if (ctx.inputs.foodDesc) return ctx.inputs.foodDesc;
    if (ctx.fob && ctx.fob.feature) return ctx.fob.feature.toLowerCase();
    return 'appetizing food texture';
  }

  function getPackaging(): string {
    if (ctx.fob && ctx.fob.packaging) return ctx.fob.packaging;
    return 'sealed food package with printed label';
  }

  function getEatingTool(): string {
    const s = _style();
    return (
      s?.eatingTool ||
      en('utensil').replace(' only', '').replace(' excluded', '') ||
      'fingers'
    );
  }

  function getLiftTool(): string {
    const s = _style();
    return (
      s?.liftTool ||
      en('utensil').replace(' only', '').replace(' excluded', '') ||
      'fork'
    );
  }

  // 사용 안 하지만 의도 보존 (slunch-admin.html에 정의돼 있음)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getEatingAction(): string {
    const s = _style();
    if (s?.eatingAction) return s.eatingAction;
    const tool = getEatingTool();
    const food = getFoodName();
    if (tool === 'chopsticks') return `chopsticks picking up a piece of ${food}`;
    if (tool === 'fork' || tool === 'dessert fork') return `fork piercing a piece of ${food}`;
    if (tool === 'spoon') return `spoon scooping a portion of ${food}`;
    if (tool === 'bare hand' || tool === 'hand') return `hand picking up a piece of ${food}`;
    return `${tool} picking up a piece of ${food}`;
  }

  function getLiftAction(): string {
    const s = _style();
    if (s?.liftAction) return s.liftAction;
    const tool = getLiftTool();
    const food = getFoodName();
    return `${tool} lifting a piece of ${food} above the bowl, sauce dripping`;
  }

  // 사용 안 하지만 의도 보존
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getCookAction(): string {
    const s = _style();
    if (s?.cookAction) return s.cookAction;
    const food = getFoodName();
    return `hands actively mixing ${food} ingredients in a large stainless steel bowl, mid-motion`;
  }

  const TEMPLATES: Record<string, Template> = {
    hero: {
      label: 'HERO — 크레이빙 클로즈업',
      type: 'hero',
      target: '① 영웅 이미지 (hero_image)',
      sref: true,
      refNote: '완성된 음식 사진 1장을 --sref로 첨부',
      buildKo: () =>
        `${getFoodName()} 극단적 클로즈업, ${ko('plate')}에 담긴 모습, ${ko('garnish')} 토핑, ${ko('bgColor')} 컬러 테이블, 직광 하드라이트, 강한 그림자, 매거진 무드, 4:5 세로`,
      build: () => {
        const food = getFoodName();
        return `editorial food magazine extreme close-up of ${food}, ${getFoodVisual()}, bold ${en('bgColor')} colored surface, ${en('plate')}, ${en('garnish')} on top, direct flash hard light with strong shadows, saturated colors, POPEYE magazine style, clean minimal composition --no people hands face text logo watermark --ar 4:5 --s 250`;
      },
    },

    dish: {
      label: 'DISH AERIAL — 디쉬 항공샷 90°',
      type: 'dish',
      target: '③ 디쉬 항공샷 (feature_image)',
      sref: true,
      refNote: '완성된 음식 사진 1장을 --sref로 첨부',
      buildKo: () =>
        `${getFoodName()} 90도 항공샷, ${ko('plate')} 가운데, ${ko('garnish')}, ${ko('bgColor')} 표면, 젓가락/수저 + 작은 종지 + 음료컵 + 양념 소품 배치, 직광 플래시, 4:5 세로`,
      build: () => {
        const food = getFoodName();
        const tool = getEatingTool();
        return `90-degree flat lay overhead shot, ${food} centered on ${en('plate')}, ${getFoodVisual()}, ${en('garnish')}, ${tool} resting on plate edge, ${en('bgColor')} surface, small side dishes and condiment bowls around the plate, colored drinking glass, decorative props (flower vase or napkin), direct flash hard light, vibrant editorial food photography --no people hands face text --ar 4:5 --s 200`;
      },
    },

    cooking: {
      label: 'COOKING — 조리공정',
      type: 'cooking',
      target: '④ 조리공정 (process_image)',
      sref: false,
      refNote: '조리 중 사진이 있으면 --sref로 첨부',
      buildKo: () =>
        `${getFoodName()} 조리 과정, ${ko('bgColor')} 배경, 흰 니트릴 장갑, 스테인리스 보울, 재료 보이게, 밝고 즐거운 분위기, 4:5 세로`,
      build: () => {
        const food = getFoodName();
        return `joyful cooking process, hands in white nitrile gloves preparing ${food}, stainless steel bowls with raw ingredients around, ${en('bgColor')} surface, bright warm natural lighting, cheerful appetizing atmosphere, editorial food photography --no face body logo text --ar 4:5 --s 200`;
      },
    },

    ingredientBanner: {
      label: 'INGREDIENT BANNER — 재료 조각 스틸라이프',
      type: 'ingredient',
      target: '⑤ 재료배너 (ingredient_image)',
      sref: false,
      refNote: '없이 생성 가능',
      buildKo: () => {
        const ings = ctx.fob ? parseIngredients(ctx.fob.keyIngredients) : [];
        const ingKo = ings.map((i) => i.name).join(', ') || _style()?.ingredients || '원재료';
        return `${ingKo} 조각처럼 쌓아올리기, ${ko('bgColor')} 단색 배경, 불안정한 밸런싱 구도, 자연광 소프트 그림자, 4:5 세로`;
      },
      build: () => {
        const ings = ctx.fob ? parseIngredients(ctx.fob.keyIngredients) : [];
        const ingNames = ings.map((i) => i.name).join(', ') || _style()?.ingredients || 'raw ingredients';
        return `artistic sculptural still life of raw unprocessed ingredients only, stacked and balanced precariously: ${ingNames}, whole vegetables and spices and grains in their natural raw form, various sizes and textures piled like an abstract sculpture, seamless solid ${en('bgColor')} background filling the entire frame, no wall no floor line no horizon, soft directional natural light, gentle shadows, editorial art photography, delicate tension in composition --no plate bowl text hands people cooked-food kimchi fermented pickled processed wall curtain window table-edge horizon --ar 5:3 --s 300`;
      },
    },

    ingredientGrid: {
      label: 'INGREDIENT GRID — 재료 상세 3×3',
      type: 'ingredient',
      target: '⑤ 재료상세 (ingredient_detail_image)',
      sref: false,
      refNote: '없이 생성 가능',
      buildKo: () => {
        const ings = ctx.fob ? parseIngredients(ctx.fob.keyIngredients) : [];
        const ingKo = ings.map((i) => i.name).join(', ') || _style()?.ingredients || '원재료';
        return `${getFoodName()} 재료 3×3 그리드, 각 칸 다른 컬러 배경 (머스타드·모브·틸·테라코타 등), 원재료 1종씩: ${ingKo}, 오버헤드, 1:1 정사각`;
      },
      build: () => {
        const food = getFoodName();
        const ings = ctx.fob ? parseIngredients(ctx.fob.keyIngredients) : [];
        const ingNames = ings.map((i) => i.name).join(', ') || _style()?.ingredients || 'raw ingredients';
        return `3x3 ingredient grid layout, each cell one raw ingredient for ${food}: ${ingNames}, each on different rich solid color background (mustard, mauve, teal, terracotta, slate blue, sage, burgundy, peach, dusty rose), overhead shot per cell, solids placed directly on the surface, liquids only in a small round ceramic dish, minimal one item per cell, clean sculptural arrangement, editorial food magazine style --no cooked-food paper wrapping tissue bottle jar utensils people text --ar 1:1 --s 250`;
      },
    },

    servingBanner: {
      label: 'SERVING BANNER — 누끼 리프트샷',
      type: 'serving',
      target: '⑧ 섭취 방법 (serving_center_image)',
      sref: true,
      refNote: '완성된 음식 사진 1장을 --sref로 첨부',
      buildKo: () =>
        `${getFoodName()} 누끼, 순백 배경, ${ko('plate')}에 담긴 음식에서 ${ko('utensil')}로 한입 집어올린 순간, 소스 또는 치즈 늘어짐, 식욕 자극 클로즈업, 1:1 정사각`,
      build: () => {
        const food = getFoodName();
        const tool = getLiftTool();
        const action = getLiftAction();
        return `product cutout photo on pure white background, ${en('plate')} filled with ${food}, ${getFoodVisual()}, ${action}, one bite-sized portion lifted above the dish by ${tool}, sauce dripping or cheese stretching, sharp focus on lifted piece with shallow depth of field on bowl below, clean commercial food photography, bright even studio lighting --no shadow background-color people face text --ar 5:3 --s 250`;
      },
    },

    servingThumb1: {
      label: 'SERVING THUMB ① 핸드헬드',
      type: 'eating',
      target: '⑧ 섭취 방법 (serving_1_image)',
      sref: true,
      buildKo: () =>
        `손으로 ${ko('plate')} 들고 있는 캐주얼 라이프스타일, ${ko('bgColor')} 배경, 식기 걸쳐놓기, 1:1`,
      build: () => {
        const food = getFoodName();
        const tool = getEatingTool();
        return `lifestyle food photo, hand holding ${en('plate')} filled with ${food}, ${getFoodVisual()}, ${tool} resting on rim of bowl, ${en('bgColor')} solid color background, casual relaxed pose, bright editorial lighting, slight upward angle --no face full-body --ar 1:1 --s 200`;
      },
    },

    servingThumb2: {
      label: 'SERVING THUMB ② 젓가락 누끼',
      type: 'eating',
      target: '⑧ 섭취 방법 (serving_2_image)',
      sref: true,
      buildKo: () => {
        const s = _style();
        const dipDesc = s?.altDipAction ? '청양마요 디핑' : '소스 흘러내림';
        return `단색 ${ko('bgColor')} 배경, ${ko('utensil')}에 한입 찍어올림, ${dipDesc}, 음식만 포커스, 1:1`;
      },
      build: () => {
        const food = getFoodName();
        const tool = getEatingTool();
        const s = _style();
        const dipAction = s?.altDipAction || 'sauce or glaze dripping down';
        return `close-up food cutout, ${tool} holding one bite-sized piece of ${food}, ${getFoodVisual()}, ${dipAction}, solid ${en('bgColor')} background, sharp focus on food, clean commercial product style, studio lighting --no plate bowl people hands face --ar 1:1 --s 250`;
      },
    },

    servingThumb3: {
      label: 'SERVING THUMB ③ 매크로 텍스처',
      type: 'eating',
      target: '⑧ 섭취 방법 (serving_3_image)',
      sref: true,
      buildKo: () =>
        `극접사, ${ko('utensil')}이 음식 질감 파고드는 순간, 달걀·소스 터짐, 텍스처 강조, 1:1`,
      build: () => {
        const food = getFoodName();
        const tool = getEatingTool();
        return `extreme macro close-up, ${tool} pressing into ${food}, ${getFoodVisual()}, texture breaking apart, egg yolk bursting or sauce oozing or cheese melting on contact, filling entire frame, shallow depth of field, direct flash hard light, POPEYE magazine style --no people face hands full-body --ar 1:1 --s 300`;
      },
    },

    servingThumb4: {
      label: 'SERVING THUMB ④ 치즈 풀',
      type: 'eating',
      target: '⑧ 섭취 방법 (serving_4_image)',
      sref: true,
      buildKo: () => {
        const s = _style();
        const pullDesc = s?.pullAction ? s.pullAction.substring(0, 30) + '...' : '소스/치즈 늘어짐';
        return `${ko('utensil')}로 들어올릴 때 ${pullDesc}, ${ko('bgColor')} 배경, 1:1`;
      },
      build: () => {
        const food = getFoodName();
        const tool = getEatingTool();
        const s = _style();
        const pull = s?.pullAction || 'melted cheese stretching in long golden strands between the piece and the plate';
        return `dramatic food pull shot, ${tool} lifting ${food} high above ${en('plate')}, ${getFoodVisual()}, ${pull}, vibrant ${en('bgColor')} background, bold saturated colors, frozen mid-action, editorial food commercial style --no people face --ar 1:1 --s 250`;
      },
    },

    servingThumb5: {
      label: 'SERVING THUMB ⑤ 캐주얼 다이닝',
      type: 'eating',
      target: '⑧ 섭취 방법 (serving_5_image)',
      sref: true,
      buildKo: () =>
        `밝은 ${ko('bgColor')} 배경, ${ko('plate')}에 담긴 ${getFoodName()}, 손으로 직접 집어먹는 친밀한 순간, 밝고 즐거운 분위기, 1:1`,
      build: () => {
        const food = getFoodName();
        return `bright casual dining scene, hand reaching to pick up ${food} from ${en('plate')}, ${getFoodVisual()}, ${en('bgColor')} surface, bright warm natural lighting, cheerful relaxed atmosphere, editorial food photography --no face full-body dark-light --ar 1:1 --s 200`;
      },
    },

    reveal: {
      label: 'REVEAL — 시그니처 리빌',
      type: 'reveal',
      target: '⑩ 리빌 메시지 (reveal_image)',
      sref: true,
      refNote: '음식+패키지 사진 1장을 --sref로 첨부',
      buildKo: () =>
        `${getPackaging()} 2개 중앙 세워놓기, 주변에 ${getFoodName()} 담긴 ${ko('plate')}·원재료·소품(천·유리잔) 풍성하게 배치, ${ko('bgColor')} 컬러 벽 + 크림 바닥 투톤 배경, 밝은 스튜디오, 4:5 세로`,
      build: () => {
        const food = getFoodName();
        return `commercial product hero shot, two ${getPackaging()} standing upright side by side in center, surrounded by ${en('plate')} filled with ${food}, ${getFoodVisual()}, scattered food pieces and raw ingredients on surface, small bowls and props (cloth napkin, glass pitcher, nuts) arranged decoratively around packages, ${en('bgColor')} color-blocked wall background with cream white surface, bright clean studio lighting, warm inviting commercial food photography composition --no people hands face text --ar 5:3 --s 300`;
      },
    },

    ending: {
      label: 'ENDING — 제품 엔딩샷',
      type: 'package',
      target: '⑬ 제품 정보 (ending_image)',
      sref: true,
      refNote: '패키지 사진 1장을 --sref로 첨부',
      buildKo: () =>
        `${ko('bgColor')} 단색 배경, 바닥에 ${getPackaging()}·${getFoodName()}·원재료 풍성하게 쌓아놓기, 오른쪽에서 아시안 여자 손이 들어와 제품이나 음식 하나 들고있음, 밝은 스튜디오, 4:5 세로`,
      build: () => {
        const food = getFoodName();
        const ings = ctx.fob ? parseIngredients(ctx.fob.keyIngredients) : [];
        const ingNames = ings.map((i) => i.name).join(', ') || _style()?.ingredients || 'raw ingredients';
        return `commercial product hero composition on solid ${en('bgColor')} background, pile of ${getPackaging()}, ${en('plate')} with ${food}, ${getFoodVisual()}, raw ingredients (${ingNames}) and small props scattered and stacked together on the surface, Asian woman hand entering from the right side holding a piece of food or the product, bright clean studio lighting, editorial food photography, playful abundant composition --no face body full-body text --ar 4:5 --s 250`;
      },
    },

    sharing: {
      label: 'SHARING — 함께 나눠먹기',
      type: 'serving',
      target: '⑧ 섭취 방법 (sharing_image)',
      sref: true,
      buildKo: () =>
        `${ko('bgColor')} 테이블 위 두 사람이 ${getFoodName()} 나눠먹는 장면, ${ko('plate')}·음료·소품 배치, 위에서 내려다보는 항공샷, 따뜻하고 즐거운 분위기, 2:1 가로`,
      build: () => {
        const food = getFoodName();
        return `overhead lifestyle dining photo, two people sharing ${food} at a ${en('bgColor')} table, ${en('plate')} with ${food} in center, ${getFoodVisual()}, hands reaching for food with ${getEatingTool()}, drinks and small side dishes around, warm natural sunlight, joyful casual atmosphere, editorial food photography --no logo text watermark --ar 5:3 --s 200`;
      },
    },

    gathering: {
      label: 'GATHERING — 다같이 모여먹기',
      type: 'serving',
      target: '⑧ 섭취 방법 (gathering_image)',
      sref: true,
      buildKo: () =>
        `밝고 화사한 분위기, 여러 명이 ${ko('bgColor')} 테이블에 둘러앉아 ${getFoodName()} 먹으며 즐거워하는 장면, 어울리는 음료와 소품, 항공샷, 4:5 세로`,
      build: () => {
        const food = getFoodName();
        return `bright joyful gathering scene shot from above, group of friends sitting around a ${en('bgColor')} table, ${en('plate')} with ${food} in the center, ${getFoodVisual()}, everyone eating ${food} with ${getEatingTool()} and drinking matching beverages, small side dishes and colorful drinks scattered on table, bright warm natural sunlight flooding the scene, cheerful laughing expressions, vibrant saturated colors, editorial lifestyle food photography --no dark-lighting moody logo text watermark --ar 4:5 --s 200`;
      },
    },
  };

  return TEMPLATES;
}

/** --oref 가중치 매핑 (slunch-admin.html line 5969-5970 그대로) */
export const OREF_PKG_OW: Record<string, number> = {
  servingBanner: 500,
  ending: 600,
};
export const OREF_FOOD_OW: Record<string, number> = {
  hero: 500,
  dish: 500,
  servingThumb1: 400,
  servingThumb2: 400,
  servingThumb3: 400,
  servingThumb4: 400,
  servingThumb5: 400,
  reveal: 400,
  sharing: 400,
  gathering: 400,
};
