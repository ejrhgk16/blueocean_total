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

  const privacy_num = searchParams.get('privacy_num')
  const store_code = props.params.store_code;
  const page_code = props.params.page_code;

  const [privacyText, setPrivacyText] = useState();



  const fetchdd = async () => {
    const targetUrl = '/api/landing/privacy'

    
    try {

      const res = await fetchToFrontServer_csr.boaGet(targetUrl,{page_code : page_code, store_code:store_code, privacy_num : privacy_num})
      const result = await res.json()
    
      setPrivacyText(result.data.privacy_content)

    } catch (error) {
      console.error('Error fetching data:', error);
    }


  }

  useEffect(() => {

    fetchdd();
  }, []);



  return (

      <div className="min-h-screen ">
        <br></br>
        <Breadcrumb pageName="개인 정보 수집 및 이용" />
        <div style={{ whiteSpace: 'pre-line' }}>
        {privacyText}

        </div>
        <br></br>
        <div className="">
        <button onClick={()=>{window.close()}} type="button" className="text-white bg-blue-700 hover:bg-opacity-90 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" >확인</button>

        </div>

        

    </div>

  )
};


export default Page;
