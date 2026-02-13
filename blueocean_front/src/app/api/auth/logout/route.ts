import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true


export async function GET(req : NextRequest) {


  const targetUrl = "/auth/logout"

  const successCallback = function(result:Record<string, any>){

    cookies().delete('refresh_token')
    cookies().delete('access_token')

  }

  const nextRes= await fetchToBackServer.boaGet(targetUrl, req, successCallback);
  //const nextRes = NextResponse.json({data : ''}, {status : 200})
  //const nextRes = NextResponse.json({data : data}, {status : res.status})

  // NextResponse.cookies.set('access_token', '', {
  //   httpOnly: true,
  //   secure: true,
  //   maxAge: 0,  // 쿠키를 즉시 만료시킵니다.
  //   path: '/',  // 쿠키의 유효 경로를 설정합니다.
  // });

  return nextRes


  
}
