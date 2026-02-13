import { test, expect } from '@playwright/test';
import { LandingPage } from './pages/LandingPage.js';
import fs from 'fs';
import path from 'path';

// ──────────────────────────────────────────────
// 일반 context 방식 (비교용)
// - storageState 자동 주입 (playwright.config.js에 설정됨)
// - browser.newContext() → 시크릿 모드처럼 격리된 컨텍스트
// - 마지막 탭이 닫히면 브라우저 창도 닫힘
// ──────────────────────────────────────────────

const pageListPath = path.resolve(process.cwd(), 'playwright/.auth/page-list.json');
let pageList = [];
try {
  const parsed = JSON.parse(fs.readFileSync(pageListPath, 'utf-8'));
  if (Array.isArray(parsed)) {
    pageList = parsed.filter((p) => p.status === 'Y');
  } else {
    console.error('[form-submit-normal.spec] page-list.json이 배열이 아님:', parsed);
  }
} catch {
  console.warn('[form-submit-normal.spec] page-list.json 없음 → global setup 먼저 실행');
}

test.describe.configure({ mode: 'parallel' });
test.setTimeout(30_000);

for (const pageInfo of pageList) {
  const label = `${pageInfo.page_name || pageInfo.page_code} (${pageInfo.page_code}) [${pageInfo.store_code}]`;

  // ✅ 기본 { page } fixture 그대로 사용
  // - playwright.config.js의 storageState가 자동으로 쿠키를 주입해줌
  // - 테스트마다 새 context가 생성되고 테스트 끝나면 닫힘 → 브라우저 창도 닫힘
  test(`Form Submit (normal): ${label}`, async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto(pageInfo.store_code, pageInfo.page_code);

    const alertMessages = [];
    const dialogHandler = async (dialog) => {
      alertMessages.push(dialog.message());
      await dialog.dismiss();
    };
    page.on('dialog', dialogHandler);

    await landingPage.fillForm(pageInfo);
    const response = await landingPage.clickSubmit();

    page.off('dialog', dialogHandler);

    expect(
      alertMessages,
      `유효성 검사 alert 발생: ${JSON.stringify(alertMessages)}`
    ).toHaveLength(0);

    expect(
      response.ok(),
      `/api/landing/add 응답 실패: HTTP ${response.status()}`
    ).toBe(true);
  });
}
