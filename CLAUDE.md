# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Excluded Directories

**Never read or explore `blueocean_back/src/config/`** — 이 폴더에는 민감한 환경변수(.env) 파일이 있습니다.

---

## Project Overview

광고 관리 플랫폼. 두 개의 독립적인 앱으로 구성됩니다:
- `blueocean_back/` — NestJS 백엔드 API 서버 (port 3000)
- `blueocean_front/` — Next.js 14 프론트엔드 (port 3300)

---

## Backend (`blueocean_back`)

### Commands

```bash
npm run start:dev    # 개발 서버 (NODE_ENV=dev, watch mode) ← 로컬 개발 시 이것만 사용
npm run build        # 프로덕션 빌드
npm run start:prod   # 프로덕션 실행 (dist/main)
npm run lint         # ESLint
```

> `nest start` 또는 `npm start`는 `NODE_ENV`가 설정되지 않아 `.env` 파일을 로드하지 못함. **항상 `npm run start:dev` 사용**.

### Architecture

**DB 접근 패턴**: ORM 없음. `DbService`에서 mysql2/promise Pool을 직접 관리.
- `executeQuery(query, params)` — 일반 쿼리
- `executeTransaction(callback)` — 트랜잭션
- `executeMultiQuery(callback)` — 다중 쿼리 (트랜잭션 없음)

**모듈 구조**:
```
AppModule
├── ConfigModule (isGlobal) — src/config/.{NODE_ENV}.env 로드
├── CacheModule (isGlobal) — in-memory 캐시
├── DBModule (isGlobal) — DbService 제공
├── BlockModule — IP 차단 (onModuleInit에서 DB 조회 → 캐시 적재)
├── AuthModule — JWT access/refresh 토큰, Passport
├── BoaModule — 어드민 기능
├── UtilModule — 파일(S3), SMS(DirectSend), 코드 유틸
├── StoreModule — 스토어 관리
└── LandingModule — 랜딩페이지
```

**인증 흐름**:
- Access Token (단기) + Refresh Token (장기) 이중 토큰 구조
- Passport JWT Strategy로 토큰 검증
- `RolesGuard`로 역할 기반 접근 제어

**에러 처리**:
- `AllExceptionFilter` — 전역 예외 필터. `BaseException` 상속 커스텀 예외들을 처리
- 에러 코드 체계: `4001` AccessTokenExpired, `4005` RoleException 등
- 토큰 만료/역할 오류는 로그 기록 안 함 (정상 케이스)

**로깅**: Winston DailyRotateFile → `logfiles/back_log_error-YYYY-MM.log` (콘솔 출력 없음)

**주의사항**:
- `BlockService.onModuleInit()`이 앱 시작 시 DB 쿼리를 실행. **DB가 꺼져있으면 앱 시작 실패**.
- 로거가 파일 전용이라 시작 오류가 콘솔에 출력되지 않음 → 오류 확인 시 로그 파일 확인

---

## Frontend (`blueocean_front`)

### Commands

```bash
npm run dev     # 개발 서버 (port 3300)
npm run build   # 빌드
npm run start   # 프로덕션 (port 3300)
npm run lint    # ESLint
```

### Architecture

**Next.js 14 App Router** 사용. 라우트 구조:
- `/boa/*` — 어드민 대시보드 (계정, 클라이언트, 역할, 미디어 관리)
- `/store/[code]/*` — 스토어별 관리 화면 (광고, DB, 통계)
- `/landing/[store_code]/[page_code]/*` — 공개 랜딩페이지
- `/auth/*` — 로그인/로그아웃
- `/api/*` — Next.js Route Handlers (백엔드 프록시 역할)

**API 호출 패턴**: 프론트의 모든 백엔드 통신은 `src/boaUtil/fetchToBackServer.ts`를 통함.

```typescript
// SSR/Route Handler에서 사용
boaGet(targetUrl, nextReq, successCallback?)
boaPost(targetUrl, nextReq, successCallback?)
boaPost_formData(targetUrl, nextReq, successCallback?)  // 파일 업로드
boaGet_noToken(targetUrl, nextReq)   // 인증 불필요
boaPost_noToken(targetUrl, nextReq)  // 인증 불필요
boaPost_external(targetUrl, body)    // 외부 서버 직접 호출
```

- 모든 요청에 `access_token` 쿠키를 Bearer 토큰으로 자동 첨부
- 401 응답 시 자동으로 refresh token으로 재발급 후 원래 요청 재시도
- Refresh 실패 시 `/auth/signout`으로 리다이렉트
- Role 오류(4005) 시 `/error_role`로 리다이렉트

**CSR 호출**: `src/boaUtil/fetchToFrontServer_csr.ts` — 클라이언트에서 Next.js API Route 호출

**인증 쿠키**: `access_token`, `refresh_token` (httpOnly), `expire_time`

**환경변수**:
- `BACK_DOMAIN` — NestJS 백엔드 URL (서버사이드 전용)
- `NEXT_PUBLIC_FRONT_DOMAIN` — 프론트 도메인 (클라이언트 사용 가능)
- `NEXT_PUBLIC_S3_URL` — S3 이미지 도메인 (next.config.js에서 remotePatterns 설정)

---

## Lighthouse 성능 감사 테스트 (`Playwright`)

루트 레벨(`blueocean/`)에서 관리. 백엔드/프론트와 독립적인 npm 프로젝트.
`boa_page` 목록을 기반으로 모든 랜딩페이지에 대해 Lighthouse 감사를 병렬 실행함.

### Commands

```bash
# 루트(blueocean/) 디렉토리에서 실행
npx playwright test                          # 전체 감사 실행 (headless)
npx playwright test --headed                 # 브라우저 UI 표시
npx playwright test --ui                     # Playwright UI 모드
npx playwright show-report                   # Playwright HTML 리포트 보기
npx playwright test tests/lighthouse.spec.js # Lighthouse 감사만 실행
```

### 구조

```
blueocean/
├── playwright.config.js            # Playwright 설정 (baseURL, globalSetup/Teardown, storageState)
├── global-setup.js                 # 로그인 → 쿠키 저장 + boa_page 목록 저장
├── global-teardown.js              # Lighthouse JSON → summary.html 생성
├── package.json                    # lighthouse, playwright-lighthouse, get-port 포함
├── tests/
│   ├── lighthouse.spec.js          # boa_page 목록 기반 동적 Lighthouse 감사
│   └── pages/
│       └── LandingPage.js          # 랜딩 페이지 POM
└── (런타임 생성)
    ├── playwright/.auth/user.json        # 로그인 쿠키 저장
    ├── playwright/.auth/page-list.json   # boa_page 목록 캐시
    └── lighthouse-reports/               # JSON 리포트 + summary.html
```

### 실행 흐름

1. **global-setup**: `master2`/`master2`로 로그인 → 쿠키 `playwright/.auth/user.json` 저장 → 백엔드 `/boa/page/list` 조회 후 `playwright/.auth/page-list.json` 저장
2. **테스트**: `page-list.json` 기반으로 랜딩페이지마다 Lighthouse 감사 병렬 실행 (타임아웃 2분/페이지), 결과를 `lighthouse-reports/*.json`으로 저장
3. **global-teardown**: JSON 리포트들을 집계해 `lighthouse-reports/summary.html` 생성 (Performance/Accessibility/Best Practices/SEO 점수 색상 표시)

### 주의사항

- **테스트 실행 전 서버 수동 시작 필요**: `webServer` 옵션이 주석처리됨
  - 프론트: `blueocean_front/`에서 `npm run dev` (port 3300)
  - 백엔드: `blueocean_back/`에서 `npm run start:dev` (port 3000) ← global-setup이 `/boa/page/list` 호출
- **테스트 계정**: `master2` / `master2` (`global-setup.js` 하드코딩)
- **Lighthouse 리포트**: `lighthouse-reports/summary.html`에서 전체 페이지 점수 일람 확인 가능
- 테스트 결과: `test-results/`, `playwright-report/` (`.gitignore`에 등록됨)
