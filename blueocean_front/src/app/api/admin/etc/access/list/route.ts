import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true

export async function GET(req : NextRequest, res: NextResponse) {

  
  const targetUrl = "/boa/etc/access/list"

  const successCallback = function(result:[]){

    const newResult:any[] = []

    result.forEach((item:any) => {
      const temp = item
      temp.name = item.block_ip
      newResult.push(temp)
    })


    return newResult
    

  }

  const nextRes= await fetchToBackServer.boaGet(targetUrl, req, successCallback);

  return nextRes

}

