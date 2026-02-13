import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { LandingApi } from './api/LandingApi.js';

// ──────────────────────────────────────────────
// 1. 페이지 목록 로드 (global-setup에서 저장)
//    status === 'Y' 인 활성 페이지만 테스트
// ──────────────────────────────────────────────
const pageListPath = path.resolve(process.cwd(), 'playwright/.auth/page-list.json');
let pageList = [];
try {
  const parsed = JSON.parse(fs.readFileSync(pageListPath, 'utf-8'));
  if (Array.isArray(parsed)) {
    pageList = parsed.filter((p) => p.status === 'Y');
  } else {
    console.error('[landing-api.spec] page-list.json이 배열이 아님 (백엔드 에러?):', parsed);
  }
} catch {
  console.warn('[landing-api.spec] page-list.json 없음 → npx playwright test 로 global setup 먼저 실행');
}

// ──────────────────────────────────────────────
// 2. page-list.json 로드 검증 (항상 실행)
//    pageList가 비어있으면 이 테스트가 실패해서 원인을 알 수 있음
// ──────────────────────────────────────────────
test('page-list.json 로드 확인', () => {
  expect(pageList.length, `page-list.json이 비어있음. 실행 경로 확인(blueocean_auto_test/) 또는 global setup 먼저 실행`).toBeGreaterThan(0);
});

// ──────────────────────────────────────────────
// 3. 테스트 생성: 페이지마다 describe → 엔드포인트별 test
// ──────────────────────────────────────────────
test.describe.configure({ mode: 'parallel' });

for (const pageData of pageList) {
  const label = `${pageData.page_name || pageData.page_code} (${pageData.page_code}) [${pageData.store_code}]`;

  test.describe(`Landing API: ${label}`, () => {

    // ── GET /landing/content/list ──────────────
    test('GET /landing/content/list - 페이지 콘텐츠 반환', async ({ request }) => {
      const api = new LandingApi(request);
      const res = await api.getContentList(pageData.store_code, pageData.page_code);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty('contentList');
      expect(body).toHaveProperty('pageInfo');
      expect(body).toHaveProperty('scriptList');
      expect(Array.isArray(body.contentList)).toBe(true);
      expect(Array.isArray(body.scriptList)).toBe(true);
      expect(body.pageInfo).toBeTruthy();
      expect(body.pageInfo.page_code).toBe(pageData.page_code);
    });

    // ── GET /landing/comp/script ───────────────
    test('GET /landing/comp/script123777 - 완료 스크립트 목록 반환', async ({ request }) => {
      const api = new LandingApi(request);
      const res = await api.getCompScript(pageData.store_code, pageData.page_code);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    });

    // ── GET /landing/privacy ───────────────────
    // privacy_num이 설정된 페이지에서만 등록
    if (pageData.privacy_num) {
      test('GET /landing/privacy - 개인정보처리방침 반환', async ({ request }) => {
        const api = new LandingApi(request);
        const res = await api.getPrivacy(pageData.store_code, pageData.privacy_num);

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body).toBeTruthy();
        expect(body).toHaveProperty('store_code');
        expect(body.store_code).toBe(pageData.store_code);
      });
    }

    // // ── GET /landing/count ─────────────────────
    // test('GET /landing/count - 방문수 업데이트 성공', async ({ request }) => {
    //   const api = new LandingApi(request);
    //   const res = await api.getCount(pageData.page_code);

    //   expect(res.status()).toBe(200);
    //   const body = await res.json();
    //   expect(body.code).toBe('success');
    // });

  });
}
