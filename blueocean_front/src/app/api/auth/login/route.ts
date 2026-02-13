import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true


export async function POST(req : NextRequest) {


  const targetUrl = "/auth/login"

  

  const successCallback = function(result:Record<string, any>){

    const isSecure = process.env.COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production'

    cookies().set({
      name:'access_token',
      value: result.access_token,
      httpOnly : true,
      secure : isSecure,
      maxAge: 24 * 60 * 60,
      path : '/',
      sameSite  : 'strict'
    })

    cookies().set({
      name:'refresh_token',
      value: result.refresh_token,
      httpOnly : true,
      secure : isSecure,
      maxAge: 24 * 60 * 60,
      path : '/',
      sameSite  : 'strict'
    })


    cookies().set({
      name:'expire_time',
      value: result.expire_time,
      httpOnly : false,
      secure : isSecure,
      maxAge: 24 * 60 * 60,
      path : '/',
      sameSite  : 'strict'
    })
  }



  const nextRes= await fetchToBackServer.boaPost(targetUrl, req, successCallback);
  //const nextRes = NextResponse.json({data : ''}, {status : 200})
  //const nextRes = NextResponse.json({data : data}, {status : res.status})

  return nextRes


  
}
