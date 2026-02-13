import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true

export async function GET(req : NextRequest, res: NextResponse) {

  
  const targetUrl = "/boa-s/db/list/detail"

  const successCallback = function(result:Record<string, any>){

    try{
      const newResult =  {...result, info_data : result.info_data ? JSON.parse(result.info_data) : ''}
      return newResult
    }catch(e){
      return result
    }
    

  }

  const nextRes= await fetchToBackServer.boaGet(targetUrl, req, successCallback);

  return nextRes

}

