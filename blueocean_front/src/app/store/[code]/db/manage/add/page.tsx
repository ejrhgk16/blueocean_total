'use client'
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SelectOption from "@/components/FormElements/SelectOption";
import { STORE_STATUS } from "@/constants/codeList";
//import { cookies } from "next/headers";


const Page = (props:any) => {

  const store_code = props.params.code;

  const [custDetail, setCustDetail] = useState<any>({}); 
  const [statusList] = useState<any[]>(Object.values(STORE_STATUS));


  const sendData = async ()=>{
    const targetUrl = "/api/store/db/manage/add"

    const body = {
      ...custDetail,
      store_code:store_code
    }

    try {
      const res  = await fetchToFrontServer.boaPost(targetUrl, body)
      if(res.ok){
        alert("저장 성공 ::: !")
        window.opener.location.reload()
        window.close()
      }
      else{alert("저장실패 :: !")}
    } catch (error) {
      alert("서버에러 발생 :: !")
      
    }
    
  }





  const selectOptionStatus = (value : any)=>{
    setCustDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      status: value   // name 키의 값만 변경
    }));
  }



  const onChangeValue = (name:any, value:any)=>{
    setCustDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      [name]: value.trim()   // name 키의 값만 변경
    }));
  }


  return (

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                DB직접추가
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      고객명
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                      onChange={(e)=>{onChangeValue("cust_name", e.target.value)}}
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      연락처
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>{onChangeValue("cust_phone_number", e.target.value)}}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    기타
                  </label>
                  <textarea
                    rows={6}
                    defaultValue={custDetail.memo}
                    onChange={(e)=>{onChangeValue("info_data", e.target.value)}}
                    placeholder="info_data"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>

                
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      랜딩 코드
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>{onChangeValue("page_code", e.target.value)}}
                    />
                  </div>
                </div>



                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendData}>
                  저장하기
                </button>
              </div>
            {/* </form> */}
          </div>

  );
};


export default Page;
