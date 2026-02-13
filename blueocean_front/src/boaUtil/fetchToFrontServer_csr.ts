import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect, useRouter } from "next/navigation";

//ssr페이지인경우 cookie값을 직접넘겨받음(cookiesArr)
 async function boaGet(targetUrl:string, param:Record<string,any> = {},cookiesArr:RequestCookie[]=[], callback= ()=>{}, cache = 'no-store'){

    for (let key in param) {
        if (param[key] === null) {
          delete param[key];  // null 값을 가진 키를 삭제
        }
    }
 
    // console.log(process.env.NEXT_PUBLIC_FRONT_DOMAIN);
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
        
        const res = await fetch(url, option);
        res2 = res;

        // if (res.redirected) {
        //     console.log("redicrect ::: ")
        //     const router = useRouter();
        //     router.push(res.url);
        // }
        
        
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

            if(res2.url.indexOf("/auth/signout") > -1){
                alert("로그인 만료되었습니다 재로그인해주세요")
            }

            if(window.opener){
                window.close()
                window.opener.location.href = res2.url
            }else{
                window.location.href = res2.url
            }


        }

        //return res2

    }

   
    
    

}

//ssr페이지인경우 cookie값을 직접넘겨받음(cookiesArr)
async function boaPost(targetUrl : string, body :any = '',cookiesArr:RequestCookie[]=[], callback = ()=>{}, cache = 'no-store'){


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

    var res2 : Record<string,any>= {}


    try{
        
        const res = await fetch(targetUrl, option);
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
            if(res2.url.include("/auth/signout")){
                alert("로그인 만료되었습니다 재로그인해주세요")
            }

            if(window.opener){
                window.close()
                window.opener.location.href = res2.url
            }else{
                window.location.href = res2.url
            }


        }



        //return res2

    }


}

async function boaPost_formData(targetUrl : string, body :any = '',cookiesArr:RequestCookie[]=[], callback = ()=>{}, cache = 'no-store'){

    var option :Record<string, any> = {};
    option.method = 'POST'  
    option.cache = cache;
    option.credentials = 'include'

    if(body){        
        option.body = body
    }

    if(cookiesArr.length>0){
        const cookieHeader = cookiesArr?.map((cookie:any) => `${cookie.name}=${cookie.value}`).join('; ');
        option.headers.cookie = cookieHeader
    }

    var res2 : Record<string,any>= {}


    try{
        
        const res = await fetch(targetUrl, option);
        res2 = res;
        
        if(res.ok) {//여기서 인증에러, 토큰에러 등등 처리되게
            return res
        }

        if(!res.ok) {
        }
    
        return res

    }catch(error){

        console.error('Fetch error:', error);
        throw error;
        
    }finally {
  
        if (res2.redirected) {

            if(res2.url.include("/auth/signout")){
                alert("로그인 만료되었습니다 재로그인해주세요")
            }

            if(window.opener){
                window.close()
                window.opener.location.href = res2.url
            }else{
                window.location.href = res2.url
            }


        }



        //return res2

    }


}

    
export default {boaGet, boaPost, boaPost_formData}

