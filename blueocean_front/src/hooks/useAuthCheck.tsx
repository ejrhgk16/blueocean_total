"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";


const useAuthCheck = () => {

    const router = useRouter();
  
    useEffect(() => {
      const handleRouteChange = (url : any) => {
        // 여기에 인증 체크 로직을 추가합니다.
  
        // 예시: 로그인된 사용자인지 확인하고 아니면 로그인 페이지로 리다이렉트
        const token = document.cookie.split(';').find((c) => c.trim().startsWith('refresh_token='));
        if (!token && (url.indexOf('/login') == -1 || url.indexOf('/signin') == -1)) {
          router.push('/auth/signin');
        }
      };
  
      router.events.on('routeChangeStart', handleRouteChange);
  
      // Cleanup 함수: 이벤트 리스너를 제거합니다.
      return () => {
        router.events.off('routeChangeStart', handleRouteChange);
      };
    }, [router]);

    return null;
  };

export default useAuthCheck;

//   router.events.on('routeChangeStart', handleRouteChange);: routeChangeStart 이벤트에 handleRouteChange 함수를 등록하여 라우트가 변경되기 시작할 때마다 이 함수가 실행되도록 합니다.
// return () => { router.events.off('routeChangeStart', handleRouteChange); };: 정리(cleanup) 함수입니다. 컴포넌트가 언마운트될 때 이벤트 리스너를 제거하여 메모리 누수를 방지합니다.