import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";

//ssr페이지인경우 cookie값을 직접넘겨받음(cookiesArr)
 async function boaGet(targetUrl:string, param:Record<string,any> = {},cookiesArr:RequestCookie[]=[], callback= ()=>{}, cache = 'no-store'){

 
    var url = process.env.NEXT_PUBLIC_FRONT_DOMAIN + targetUrl;

    if(param && Object.keys(param).length > 0){
        const queryString = new URLSearchParams(param).toString();
        url += '?'+ queryString
    }



    var option :Record<string, any> = {};

    option.method = 'GET'
    option.headers = {"Content-Type" : "application/json"}
    option.cache = cache;
    option.credentials = 'include'

    if(cookiesArr.length>0){
        const cookieHeader = cookiesArr?.map((cookie:any) => `${cookie.name}=${cookie.value}`).join('; ');
        option.headers.cookie = cookieHeader
    }

    var res2 : Record<string,any>= {}

    try{
        
        
        const res = await fetch(url, option)
        res2 = res;


        if(res.ok) {//여기서 인증에러, 토큰에러 등등 처리되게
            return res
        }

        if(!res.ok) {
        }

        return res
 


    }catch(error){

        // console.error('Fetch error:', error);
        throw error;

    }finally {
  
        if (res2.redirected) {
            //console.log(res.url);
            redirect(res2.url)
            
        }



    }
    
    

}

//ssr페이지인경우 cookie값을 직접넘겨받음(cookiesArr)
async function boaPost(targetUrl : string, body : any = '',cookiesArr:RequestCookie[]=[], callback = ()=>{}, cache = 'no-store'){

    var option :Record<string, any> = {};
    option.method = 'POST'
    option.headers = {"Content-Type" : "application/json"}
    option.cache = cache;
    option.credentials = 'include'

    if(body){        
        option.body = JSON.stringify(body)
    }

    if(cookiesArr.length>0){
        const cookieHeader = cookiesArr?.map((cookie:any) => `${cookie.name}=${cookie.value}`).join('; ');
        option.headers.cookie = cookieHeader
    }



      const res = await fetch(process.env.NEXT_PUBLIC_FRONT_DOMAIN+targetUrl, option)

      //return res

      if (res.redirected) {
        redirect(res.url)
     }

     if(res.status == 401){//여기까지 인증에러가 반환된다면 리프레시토큰까지 만료거나 인증에러인거기때문에 로그아웃처리
        const res = await fetch(process.env.NEXT_PUBLIC_FRONT_DOMAIN+'', option)
     }
    
      
      if(res.ok) {//여기서 인증에러, 토큰에러 등등 처리되게
        return res
      }

      if(!res.ok) {

     }

     return res


}

    
export default {boaGet, boaPost}

