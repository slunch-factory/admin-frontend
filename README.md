# slunch-admin (admin-frontend)

SLUNCH 통합 관리 페이지. Next.js 16 + React 19 + TypeScript.

스토어 상세 / 스토어 이미지 / 구독 상세 3개 탭으로 [slunch.co.kr/store](https://slunch.co.kr/store) 와 [slunch.co.kr/subscribe](https://slunch.co.kr/subscribe) 콘텐츠를 관리합니다.

## 로컬 실행

```bash
npm install
npm run dev          # http://localhost:3002
```

기본 로그인: `admin` / `slunch2025`
(환경변수 `ADMIN_USERNAME`, `ADMIN_PASSWORD` 로 변경 가능)

## 주요 명령어

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (포트 3002) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | 타입 체크 |

## 폴더 구조

```
app/
├── (admin)/              # 인증된 영역
│   ├── store/page.tsx    # 스토어 상세 (텍스트 + 이미지 통합)
│   ├── image/page.tsx    # 스토어 이미지 (제작 중)
│   └── subscribe/page.tsx # 구독 상세
├── api/v1/admin/         # mock API 라우트
│   ├── store/admin/login/route.ts
│   ├── store/product/...
│   ├── subscribe/product/...
│   └── upload/route.ts   # 이미지 업로드
├── login/page.tsx
├── layout.tsx
└── globals.css
components/
├── TopNav.tsx
├── ProductSidebar.tsx
├── StoreProductForm.tsx / StorePreview.tsx
├── SubscribeProductForm.tsx / SubscribePreview.tsx
├── EditorNameModal.tsx
└── SplitPane.tsx
data/                     # mock 시드 데이터 (28개 제품 + 33개 메뉴)
lib/
└── store.ts, auth.ts, api-client.ts, ...
types/product.ts
public/uploads/           # 런타임 업로드 (gitignore)
```

## 핵심 기능

- **단일 admin 계정** + 마지막 수정자 이름 입력 모달
- **스토어 상세**: 14개 섹션(① 히어로 ~ ⑭ 식품 정보), 각 섹션에 이미지 업로드 + 텍스트 편집
- **구독 상세**: 5개 섹션, 카드형 미리보기 (이미지 #4 디자인)
- **실시간 미리보기**: 편집 → 우측 즉시 반영
- **드래그 가능한 분할**: 편집/미리보기 비율 자유 조정
- **모바일 반응형**: 1024px ↓ 세로 스택

## Vercel 배포

> ⚠️ **중요**: 현재 mock 백엔드는 파일 시스템에 데이터를 저장(`data/*.json`, `public/uploads/*`)합니다. Vercel은 런타임에 파일 시스템이 **읽기 전용**이라, 배포된 환경에서 **수정 내용이 영구 저장되지 않습니다**. 페이지 새로고침 또는 함수 재시작 시 시드 데이터로 돌아갑니다. 실제 영속 저장이 필요하면 Vercel Postgres / KV / Blob 또는 별도 백엔드(slunch-backend) 연동이 필요합니다.

### 1) Vercel 대시보드로 배포 (가장 쉬움)
1. [vercel.com/new](https://vercel.com/new) 접속
2. **Import Git Repository** → `slunch-factory/admin-frontend` 선택
3. Framework: **Next.js** 자동 인식
4. **Environment Variables** 설정 (선택):
   - `ADMIN_USERNAME` = 원하는 아이디
   - `ADMIN_PASSWORD` = 원하는 비밀번호
5. **Deploy** 클릭

### 2) Vercel CLI로 배포
```bash
npm install -g vercel
vercel login
vercel              # preview 배포
vercel --prod       # 프로덕션 배포
```

### 3) 커스텀 도메인 연결
Vercel 프로젝트 → Settings → Domains → `admin.slunch.co.kr` 등 추가 → DNS A/CNAME 레코드 안내대로 설정

## 백엔드 연동 전환 시

`lib/api-client.ts`의 fetch URL만 실제 백엔드 base URL로 교체하거나, `next.config.ts`에 [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) 추가:

```ts
async rewrites() {
  return [
    {
      source: "/api/v1/admin/:path*",
      destination: "https://api.slunch.co.kr/api/v1/admin/:path*",
    },
  ];
}
```

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- 쿠키 기반 admin 세션
