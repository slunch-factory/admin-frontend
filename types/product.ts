/**
 * Store product schema — text and image fields merged into one JSON.
 *
 * Field convention: `*_image` fields hold image URLs; all other fields are copy/text.
 * `last_edited_by` and `last_edited_at` are written on every PATCH/POST.
 */
export type StoreProduct = {
  product_id: string;

  // hero section
  hero_image: string;
  hero_title: string;
  hero_desc: string;

  // intro
  intro_label: string;
  intro_title: string;
  intro_body: string;

  // feature
  feature_image: string;
  feature_title: string;
  feature_body: string;

  // ingredient
  ingredient_image: string;
  ingredient_detail_image: string;
  ingredient_title: string;
  ingredient_body: string;

  // process
  process_image: string;
  process_title: string;
  process_body: string;
  process_1: string;
  process_2: string;
  process_3: string;
  process_4: string;
  process_5: string;

  // certifications
  cert_title: string;
  cert_subtitle: string;
  cert_body: string;
  cert_image: string;
  cert_1_icon: string; cert_1_title: string; cert_1_desc: string;
  cert_2_icon: string; cert_2_title: string; cert_2_desc: string;
  cert_3_icon: string; cert_3_title: string; cert_3_desc: string;
  cert_4_icon: string; cert_4_title: string; cert_4_desc: string;
  cert_5_icon: string; cert_5_title: string; cert_5_desc: string;

  // heritage
  heritage_image: string;
  heritage_label: string;
  heritage_title: string;
  heritage_stat1_num: string; heritage_stat1_unit: string; heritage_stat1_label: string;
  heritage_stat2_num: string; heritage_stat2_unit: string; heritage_stat2_label: string;
  heritage_stat3_num: string; heritage_stat3_unit: string; heritage_stat3_label: string;
  heritage_body: string;

  // serving suggestions
  serving_title: string;
  serving_subtitle: string;
  serving_center_image: string;
  serving_1_image: string; serving_1_title: string; serving_1_desc: string;
  serving_2_image: string; serving_2_title: string; serving_2_desc: string;
  serving_3_image: string; serving_3_title: string; serving_3_desc: string;
  serving_4_image: string; serving_4_title: string; serving_4_desc: string;
  serving_5_image: string; serving_5_title: string; serving_5_desc: string;
  serving_tip: string;

  // strengths
  strength_quote: string;
  strength_summary_title: string;
  strength_circle1_main: string; strength_circle1_sub: string;
  strength_circle2_main: string; strength_circle2_sub: string;
  strength_circle3_main: string; strength_circle3_sub: string;
  strength_circle4_main: string; strength_circle4_sub: string;
  strength_circle5_main: string; strength_circle5_sub: string;
  strength1_image: string; strength1_title: string; strength1_desc: string;
  strength2_image: string; strength2_title: string; strength2_desc: string;
  strength3_image: string; strength3_title: string; strength3_desc: string;
  strength4_image: string; strength4_title: string; strength4_desc: string;
  strength5_image: string; strength5_title: string; strength5_desc: string;

  // reveal
  reveal_image: string;
  reveal_quote: string;
  reveal_body: string;

  // misc
  gathering_image: string;

  // reviews
  review_title: string;
  review_subtitle: string;
  review_1: string; review_2: string; review_3: string; review_4: string;
  review_5: string; review_6: string; review_7: string;

  // QnA
  qna_title: string;
  qna_subtitle: string;
  qna_q1: string; qna_a1: string;
  qna_q2: string; qna_a2: string;
  qna_q3: string; qna_a3: string;

  // ending
  ending_image: string;

  // 식품 정보 (label info)
  info_제품명: string;
  info_원료명: string;
  info_식품유형: string;
  info_내용량: string;
  info_내포장재질: string;
  info_품목보고번호: string;

  // audit
  last_edited_by?: string;
  last_edited_at?: string;
};

export type SubscribeSellingPoint = { title: string; desc: string };

export type SubscribeProduct = {
  id: number;
  code: string;
  name: string;
  tier: "PREMIUM" | "STANDARD" | string;
  diet: string;
  origin: string;
  cost: number;
  price: number;
  ingredients: string;
  tagline: string;
  description: string;
  selling_points: SubscribeSellingPoint[];
  nutrients: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    sodium: number;
  };
  allergens: string[];
  cooking_tip: string;
  hashtags: string;
  info_제품명: string;
  info_식품유형: string;
  info_품목보고번호: string;
  info_내용량: string;
  info_유통기한: string;
  info_제조원: string;
  info_소분원: string;
  info_판매원: string;
  info_원료명: string;
  info_알레르기: string;
  info_참고사항: string;
  image_url: string;
  detail_url: string;

  // audit
  last_edited_by?: string;
  last_edited_at?: string;
};
