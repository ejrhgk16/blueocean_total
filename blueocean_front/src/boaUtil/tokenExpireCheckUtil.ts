import Cookies from 'js-cookie'
import fetchToFrontServer from './fetchToFrontServer_csr';

export async function checkIsExpire(){

    const expire_time = Cookies.get('expire_time') || '';
    const expire_time_date = new Date(expire_time);
    const currentDate = new Date();


    
    const isExpire = currentDate > expire_time_date 
      ? true : false


    if(isExpire){
      const url = '/api/auth/refresh'
      const res = await fetchToFrontServer.boaGet(url)
      if(res.ok) {
        return false
      }else{
         alert("로그인 만료되었습니다 재로그인해주세요")
        if(window.opener){
            window.close()
            window.opener.location.href = '/auth/signout'
        }else{
            window.location.href = '/auth/signout'
        }

      }

    }else return false
    

}