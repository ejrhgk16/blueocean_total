import { NextRequest, NextResponse } from "next/server"
import logger from "./logger"

export async function boaGet(targetUrl:string, nextReq :NextRequest ,successCallback:(x?:any)=>any=()=>{}, credentials=''){//NextRequest, NextResponse
    
    //토큰 저장 처리후 사용하는거
    //const token = req.cookies?.['token'];
      //const targetUrl = req.query.url as string;
      
    const searchParams = new URLSearchParams(nextReq.nextUrl.searchParams)
    const current_page = nextReq.headers.get('referer') ?? ''

    //searchParams.set('current_page', current_page);
    // console.log("searchParams :: " , searchParams)

    const store_code = searchParams.get('store_code')

    const params = searchParams.toString();

    const url = process.env.BACK_DOMAIN + targetUrl + "?" + params

    // console.log("url : ", url)

    const access_token = nextReq.cookies.get("access_token")
    //const access_token = nextReq.headers.get("Authorization") //이런식으로 한번더 넣어줘야할듯

    var option :Record<string, any> = {};

    const xRealIp = nextReq.headers.get("x-real-ip") || '::1'

    option.method = 'GET'
    
    option.headers = {"Content-Type" : "application/json", "Authorization" : "Bearer "+access_token?.value, "x-real-ip" : xRealIp}
    
    option.headers['current_page'] = current_page 
    option.headers['store_code'] = store_code

    option.cache = 'no-store';
    option.credentials = 'include'

    
 

    const res = await fetch(url, option);
    // console.log("boaget1")
    // console.log(successCallback.toString())

    if(res.ok){
      const result = await res.json()//body읽어오는거
      
      const callbackResult = successCallback(result);

      
      var resReturnData;
      
      if(callbackResult){
        resReturnData = callbackResult
      }else{
        resReturnData = result
      }

      return NextResponse.json({data: resReturnData}, {status : res.status})

    }else{
      
      const callback = async (headers : any)=>{

        option.headers = headers

        option.headers['current_page'] = current_page 
        option.headers['store_code'] = store_code

        const res = await fetch(url, option);
        return res
      }
      // console.log("boaget2")
      // console.log(successCallback.toString())
      const nextRes2 = await errorHandler(res, nextReq, callback, successCallback)
      return nextRes2
    }

  
  }

async function boaPost(targetUrl:string, nextReq :NextRequest, successCallback:(x?:any)=>any=()=>{}, isForm_YN = 'N', credentials = ''){
    
    const url = process.env.BACK_DOMAIN + targetUrl

    const reqBody = await nextReq.json();

    const store_code = reqBody.store_code;
    // console.log('store_code post' , store_code)

    const current_page = nextReq.headers.get('referer') ?? ''
    // reqBody.current_page = current_page

    const access_token = nextReq.cookies.get("access_token")
    //const access_token = nextReq.headers.get("Authorization") //이런식으로 한번더 넣어줘야할듯

    const xRealIp = nextReq.headers.get("x-real-ip") || '::1'

    var option :Record<string, any> = {};

    option.method = 'POST'

    option.headers = {"Content-Type" :  "application/json", "Authorization" : "Bearer "+access_token?.value, "x-real-ip":xRealIp}
    
    option.headers['current_page'] = current_page 
    option.headers['store_code'] = store_code

    option.body = JSON.stringify(reqBody),
    option.cache = 'no-store';
    option.credentials = 'include'

    const res = await fetch(url, option);


    if(res.ok){
      const result = await res.json()

      const callbackResult = successCallback(result);
      
      var resReturnData;
      
      if(callbackResult){
        resReturnData = callbackResult
      }else{
        resReturnData = result
      }

      return NextResponse.json({data : resReturnData}, {status : res.status})
      
    }else{
      const callback = async (headers : any)=>{

        option.headers = headers

        option.headers['current_page'] = current_page 
        option.headers['store_code'] = store_code

        const res = await fetch(url, option);
        return res
      }
      const nextRes2 = await errorHandler(res, nextReq, callback, successCallback )
      return nextRes2
    }


}

async function boaPost_formData(targetUrl:string, nextReq :NextRequest, successCallback:(x?:any)=>any=()=>{}, credentials = ''){
    
  const url = process.env.BACK_DOMAIN + targetUrl


  // const formData = await nextReq.formData();
  // const reqBody = Object.fromEntries(formData)
  //console.log(formData)
  //console.log(Object.fromEntries(formData))
  const formData = await nextReq.formData();
  const newFormData = new FormData();

  Array.from(formData.entries()).forEach(([key, value]) => {
    newFormData.append(key, value);
  });
  
  const store_code = formData.get("store_code");
  const current_page = nextReq.headers.get('referer') ?? ''
  // newFormData.append('current_page', current_page)

  
  const access_token = nextReq.cookies.get("access_token")
  //const access_token = nextReq.headers.get("Authorization") //이런식으로 한번더 넣어줘야할듯
  //console.log(reqBody);

  const xRealIp = nextReq.headers.get("x-real-ip") || '::1'

  var option :Record<string, any> = {};

  option.method = 'POST'

  option.headers = {"Authorization" : "Bearer "+access_token?.value, "x-real-ip" : xRealIp}
  
  option.headers['current_page'] = current_page 
  option.headers['store_code'] = store_code

  option.body = formData,
  option.cache = 'no-store';
  option.credentials = 'include'

  try {
    const res = await fetch(url, option);
    if(res.ok){
      const result = await res.json()
      const callbackResult = successCallback(result);
      
      var resReturnData;
      
      if(callbackResult){
        resReturnData = callbackResult
      }else{
        resReturnData = result
      }
  
      return NextResponse.json({data : resReturnData}, {status : res.status})
      
    }else{
      const callback = async (headers : any)=>{
  
        option.headers = headers
        option.headers['current_page'] = current_page 
        option.headers['store_code'] = store_code
   
        try {
          const res = await fetch(url, option);
          return res
        } catch (error) {
          console.log(error)
        }
        
       
      }
      const nextRes2 = await errorHandler(res, nextReq, callback,  successCallback, "Y")
      return nextRes2
    }
  
  } catch (error) {
    console.log(error)
  }
  


  

}

async function errorHandler(errorRes : Response, nextReq :NextRequest, callback=async (headers : any):Promise<any>=>{}, successCallback:(x?:any)=>any=()=>{}, isForm_YN : any = "N"){
  const status = errorRes.status

  const xRealIp = nextReq.headers.get("x-real-ip") || '::1'

  const ip = xRealIp
  const pathname = nextReq.nextUrl.pathname;

  const today = new Date()

  if(status >= 500){
    logger.error(today+" [" + pathname+"]" +" ::: "+ status + " ::: " + ip)
    throw new Error("서버 에러 ::: ")
  }


  const errorResult = await errorRes.json();

  if(errorResult.errorCode != '4001'){//4001 : AccessTokenExpired'
    logger.error(today + " [" + pathname+"]" +" ::: "+ errorResult.errorCode + " ::: " + ip)
  }


  switch(status){

      case 401 : 


          
          if(errorResult.errorCode != '4001'){//4001 : AccessTokenExpired'
          }


          if(errorResult.errorCode == '4005'){//4005 : RoleException'
            return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/error_role")
          }


          var option :Record<string, any> = {};

          const refresh_token = nextReq.cookies.get('refresh_token')

          option.method = 'GET'
          option.headers = {"Content-Type" : "application/json", 'Cookie':'refresh_token='+refresh_token?.value}
          option.cache = 'no-store';
          option.credentials = 'include'

          const refreshRes = await fetch(process.env.BACK_DOMAIN+"/auth/token/refresh", option);
          if(refreshRes.ok){
              const refreshResult = await refreshRes.json()

              var headers :Record<string, any> = {};

              //이게문제 form-data contenttype 문제 formdata일경우 그냥 없애줘야할듯 
              if(isForm_YN == "Y"){
                headers = {"Authorization" : "Bearer "+refreshResult.access_token}
              }else{
                headers = {"Content-Type" : "application/json", "Authorization" : "Bearer "+refreshResult.access_token}
              }
              

              //토큰 재발급후 기존 요청
              const res2 =await callback(headers);
              const result2 = await res2.json()

              // console.log("successCallback")
              // console.log(successCallback.toString())

              const callbackResult = successCallback(result2);

      
              let resReturnData;
              
              if(callbackResult){
                resReturnData = callbackResult
              }else{
                resReturnData = result2
              }
        

              const nextRes = NextResponse.json({data : resReturnData}, {status : res2.status})

              //이 영역 맨위에서 실행되는게 맞는듯 
              nextRes.cookies.set({name:'refresh_token', value:refreshResult.refresh_token, httpOnly:true, secure:process.env.NODE_ENV === 'production',  path:"/", sameSite  : 'strict', maxAge: 24 * 60 * 60})
              nextRes.cookies.set({name:'access_token', value:refreshResult.access_token, httpOnly:true, secure:process.env.NODE_ENV === 'production', path:"/", sameSite  : 'strict', maxAge: 24 * 60 * 60,})
              nextRes.cookies.set({name:'expire_time', value:refreshResult.expire_time, httpOnly:false, secure:process.env.NODE_ENV === 'production', path:"/", sameSite  : 'strict', maxAge: 24 * 60 * 60,})
     
              return nextRes

          }else{//토큰만료 재로그인
            //const nextRes = NextResponse.json({status : 401})
            return NextResponse.redirect(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/auth/signout")
          }    
          
      }

      const nextRes = NextResponse.json({status : 401})
      return nextRes
      
}

export async function boaGet_noToken(targetUrl:string, nextReq :NextRequest ,successCallback:(x?:any)=>any=()=>{}, credentials=''){//NextRequest, NextResponse
  
  //토큰 저장 처리후 사용하는거
  //const token = req.cookies?.['token'];
    //const targetUrl = req.query.url as string;
    

  const searchParams = new URLSearchParams(nextReq.nextUrl.searchParams)
  const params = searchParams.toString();


  const url = process.env.BACK_DOMAIN + targetUrl + "?" +nextReq.nextUrl.searchParams

  const xRealIp = nextReq.headers.get("x-real-ip") || '::1'

  var option :Record<string, any> = {};

  option.method = 'GET'
  option.headers = {"Content-Type" : "application/json", "x-real-ip":xRealIp}

  option.cache = 'no-store';
  option.credentials = 'include'

  const res = await fetch(url, option);


  const result = await res.json()//body읽어오는거
  
  const callbackResult = successCallback(result);

  var resReturnData;
  
  if(callbackResult){
    resReturnData = callbackResult
  }else{
    resReturnData = result
  }

  return NextResponse.json({data: resReturnData}, {status : res.status})



}

async function boaPost_noToken(targetUrl:string, nextReq :NextRequest, successCallback:(x?:any)=>any=()=>{}, isForm_YN = 'N', credentials = ''){
  
  const url = process.env.BACK_DOMAIN + targetUrl

  const reqBody = await nextReq.json();
  
  const access_token = nextReq.cookies.get("access_token")
  //const access_token = nextReq.headers.get("Authorization") //이런식으로 한번더 넣어줘야할듯

  const xRealIp = nextReq.headers.get("x-real-ip") || '::1'

  var option :Record<string, any> = {};

  option.method = 'POST'

  option.headers = {"Content-Type" :  "application/json", "x-real-ip":xRealIp}

  option.body = JSON.stringify(reqBody),
  option.cache = 'no-store';
  option.credentials = 'include'

  const res = await fetch(url, option);


  const result = await res.json()

  const callbackResult = successCallback(result);
  
  var resReturnData;
  
  if(callbackResult){
    resReturnData = callbackResult
  }else{
    resReturnData = result
  }

  return NextResponse.json({data : resReturnData}, {status : res.status})
  



}

async function boaPost_external(targetUrl:string, body:any, successCallback:(x?:any)=>any=()=>{}, isForm_YN = 'N', credentials = ''){
  
  const url = targetUrl

  const reqBody = body

  const newFormData = new FormData();

  const keys = Object.keys(body);

 
  keys.forEach(key => {
    newFormData.append(key, body[key]); // 동적으로 키를 사용하여 값 추가
  });

  
  let option :Record<string, any> = {};

  option.method = 'POST'

  // option.headers = {"Content-Type" :  "application/json"}

  option.body = newFormData,
  option.cache = 'no-store';
  // option.credentials = 'include'

  // console.log("option ", option)

  const res = await fetch(url, option);


  const result = await res.json()

  // console.log("api " , result)

  const callbackResult = successCallback(result);
  
  var resReturnData;
  
  if(callbackResult){
    resReturnData = callbackResult
  }else{
    resReturnData = result
  }

  return NextResponse.json({data : resReturnData}, {status : res.status})
  



}



export default {boaGet, boaPost, boaPost_formData, boaGet_noToken, boaPost_noToken, boaPost_external}