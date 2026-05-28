import type { StoreProduct } from "@/types/product";

type FieldType = "text" | "textarea" | "image";

export type FieldDef = {
  key: keyof StoreProduct;
  label: string;
  labelEn: string;
  type: FieldType;
};

export type SectionDef = {
  id: string;
  title: string;
  fields: FieldDef[];
};

/**
 * Field grouping for the store-detail edit form.
 *
 * The preview renders `feature_image` as the **dish aerial** that sits
 * directly below the hero image — so we group it with the hero fields,
 * not with the "특징" section. (Per the original HTML preview comment
 * "제품 특징 — 이미지는 ①에 포함".)
 */
export const STORE_SECTIONS: SectionDef[] = [
  {
    id: "hero",
    title: "① 히어로 + 디쉬샷",
    fields: [
      { key: "hero_image", label: "히어로 이미지", labelEn: "HERO IMAGE", type: "image" },
      { key: "feature_image", label: "디쉬 항공샷 이미지", labelEn: "FEATURE IMAGE", type: "image" },
      { key: "hero_title", label: "히어로 타이틀", labelEn: "HERO TITLE", type: "text" },
      { key: "hero_desc", label: "히어로 설명", labelEn: "HERO DESC", type: "textarea" },
    ],
  },
  {
    id: "intro",
    title: "② 제품 소개",
    fields: [
      { key: "intro_label", label: "라벨", labelEn: "INTRO LABEL", type: "text" },
      { key: "intro_title", label: "타이틀", labelEn: "INTRO TITLE", type: "text" },
      { key: "intro_body", label: "본문", labelEn: "INTRO BODY", type: "textarea" },
    ],
  },
  {
    id: "feature",
    title: "③ 제품 특징",
    fields: [
      { key: "feature_title", label: "타이틀", labelEn: "FEATURE TITLE", type: "text" },
      { key: "feature_body", label: "본문", labelEn: "FEATURE BODY", type: "textarea" },
    ],
  },
  {
    id: "process",
    title: "④ 제조 공정",
    fields: [
      { key: "process_image", label: "공정 이미지", labelEn: "PROCESS IMAGE", type: "image" },
      { key: "process_title", label: "타이틀", labelEn: "PROCESS TITLE", type: "text" },
      { key: "process_body", label: "본문", labelEn: "PROCESS BODY", type: "textarea" },
      { key: "process_1", label: "공정 1", labelEn: "STEP 1", type: "text" },
      { key: "process_2", label: "공정 2", labelEn: "STEP 2", type: "text" },
      { key: "process_3", label: "공정 3", labelEn: "STEP 3", type: "text" },
      { key: "process_4", label: "공정 4", labelEn: "STEP 4", type: "text" },
      { key: "process_5", label: "공정 5", labelEn: "STEP 5", type: "text" },
    ],
  },
  {
    id: "ingredient",
    title: "⑤ 원재료",
    fields: [
      { key: "ingredient_image", label: "재료 이미지", labelEn: "INGREDIENT IMAGE", type: "image" },
      { key: "ingredient_detail_image", label: "재료 상세 이미지", labelEn: "INGREDIENT DETAIL IMAGE", type: "image" },
      { key: "ingredient_title", label: "타이틀", labelEn: "INGREDIENT TITLE", type: "text" },
      { key: "ingredient_body", label: "본문", labelEn: "INGREDIENT BODY", type: "textarea" },
    ],
  },
  {
    id: "cert",
    title: "⑥ 인증",
    fields: [
      { key: "cert_image", label: "메인 이미지", labelEn: "CERT IMAGE", type: "image" },
      { key: "cert_title", label: "타이틀", labelEn: "CERT TITLE", type: "text" },
      { key: "cert_subtitle", label: "서브타이틀", labelEn: "CERT SUBTITLE", type: "text" },
      { key: "cert_body", label: "본문", labelEn: "CERT BODY", type: "textarea" },
      { key: "cert_1_icon", label: "인증 1 아이콘", labelEn: "CERT 1 ICON", type: "image" },
      { key: "cert_1_title", label: "인증 1 제목", labelEn: "CERT 1 TITLE", type: "text" },
      { key: "cert_1_desc", label: "인증 1 설명", labelEn: "CERT 1 DESC", type: "text" },
      { key: "cert_2_icon", label: "인증 2 아이콘", labelEn: "CERT 2 ICON", type: "image" },
      { key: "cert_2_title", label: "인증 2 제목", labelEn: "CERT 2 TITLE", type: "text" },
      { key: "cert_2_desc", label: "인증 2 설명", labelEn: "CERT 2 DESC", type: "text" },
      { key: "cert_3_icon", label: "인증 3 아이콘", labelEn: "CERT 3 ICON", type: "image" },
      { key: "cert_3_title", label: "인증 3 제목", labelEn: "CERT 3 TITLE", type: "text" },
      { key: "cert_3_desc", label: "인증 3 설명", labelEn: "CERT 3 DESC", type: "text" },
      { key: "cert_4_icon", label: "인증 4 아이콘", labelEn: "CERT 4 ICON", type: "image" },
      { key: "cert_4_title", label: "인증 4 제목", labelEn: "CERT 4 TITLE", type: "text" },
      { key: "cert_4_desc", label: "인증 4 설명", labelEn: "CERT 4 DESC", type: "text" },
      { key: "cert_5_icon", label: "인증 5 아이콘", labelEn: "CERT 5 ICON", type: "image" },
      { key: "cert_5_title", label: "인증 5 제목", labelEn: "CERT 5 TITLE", type: "text" },
      { key: "cert_5_desc", label: "인증 5 설명", labelEn: "CERT 5 DESC", type: "text" },
    ],
  },
  {
    id: "heritage",
    title: "⑦ 헤리티지 (Brand Story)",
    fields: [
      { key: "heritage_image", label: "헤리티지 이미지", labelEn: "HERITAGE IMAGE", type: "image" },
      { key: "heritage_label", label: "라벨", labelEn: "HERITAGE LABEL", type: "text" },
      { key: "heritage_title", label: "타이틀", labelEn: "HERITAGE TITLE", type: "text" },
      { key: "heritage_body", label: "본문", labelEn: "HERITAGE BODY", type: "textarea" },
      { key: "heritage_stat1_num", label: "스탯 1 숫자", labelEn: "STAT 1 NUM", type: "text" },
      { key: "heritage_stat1_unit", label: "스탯 1 단위", labelEn: "STAT 1 UNIT", type: "text" },
      { key: "heritage_stat1_label", label: "스탯 1 라벨", labelEn: "STAT 1 LABEL", type: "text" },
      { key: "heritage_stat2_num", label: "스탯 2 숫자", labelEn: "STAT 2 NUM", type: "text" },
      { key: "heritage_stat2_unit", label: "스탯 2 단위", labelEn: "STAT 2 UNIT", type: "text" },
      { key: "heritage_stat2_label", label: "스탯 2 라벨", labelEn: "STAT 2 LABEL", type: "text" },
      { key: "heritage_stat3_num", label: "스탯 3 숫자", labelEn: "STAT 3 NUM", type: "text" },
      { key: "heritage_stat3_unit", label: "스탯 3 단위", labelEn: "STAT 3 UNIT", type: "text" },
      { key: "heritage_stat3_label", label: "스탯 3 라벨", labelEn: "STAT 3 LABEL", type: "text" },
    ],
  },
  {
    id: "serving",
    title: "⑧ 이렇게 드세요",
    fields: [
      { key: "serving_title", label: "타이틀", labelEn: "SERVING TITLE", type: "text" },
      { key: "serving_subtitle", label: "서브타이틀", labelEn: "SERVING SUBTITLE", type: "text" },
      { key: "serving_center_image", label: "센터 이미지", labelEn: "SERVING CENTER IMAGE", type: "image" },
      { key: "serving_1_image", label: "1 이미지", labelEn: "SERVING 1 IMAGE", type: "image" },
      { key: "serving_1_title", label: "1 제목", labelEn: "SERVING 1 TITLE", type: "text" },
      { key: "serving_1_desc", label: "1 설명", labelEn: "SERVING 1 DESC", type: "text" },
      { key: "serving_2_image", label: "2 이미지", labelEn: "SERVING 2 IMAGE", type: "image" },
      { key: "serving_2_title", label: "2 제목", labelEn: "SERVING 2 TITLE", type: "text" },
      { key: "serving_2_desc", label: "2 설명", labelEn: "SERVING 2 DESC", type: "text" },
      { key: "serving_3_image", label: "3 이미지", labelEn: "SERVING 3 IMAGE", type: "image" },
      { key: "serving_3_title", label: "3 제목", labelEn: "SERVING 3 TITLE", type: "text" },
      { key: "serving_3_desc", label: "3 설명", labelEn: "SERVING 3 DESC", type: "text" },
      { key: "serving_4_image", label: "4 이미지", labelEn: "SERVING 4 IMAGE", type: "image" },
      { key: "serving_4_title", label: "4 제목", labelEn: "SERVING 4 TITLE", type: "text" },
      { key: "serving_4_desc", label: "4 설명", labelEn: "SERVING 4 DESC", type: "text" },
      { key: "serving_5_image", label: "5 이미지", labelEn: "SERVING 5 IMAGE", type: "image" },
      { key: "serving_5_title", label: "5 제목", labelEn: "SERVING 5 TITLE", type: "text" },
      { key: "serving_5_desc", label: "5 설명", labelEn: "SERVING 5 DESC", type: "text" },
      { key: "serving_tip", label: "팁", labelEn: "SERVING TIP", type: "textarea" },
    ],
  },
  {
    id: "strength",
    title: "⑨ 특별한 점 5가지",
    fields: [
      { key: "strength_quote", label: "인용구", labelEn: "STRENGTH QUOTE", type: "textarea" },
      { key: "strength_summary_title", label: "요약 타이틀", labelEn: "STRENGTH SUMMARY TITLE", type: "text" },
      { key: "strength_circle1_main", label: "원 1 메인", labelEn: "CIRCLE 1 MAIN", type: "text" },
      { key: "strength_circle1_sub", label: "원 1 서브", labelEn: "CIRCLE 1 SUB", type: "text" },
      { key: "strength_circle2_main", label: "원 2 메인", labelEn: "CIRCLE 2 MAIN", type: "text" },
      { key: "strength_circle2_sub", label: "원 2 서브", labelEn: "CIRCLE 2 SUB", type: "text" },
      { key: "strength_circle3_main", label: "원 3 메인", labelEn: "CIRCLE 3 MAIN", type: "text" },
      { key: "strength_circle3_sub", label: "원 3 서브", labelEn: "CIRCLE 3 SUB", type: "text" },
      { key: "strength_circle4_main", label: "원 4 메인", labelEn: "CIRCLE 4 MAIN", type: "text" },
      { key: "strength_circle4_sub", label: "원 4 서브", labelEn: "CIRCLE 4 SUB", type: "text" },
      { key: "strength_circle5_main", label: "원 5 메인", labelEn: "CIRCLE 5 MAIN", type: "text" },
      { key: "strength_circle5_sub", label: "원 5 서브", labelEn: "CIRCLE 5 SUB", type: "text" },
      { key: "strength1_image", label: "1 이미지", labelEn: "STRENGTH 1 IMAGE", type: "image" },
      { key: "strength1_title", label: "1 제목", labelEn: "STRENGTH 1 TITLE", type: "text" },
      { key: "strength1_desc", label: "1 설명", labelEn: "STRENGTH 1 DESC", type: "textarea" },
      { key: "strength2_image", label: "2 이미지", labelEn: "STRENGTH 2 IMAGE", type: "image" },
      { key: "strength2_title", label: "2 제목", labelEn: "STRENGTH 2 TITLE", type: "text" },
      { key: "strength2_desc", label: "2 설명", labelEn: "STRENGTH 2 DESC", type: "textarea" },
      { key: "strength3_image", label: "3 이미지", labelEn: "STRENGTH 3 IMAGE", type: "image" },
      { key: "strength3_title", label: "3 제목", labelEn: "STRENGTH 3 TITLE", type: "text" },
      { key: "strength3_desc", label: "3 설명", labelEn: "STRENGTH 3 DESC", type: "textarea" },
      { key: "strength4_image", label: "4 이미지", labelEn: "STRENGTH 4 IMAGE", type: "image" },
      { key: "strength4_title", label: "4 제목", labelEn: "STRENGTH 4 TITLE", type: "text" },
      { key: "strength4_desc", label: "4 설명", labelEn: "STRENGTH 4 DESC", type: "textarea" },
      { key: "strength5_image", label: "5 이미지", labelEn: "STRENGTH 5 IMAGE", type: "image" },
      { key: "strength5_title", label: "5 제목", labelEn: "STRENGTH 5 TITLE", type: "text" },
      { key: "strength5_desc", label: "5 설명", labelEn: "STRENGTH 5 DESC", type: "textarea" },
    ],
  },
  {
    id: "reveal",
    title: "⑩ 리빌 (Reveal)",
    fields: [
      { key: "reveal_image", label: "리빌 이미지", labelEn: "REVEAL IMAGE", type: "image" },
      { key: "reveal_quote", label: "인용구", labelEn: "REVEAL QUOTE", type: "textarea" },
      { key: "reveal_body", label: "본문", labelEn: "REVEAL BODY", type: "textarea" },
      { key: "gathering_image", label: "Gathering 이미지", labelEn: "GATHERING IMAGE", type: "image" },
    ],
  },
  {
    id: "review",
    title: "⑪ 리뷰",
    fields: [
      { key: "review_title", label: "타이틀", labelEn: "REVIEW TITLE", type: "text" },
      { key: "review_subtitle", label: "서브타이틀", labelEn: "REVIEW SUBTITLE", type: "text" },
      { key: "review_1", label: "리뷰 1", labelEn: "REVIEW 1", type: "text" },
      { key: "review_2", label: "리뷰 2", labelEn: "REVIEW 2", type: "text" },
      { key: "review_3", label: "리뷰 3", labelEn: "REVIEW 3", type: "text" },
      { key: "review_4", label: "리뷰 4", labelEn: "REVIEW 4", type: "text" },
      { key: "review_5", label: "리뷰 5", labelEn: "REVIEW 5", type: "text" },
      { key: "review_6", label: "리뷰 6", labelEn: "REVIEW 6", type: "text" },
      { key: "review_7", label: "리뷰 7", labelEn: "REVIEW 7", type: "text" },
    ],
  },
  {
    id: "qna",
    title: "⑫ Q&A",
    fields: [
      { key: "qna_title", label: "타이틀", labelEn: "QNA TITLE", type: "text" },
      { key: "qna_subtitle", label: "서브타이틀", labelEn: "QNA SUBTITLE", type: "text" },
      { key: "qna_q1", label: "Q1", labelEn: "Q1", type: "text" },
      { key: "qna_a1", label: "A1", labelEn: "A1", type: "textarea" },
      { key: "qna_q2", label: "Q2", labelEn: "Q2", type: "text" },
      { key: "qna_a2", label: "A2", labelEn: "A2", type: "textarea" },
      { key: "qna_q3", label: "Q3", labelEn: "Q3", type: "text" },
      { key: "qna_a3", label: "A3", labelEn: "A3", type: "textarea" },
    ],
  },
  {
    id: "ending",
    title: "⑬ 엔딩 이미지",
    fields: [
      { key: "ending_image", label: "엔딩 이미지", labelEn: "ENDING IMAGE", type: "image" },
    ],
  },
  {
    id: "info",
    title: "식품 정보 (라벨)",
    fields: [
      { key: "info_제품명", label: "제품명", labelEn: "INFO 제품명", type: "text" },
      { key: "info_원료명", label: "원료명", labelEn: "INFO 원료명", type: "textarea" },
      { key: "info_식품유형", label: "식품유형", labelEn: "INFO 식품유형", type: "text" },
      { key: "info_내용량", label: "내용량", labelEn: "INFO 내용량", type: "text" },
      { key: "info_내포장재질", label: "내포장재질", labelEn: "INFO 내포장재질", type: "text" },
      { key: "info_품목보고번호", label: "품목보고번호", labelEn: "INFO 품목보고번호", type: "text" },
    ],
  },
];

export function getSectionsByType(filter: "text" | "image"): SectionDef[] {
  return STORE_SECTIONS.map((section) => ({
    ...section,
    fields: section.fields.filter((f) =>
      filter === "image" ? f.type === "image" : f.type !== "image",
    ),
  })).filter((s) => s.fields.length > 0);
}
