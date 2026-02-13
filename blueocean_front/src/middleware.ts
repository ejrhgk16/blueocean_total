import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  
  // console.log("::::::: "+process.env.NEXT_PUBLIC_FRONT_DOMAIN);
  // console.log("::::::: "+process.env.S3_URL);
  // console.log("middleware url ::: " + request.url)
  //console.log(request.cookies.getAll());//ssr인경우 브라우저접근을안해서 쿠키값을 미들웨어에서도 못가져옴
  if(request.url.indexOf("/signin") || request.url == process.env.NEXT_PUBLIC_FRONT_DOMAIN){
    return NextResponse.next();
  }

  // const response = NextResponse.next()
  // const allowedOrigins = ['http://localhost:3300', 'https://blueoceanad.kr']
  // const origin = request.headers.get('origin')

  // if (origin && allowedOrigins?.includes(origin)) {
  //   response.headers.set('Access-Control-Allow-Origin', origin)
  //   response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  //   response.headers.set('Access-Control-Allow-Headers', '*')
  //   response.headers.set('Access-Control-Allow-Credentials', 'true')
  // }

  // const token = request.cookies.get('refresh_token');
  // if(!token){
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

}

export const config = {
  matcher: '/boa/:path*',
}