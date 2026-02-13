import fetchToBackServer from '@/boaUtil/fetchToBackServer';
import { throws } from 'assert';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto
export const dynamicParams = true

export async function GET(req : NextRequest, res: NextResponse) {
  
  const targetUrl = "/auth/menu"

  const successCallback = function(result:any){

    // const menuListMap = new Map()
    // menuListMap.set("boa", {})
    // menuListMap.set("store", {})

    const menuListObj:Record<string,any> = {"boa":{}, "store":{}}

    result.forEach((m:any) => {

      const menuItem :Record<string,any> = {}

      menuItem.label = m.menu_name
      menuItem.route = m.menu_path
      menuItem.type = m.menu_type

      if(!m.menu_path){
        menuItem.route = '#'
      }

      menuItem.children=[]

      //{ label: "Form Elements", route: "/boa/forms/form-elements" }
      
      if(m.menu_depth == 0){
        if (!menuListObj[m.menu_type]) {
          menuListObj[m.menu_type] = {}; // m.menu_type이 없으면 초기화
        }
        menuListObj[m.menu_type][m.menu_id] = menuItem; // 최상위 메뉴 추가
      }else{

        const parentMenuItem = menuListObj?.[m.menu_type]?.[m.parent_menu_id];
  
        if (parentMenuItem) {
          // 부모 메뉴의 children 배열이 없으면 초기화
          if (!parentMenuItem.children) {
            parentMenuItem.children = [];
          }
          parentMenuItem.children.push(menuItem); // 하위 메뉴 추가
        }

      }

    });


    //const mapAsObject = Object.fromEntries(menuListMap);//맵을 객체로

    return menuListObj

  }

  const nextRes= await fetchToBackServer.boaGet(targetUrl, req, successCallback);
  //const nextRes = NextResponse.json({data : ''}, {status : 200})
  //const nextRes = NextResponse.json({data : data}, {status : res.status})

  return nextRes

}

