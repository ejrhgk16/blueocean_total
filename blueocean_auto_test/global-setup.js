import { chromium } from '@playwright/test';
import fs from 'fs';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3300');

  await page.getByPlaceholder('아이디를 입력해주세요').fill('master2');
  await page.getByPlaceholder('비밀번호를 입력해주세요').fill('master2');
  await page.click('input[type="submit"]');

  // admin 로그인 성공 시 "관리자 페이지로 이동" 링크가 렌더링됨
  await page.getByText('관리자 페이지로 이동').waitFor();

  // 쿠키(access_token, refresh_token) + localStorage 저장
  await context.storageState({ path: 'playwright/.auth/user.json' });

  // access_token으로 boa_page 목록 조회 후 저장
  const cookies = await context.cookies();
  const accessToken = cookies.find((c) => c.name === 'access_token').value;

  const response = await page.request.get('http://localhost:3000/boa/page/list', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const pageList = await response.json();
  fs.writeFileSync('playwright/.auth/page-list.json', JSON.stringify(pageList, null, 2));

  await browser.close();
}

export default globalSetup;
