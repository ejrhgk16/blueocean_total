import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true

export async function GET(req : NextRequest, res: NextResponse) {

  
  const targetUrl = "/boa/menu"

  const successCallback = function(result:any){


    const menuListMap = new Map()

    result.forEach((m:any) => {

      const menuItem :Record<string,any> = {}

      menuItem.label = m.menu_name
      menuItem.route = m.menu_path
      if(!m.menu_path){
        menuItem.route = '#'
      }

      menuItem.children=[]

      //{ label: "Form Elements", route: "/boa/forms/form-elements" }

      if(m.menu_depth == 0){
        menuListMap.set(m.menu_id, menuItem)
      }else{
        const parentMenuItem =menuListMap.get(m.parent_menu_id)
        parentMenuItem.children.push(menuItem)
      }

    });


    const mapAsObject = Object.fromEntries(menuListMap);//맵을 객체로

    return mapAsObject

  }

  const nextRes= await fetchToBackServer.boaGet(targetUrl, req, successCallback);
  //const nextRes = NextResponse.json({data : ''}, {status : 200})
  //const nextRes = NextResponse.json({data : data}, {status : res.status})

  return nextRes

}

