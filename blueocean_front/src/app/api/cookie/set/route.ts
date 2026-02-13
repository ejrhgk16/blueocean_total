import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true

export async function GET(req : NextRequest, res: NextResponse) {
  
  //토큰 저장 처리후 사용하는거
  //const token = req.cookies?.['token'];
	//const targetUrl = req.query.url as string;


  const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  const abc = searchParams.get("abc")
  const params = searchParams.toString();


  const targetUrl = "/test/test/findAll"

  const url = process.env.BACK_DOMAIN + targetUrl + "?" +req.nextUrl.searchParams

  const result = await fetch(url, {cache : 'no-store'});


  return;

}

export async function POST(nextReq : NextRequest) {

  const reqBody = await nextReq.json();

  const cookies = reqBody.cookies

  const nextRes = NextResponse.json({data : "cookie set !!! ::: "})

  nextRes.headers.set('set-cookie', cookies)

  return nextRes


  
}
