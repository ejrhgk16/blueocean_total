import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true

export async function GET(req : NextRequest, res: NextResponse) {

  
  const targetUrl = "/boa-s/db/round/list"

  const successCallback = function(result:any){

   const updatedData = result?.map((item :any, index:any) => {
    return {
      ...item,
        index: index,      
        name: item.round_num,    
        memo: item.round_quantity        
      };
    });

    return updatedData

  }

  const nextRes= await fetchToBackServer.boaGet(targetUrl, req, successCallback);

  return nextRes

}

