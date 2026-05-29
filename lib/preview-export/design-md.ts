/**
 * slunch-admin.html renderDesignMD() (line 4164-4253) 그대로 포팅.
 * 제품 데이터를 사용하지 않는 정적 디자인 시스템 문서.
 */
export const DESIGN_MD = `# 슬런치 제품 상세페이지 디자인 시스템

## 브랜드 정보
- **브랜드**: 슬런치 (SLUNCH)
- **카테고리**: 식품 (베이스 기반 식물성 제품)
- **스타일**: OH NUTTY

## 색상 팔레트
| 역할 | 색상코드 | 용도 |
|------|---------|------|
| Primary | #6e5035 | 메인 색상, 버튼, 강조 |
| Accent | #e6863f | 보조 강조, 호버 상태 |
| Background | #fcfaf8 | 페이지 배경 |
| Alt Sections | #e8e2e2 | 섹션 배경, 구분 |
| Border | #c9bcbe | 구분선, 테두리 |

## 타이포그래피
- **Font Family**: Pretendard
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **기본 폰트 크기**: 13px (body text)

## 레이아웃 구조
\`\`\`
13 Sections (이미지 순서 기준):
① Hero (hero_image, hero_title, hero_desc)
② Intro (intro_label, intro_title, intro_body)
③ Feature/Dish Aerial (feature_image, feature_title, feature_body)
④ Process/Cooking (process_image, process_title, process_body, process_1~5)
⑤ Ingredient/Grid Banner (ingredient_image, ingredient_title, ingredient_body)
⑥ Certification/Factory (cert_image, cert_title, cert_subtitle, cert_body, cert_1~5)
⑦ Heritage (heritage_label, heritage_title, stats, heritage_body)
⑧ Serving (serving_title, subtitle, center_image, 1~5 thumbnails, serving_tip)
⑨ Strength (strength_quote, circles 1~5, details 1~5)
⑩ Reveal/Signature (reveal_image, reveal_quote, reveal_body)
⑪ Review (review_title, review_subtitle, review_1~7)
⑫ QNA (qna_title, qna_subtitle, qna 1~3)
⑫ QnA (qna_title, qna_subtitle, qna_q1~3, qna_a1~3)
★ Ending Image (ending_image — 패키지+내용물 엔딩샷)
⑬ Info (제품명, 원료명, 식품유형, 내용량, 내포장재질, 품목보고번호, 유통기한, 제조원, 판매원, 보관방법, 주의사항, 반품교환, 고객센터, 알레르기)
\`\`\`

## 컴포넌트

### 섹션 배지
- 원형 배지 ①②③...⑫
- 배경: #6e5035
- 텍스트: 흰색
- 크기: 32px

### 타이틀
- 폰트 크기: 28px
- 폰트 무게: 700 (Bold)
- 색상: #333

### 서브타이틀
- 폰트 크기: 16px
- 폰트 무게: 600
- 색상: #666

### 본문 텍스트
- 폰트 크기: 14px
- 라인 높이: 1.8
- 색상: #555

### 강도 원형 차트
- 5개 원형
- 배경: #e8e2e2
- 테두리: #c9bcbe
- 메인 텍스트: #6e5035 (28px, 700)
- 서브 텍스트: #666 (11px)

### 버튼
- 기본 배경: #6e5035
- 호버 배경: #6d5410 (darker)
- 텍스트 색상: white
- 패딩: 8px 16px
- 테두리 반경: 4px

## 반응형 설계
- 최대 너비: 860px
- 섹션 패딩: 40px
- 교대 배경: white / #e8e2e2

## 사용자 경험
- 접근성: 모든 폼 필드에 라벨 포함
- 인터랙션: 호버 상태 표시
- 피드백: 저장 완료 알림 제공
`;
