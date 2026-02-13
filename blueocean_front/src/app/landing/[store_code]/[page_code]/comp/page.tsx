'use client'
import fetchToFrontServer_csr from "@/boaUtil/fetchToFrontServer_csr";
import SelectOption from "@/components/FormElements/SelectOption";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "@/css/layout2.css"
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const Page =  (props:any) => {

  const searchParams = useSearchParams()
  const replace_page_code = searchParams.get("replace_page_code")
  const store_code = props.params.store_code;
  let page_code = props.params.page_code;

  let comp_img_path = "https://"+ process.env.NEXT_PUBLIC_S3_URL +"/img/"+store_code+'/'+page_code+'/'+'comp'

  if(replace_page_code){
    comp_img_path = "https://"+ process.env.NEXT_PUBLIC_S3_URL +"/img/"+store_code+'/'+replace_page_code+'/'+'comp'
  }

  const [compScript, setCompScript] = useState<Record<string,any>>({scriptList:[], noscriptList:[]}); // 초기 전체 데이터

  

  useEffect(() => {
    console.log("sscc :: " )
    // 받아온 script 태그의 내용을 직접 실행
    // let scriptContent = pageInfo.scriptList

    
    let addedScripts : any[] = [];
    compScript.scriptList.forEach((element : any, index:any) => {
      if (element.script_content) {

  
        // 이미 존재하는 스크립트인지 확인
        const existingScript = document.querySelector(`script[data-custom="${element.num}"]`);
        if (existingScript) {
          return;
        }
  
        const script = document.createElement('script');
        script.textContent = element.script_content;
        script.setAttribute('data-custom', element.num); // 고유 식별자 추가
  
        try {
          document.head.appendChild(script);
          addedScripts.push(script);
        } catch (error) {
          console.error('스크립트 추가 중 오류 발생:', error);
        }
      }
    });

    compScript.noscriptList.forEach((element : any, index:any) => {
      if (element.script_content) {

  
        // 이미 존재하는 스크립트인지 확인
        const existingScript = document.querySelector(`noscript[data-custom="${element.num}"]`);
        if (existingScript) {
          return;
        }
  
        const script = document.createElement('noscript');
        script.textContent = element.script_content;
        script.setAttribute('data-custom', element.num); // 고유 식별자 추가
  
        try {
          document.body.appendChild(script);
          addedScripts.push(script);
        } catch (error) {
          console.error('스크립트 추가 중 오류 발생:', error);
        }
      }
    });
  
    // 클린업 함수
    return () => {
      addedScripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      });
    };

  }, [compScript]);

  useEffect(()=>{
    fetchdd2()
  }, [])

  const fetchdd2 = async () => {
    const targetUrl = '/api/landing/comp/script'
    const res = await fetchToFrontServer_csr.boaGet(targetUrl,{store_code : store_code, page_code : page_code})
    const result = await res.json()

    const noscriptList : any[] = []
    const scriptList : any[] = []
  
    result.data?.forEach((item:any) => {

   
      if(item.script_content?.indexOf("noscript") > -1){
        let sc = item.script_content?.replace(/<\/?noscript>/g, '').trim();
  
        item.script_content = sc.replace(/<!--[\s\S]*?-->/g, '');
        
        noscriptList.push(item)
      }else{
        let sc = item.script_content?.replace(/<\/?script>/g, '').trim();
  
        item.script_content = sc.replace(/<!--[\s\S]*?-->/g, '');
        scriptList.push(item)
      }
    });

    setCompScript({noscriptList:noscriptList, scriptList:scriptList})
  }

  
  return (

    <div className="lg:mx-auto lg:max-w-5xl">


        <div className="flex flex-col items-center min-h-screen min-w-screen">
         
            <Image key={"comp_img"}
              src={comp_img_path} // 이미지 파일 경로
              alt="main"
              width={1500} // 최대 너비
              height={400} // 최대 높이
              className="w-full h-auto"
            /> 
        </div>
      </div>

  )
};


export default Page;
