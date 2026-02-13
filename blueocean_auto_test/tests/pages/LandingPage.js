// @ts-check

const FRONT_BASE_URL = 'http://localhost:3300';
//https://blueoceanad.kr

/**
 * LandingPage POM (Page Object Model)
 * 랜딩 페이지 (/landing/[store_code]/[page_code]) 관련 액션/셀렉터를 캡슐화
 */
export class LandingPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  /**
   * 랜딩 페이지로 이동 후 네트워크 안정 대기
   * @param {string} storeCode
   * @param {string} pageCode
   */
  async goto(storeCode, pageCode) {
    await this.page.goto(`${FRONT_BASE_URL}/landing/${storeCode}/${pageCode}`);
    await this.page.waitForLoadState('networkidle');
  }

  /** 페이지 타이틀 반환 */
  getTitle() {
    return this.page.title();
  }

  /**
   * 폼의 모든 입력 필드를 테스트 데이터로 채웁니다.
   * @param {Record<string, any>} [pageInfo={}]
   */
  async fillForm(pageInfo = {}) {
    const p = this.page;

    // 1. 이름
    const nameInput = p.locator('input[type="text"][placeholder="이름을 입력해주세요"]');
    if (await nameInput.count() > 0) await nameInput.fill('testdata');

    // 2-a. Q&A 주관식
    const subjectiveInputs = p.locator('input[type="text"][placeholder="답변을 입력해주세요"]');
    for (let i = 0; i < await subjectiveInputs.count(); i++) {
      await subjectiveInputs.nth(i).fill('testdata');
    }

    // 2-b. Q&A 이미지 선택형 (각 그룹의 첫 번째 보기 div 클릭)
    const qaImageGroups = p.locator('div.flex.gap-3.place-items-center');
    for (let i = 0; i < await qaImageGroups.count(); i++) {
      const firstAnswerDiv = qaImageGroups.nth(i).locator('div').first();
      if (await firstAnswerDiv.count() > 0) await firstAnswerDiv.click();
    }

    // 2-c. Q&A 셀렉트박스 (비장애 옵션 중 첫 번째 선택 = 실질적 2번 선택)
    const selects = p.locator('select');
    for (let i = 0; i < await selects.count(); i++) {
      const options = selects.nth(i).locator('option:not([disabled])');
      if (await options.count() > 0) {
        const firstValue = await options.nth(0).getAttribute('value');
        if (firstValue !== null) await selects.nth(i).selectOption({ value: firstValue });
      }
    }

    // 3. 전화번호 (phone1은 "010" defaultValue로 이미 채워짐)
    const phone2 = p.locator('input[type="number"]#phone2');
    if (await phone2.count() > 0) await phone2.fill('1234');
    const phone3 = p.locator('input[type="number"]#phone3');
    if (await phone3.count() > 0) await phone3.fill('5678');

    // 4. 나이 (ageYN==="Y"인 페이지만, limit_age 고려)
    if (pageInfo.ageYN === 'Y') {
      const ageInput = p.locator('input[type="number"][placeholder="나이를 입력해주세요"]');
      if (await ageInput.count() > 0) {
        const ageValue = pageInfo.limit_age ? String(pageInfo.limit_age + 1) : '30';
        await ageInput.fill(ageValue);
      }
    }

    // 5. 체크박스: privacy (제출 필수), 기타 (2번째 or 1번째)
    const cb01 = p.locator('input[type="checkbox"]#privacy_agree01');
    if (await cb01.count() > 0 && !(await cb01.isChecked())) await cb01.check();

    const cb02 = p.locator('input[type="checkbox"]#privacy_agree02');
    if (await cb02.count() > 0 && !(await cb02.isChecked())) await cb02.check();

    const otherCbs = p.locator(
      'input[type="checkbox"]:not(#privacy_agree01):not(#privacy_agree02)'
    );
    const otherCount = await otherCbs.count();
    if (otherCount >= 2) await otherCbs.nth(1).check();
    else if (otherCount === 1) await otherCbs.first().check();
  }

  /**
   * #inputArea 스크롤 후 fixed 제출 버튼 클릭, /api/landing/add 응답 반환
   * @returns {Promise<import('@playwright/test').Response>}
   */
  async clickSubmit() {
    const p = this.page;

    // isInRegInputArea 가드 통과: #inputArea를 뷰포트에 표시 후 scroll 이벤트 대기
    const inputArea = p.locator('#inputArea');
    if (await inputArea.count() > 0) {
      await inputArea.scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
    }

    // race condition 방지: 클릭 전에 응답 Promise 등록
    const responsePromise = p.waitForResponse(
      (resp) => resp.url().includes('/api/landing/add'),
      { timeout: 10_000 }
    );

    // fixed-bottom 제출 버튼 클릭
    await p.locator('div.fixed.bottom-0').click();

    return responsePromise;
  }
}
