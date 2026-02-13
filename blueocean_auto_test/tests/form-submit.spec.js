import { test as base, chromium, expect } from '@playwright/test';
import { LandingPage } from './pages/LandingPage.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ──────────────────────────────────────────────
// lighthouse.spec.js와 동일한 패턴:
// launchPersistentContext → about:blank 첫 탭 유지 → 브라우저 창 안 닫힘
// 각 테스트는 새 탭을 열고 닫음
// ──────────────────────────────────────────────
const storageStatePath = path.resolve(process.cwd(), 'playwright/.auth/user.json');

const test = base.extend({
  fsContext: [
    async ({}, use) => {
      const userDataDir = path.join(os.tmpdir(), 'pw-fs', String(Math.random()));
      const context = await chromium.launchPersistentContext(userDataDir);

      // globalSetup에서 저장한 쿠키를 persistent context에 주입
      const { cookies } = JSON.parse(fs.readFileSync(storageStatePath, 'utf-8'));
      await context.addCookies(cookies);

      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
});

// ──────────────────────────────────────────────
// 1. 활성 페이지 목록 로드 (global-setup에서 저장)
// ──────────────────────────────────────────────
const pageListPath = path.resolve(process.cwd(), 'playwright/.auth/page-list.json');
let pageList = [];
try {
  const parsed = JSON.parse(fs.readFileSync(pageListPath, 'utf-8'));
  if (Array.isArray(parsed)) {
    pageList = parsed.filter((p) => p.status === 'Y');
  } else {
    console.error('[form-submit.spec] page-list.json이 배열이 아님 (백엔드 에러?):', parsed);
  }
} catch {
  console.warn('[form-submit.spec] page-list.json 없음 → npx playwright test 로 global setup 먼저 실행');
}

// ──────────────────────────────────────────────
// 2. 병렬 실행, 타임아웃 설정
// ──────────────────────────────────────────────
test.describe.configure({ mode: 'parallel' });
test.setTimeout(30_000);

// ──────────────────────────────────────────────
// 3. 각 활성 페이지마다 폼 제출 테스트 동적 생성
// ──────────────────────────────────────────────
for (const pageInfo of pageList) {
  const label = `${pageInfo.page_name || pageInfo.page_code} (${pageInfo.page_code}) [${pageInfo.store_code}]`;

  test(`Form Submit: ${label}`, async ({ fsContext }) => {
    // 새 탭 열기 (about:blank 첫 탭은 유지됨)
    const page = await fsContext.newPage();
    const landingPage = new LandingPage(page);

    // (a) 랜딩 페이지 이동
    await landingPage.goto(pageInfo.store_code, pageInfo.page_code);

    // (b) alert 수집
    const alertMessages = [];
    const dialogHandler = async (dialog) => {
      alertMessages.push(dialog.message());
      await dialog.dismiss();
    };
    page.on('dialog', dialogHandler);

    // (c) 폼 채우기
    await landingPage.fillForm(pageInfo);

    // (d) 제출 버튼 클릭 및 API 응답 대기
    const response = await landingPage.clickSubmit();

    // 테스트 탭 닫기 (about:blank 탭 남아있어 브라우저 창 유지)
    page.off('dialog', dialogHandler);
    await page.close();

    // (e) 검증: alert가 발생하지 않아야 함 (= 유효성 검사 통과)
    expect(
      alertMessages,
      `유효성 검사 alert 발생: ${JSON.stringify(alertMessages)}`
    ).toHaveLength(0);

    // (f) 검증: /api/landing/add 응답이 2xx 성공이어야 함
    expect(
      response.ok(),
      `/api/landing/add 응답 실패: HTTP ${response.status()}`
    ).toBe(true);
  });
}
