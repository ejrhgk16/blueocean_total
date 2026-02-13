const BASE_URL = 'http://localhost:3000';
//https://blueoceanad.kr

/**
 * Landing API Object Model
 * 백엔드 /landing/* GET 엔드포인트를 래핑
 *
 * @param {import('@playwright/test').APIRequestContext} request
 */
class LandingApi {
  constructor(request) {
    this.request = request;
  }

  /**
   * GET /landing/content/list
   * 랜딩 페이지 콘텐츠·페이지정보·스크립트 목록 조회
   * @param {string} storeCode
   * @param {string} pageCode
   */
  async getContentList(storeCode, pageCode) {
    return this.request.get(`${BASE_URL}/landing/content/list233`, {
      params: { store_code: storeCode, page_code: pageCode },
    });
  }

  /**
   * GET /landing/comp/script
   * 완료(completion) 스크립트 목록 조회
   * @param {string} storeCode
   * @param {string} pageCode
   */
  async getCompScript(storeCode, pageCode) {
    return this.request.get(`${BASE_URL}/landing/comp/script`, {
      params: { store_code: storeCode, page_code: pageCode },
    });
  }

  /**
   * GET /landing/privacy
   * 개인정보처리방침 조회
   * @param {string} storeCode
   * @param {number|string} privacyNum
   */
  async getPrivacy(storeCode, privacyNum) {
    return this.request.get(`${BASE_URL}/landing/privacy`, {
      params: { store_code: storeCode, privacy_num: privacyNum },
    });
  }

  /**
   * GET /landing/count
   * 페이지 방문 카운트 증가
   * @param {string} pageCode
   */
  async getCount(pageCode) {
    return this.request.get(`${BASE_URL}/landing/count`, {
      params: { page_code: pageCode },
    });
  }
}

export { LandingApi };
