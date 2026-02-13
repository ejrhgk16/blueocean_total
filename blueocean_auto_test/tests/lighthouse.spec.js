import { test as base, chromium } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import getPort from 'get-port';
import { LandingPage } from './pages/LandingPage.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ──────────────────────────────────────────────
// 1. 페이지 목록 (global-setup에서 저장)
// ──────────────────────────────────────────────
const pageListPath = path.resolve(process.cwd(), 'playwright/.auth/page-list.json');
let pageList = [];
try {
  const parsed = JSON.parse(fs.readFileSync(pageListPath, 'utf-8'));
  if (Array.isArray(parsed)) {
    pageList = parsed;
  } else {
    console.error('[lighthouse.spec] page-list.json이 배열이 아님 (백엔드 에러?):', parsed);
  }
} catch {
  console.warn('[lighthouse.spec] page-list.json 없음 → npx playwright test 로 global setup 먼저 실행');
}

// ──────────────────────────────────────────────
// 2. Lighthouse 전용 Fixture 정의
//    - port      : worker당 하나의 고유 포트 (병렬 안전)
//    - lhContext : launchPersistentContext로 Lighthouse가
//                  내부적으로 여는 새 페이지도 auth 쿠키 공유
// ──────────────────────────────────────────────
const storageStatePath = path.resolve(process.cwd(), 'playwright/.auth/user.json');

const test = base.extend({
  port: [
    async ({}, use) => {
      const port = await getPort();
      await use(port);
    },
    { scope: 'worker' },
  ],

  lhContext: [
    async ({ port }, use) => {
      const userDataDir = path.join(os.tmpdir(), 'pw-lh', String(Math.random()));
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [`--remote-debugging-port=${port}`],
      });

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
// 3. 리포트 저장 디렉토리
// ──────────────────────────────────────────────
const REPORT_DIR = path.resolve(process.cwd(), 'lighthouse-reports');

// ──────────────────────────────────────────────
// 4. boa_page 항목마다 Lighthouse 테스트 생성 (병렬)
// ──────────────────────────────────────────────
test.describe.configure({ mode: 'parallel' });
test.setTimeout(120_000); // Lighthouse 감사는 최대 2분 허용

for (const pageInfo of pageList) {
  const label = `${pageInfo.page_name || pageInfo.page_code} (${pageInfo.page_code}) [${pageInfo.store_code}]`;

  test(`Lighthouse: ${label}`, async ({ lhContext, port }) => {
    const page = await lhContext.newPage();
    const landingPage = new LandingPage(page);

    // POM을 통해 랜딩 페이지 이동
    await landingPage.goto(pageInfo.store_code, pageInfo.page_code);

    // 리포트 디렉토리 보장
    fs.mkdirSync(REPORT_DIR, { recursive: true });

    // Lighthouse 감사 실행
    await playAudit({
      page,
      port,
      thresholds: { performance: 0, accessibility: 0, 'best-practices': 0, seo: 0 },
      config: {
        extends: 'lighthouse:default',
        settings: {
          // Lighthouse v10에서 pwa 카테고리 제거됨 → 명시적으로 4개만 지정
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        },
      },
      reports: {
        formats: { json: true },
        name: `${pageInfo.store_code}_${pageInfo.page_code}`,
        directory: REPORT_DIR,
      },
    });
  });
}
