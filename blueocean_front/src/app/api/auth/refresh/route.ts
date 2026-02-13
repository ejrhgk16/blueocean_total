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

  const successCallback = function(result:Record<string, any>){


  }

  var option :Record<string, any> = {};

  const refresh_token = req.cookies.get('refresh_token')


  option.method = 'GET'
  option.headers = {"Content-Type" : "application/json", 'Cookie':'refresh_token='+refresh_token?.value}
  option.cache = 'no-store';
  option.credentials = 'include'


  const refreshRes = await fetch(process.env.BACK_DOMAIN+"/auth/token/refresh", option);

  if(refreshRes.ok){
    const refreshResult = await refreshRes.json()

    const isSecure = process.env.COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production'

    cookies().set({
      name:'access_token',
      value: refreshResult.access_token,
      httpOnly : true,
      secure : isSecure,
      maxAge: 24 * 60 * 60,
      path : '/',
      sameSite  : 'strict'
    })

    cookies().set({
      name:'refresh_token',
      value: refreshResult.refresh_token,
      httpOnly : true,
      secure : isSecure,
      maxAge: 24 * 60 * 60,
      path : '/',
      sameSite  : 'strict'
    })


    cookies().set({
      name:'expire_time',
      value: refreshResult.expire_time,
      httpOnly : false,
      secure : isSecure,
      maxAge: 24 * 60 * 60,
      path : '/',
      sameSite  : 'strict'
    })


    return NextResponse.json({data : refreshResult}, {status : 200})
  }else{
    return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/auth/signout")

  }


  
}
