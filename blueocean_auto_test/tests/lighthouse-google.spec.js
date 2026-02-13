import { test as base, chromium } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import getPort from 'get-port';
import os from 'os';
import path from 'path';
import fs from 'fs';

// ──────────────────────────────────────────────
// google.com Lighthouse 성능 테스트 예시
// - 로그인 불필요 (addCookies 없음)
// - page-list.json 루프 없음 (단일 URL)
// - thresholds: 점수 미달 시 테스트 실패
// ──────────────────────────────────────────────

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
      const userDataDir = path.join(os.tmpdir(), 'pw-lh-google', String(Math.random()));
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [`--remote-debugging-port=${port}`],
      });
      await use(context);
      await context.close();
    },
    { scope: 'worker' },
  ],
});

const REPORT_DIR = path.resolve(process.cwd(), 'lighthouse-reports');

test.setTimeout(120_000);

test('Lighthouse: google.com', async ({ lhContext, port }) => {
  const page = await lhContext.newPage();
  await page.goto('https://www.google.com');
  await page.waitForLoadState('networkidle');

  fs.mkdirSync(REPORT_DIR, { recursive: true });

  await playAudit({
    page,
    port,
    thresholds: {
      performance: 70,
      accessibility: 80,
      'best-practices': 80,
      seo: 50,
    },
    config: {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },
    reports: {
      formats: { html: true, json: true },
      name: 'google',
      directory: REPORT_DIR,
    },
  });
});
