# slunch-admin (admin-frontend)

SLUNCH 통합 관리 페이지
## 로컬 실행

```bash
npm install
npm run dev          # http://localhost:3002
```

기본 로그인: `admin` / `1234`
(환경변수 `ADMIN_USERNAME`, `ADMIN_PASSWORD` 로 변경 가능 — 운영용은 반드시 변경 권장)

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

> ⚠️ **중요**: 현재 mock 백엔드는 파일 시스템에 데이터를 저장(`data/*.json`, `public/uploads/*`)합니다. Vercel은 런타임에 파일 시스템이 **읽기 전용**이라, 배포된 환경에서 **수정 내용이 영구 저장되지 않습니다**. 페이지 새로고침 또는 함수 재시작 시 시드 데이터로 돌아갑니다.
>
> - **이미지 업로드**: Vercel 환경(`process.env.VERCEL`)에서는 자동으로 base64 `data:` URL을 반환합니다 → 미리보기에는 보이지만 product JSON에 인라인되어 새로고침 시 사라집니다.
> - **제품 저장**: Vercel에서는 디스크 쓰기를 무음으로 skip — API는 200 OK를 반환하지만 실제 저장되지 않습니다.
>
> 실제 영속 저장이 필요하면 Vercel Postgres / KV / Blob 또는 별도 백엔드(slunch-backend) 연동이 필요합니다.


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
