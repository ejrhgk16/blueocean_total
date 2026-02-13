'use client'
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SelectOption from "@/components/FormElements/SelectOption";
import { STORE_STATUS } from "@/constants/codeList";
import { formatTimeStamp } from "@/boaUtil/dateUtil";
//import { cookies } from "next/headers";


const Page = (props : any) => {

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [custDetail, setCustDetail] = useState<any>({}); 
  const [statusList] = useState<any[]>(Object.values(STORE_STATUS));

  const store_code = props.params.code;

    // useEffect로 초기 데이터를 fetch
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        
        const targetUrl1 = '/api/store/db/list/detail'
        const res1 = await fetchToFrontServer.boaGet(targetUrl1, {id : id, store_code:store_code})
        
        const result1 = await res1.json()
        
        setCustDetail(result1.data)
 

      } catch (error) {
      }
    };

    
    fetchData();
  }, []);


  const sendData = async ()=>{
    const targetUrl = "/api/store/db/list/detail/update"

    const body = {
      ...custDetail
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
                {custDetail.page_name +" -- "+custDetail.media_name+" -- "+custDetail.event_name+" -- "+formatTimeStamp(custDetail.last_update)}
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
                      type="text" defaultValue={custDetail.cust_name}
                      placeholder="Enter"
                      disabled
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      연락처
                    </label>
                    <input
                      type="text" defaultValue={custDetail.cust_phone_number}
                      disabled
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      나이
                    </label>
                    <input
                      type="text" defaultValue={custDetail.cust_age}
                      disabled
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

              <span className="mb-3 block text-sm font-medium text-black dark:text-white">상태</span>
                <SelectOption subject={"상태"} optionList={statusList} selectedValue={custDetail.status} selectFnc={selectOptionStatus} key={"statusSelect"} />
                <br></br>
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      추가정보
                  </label>
                  <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    {Array.isArray(custDetail.info_data)?custDetail.info_data?.map((item:any, index:any)=>(
                      <div key={"q_123"+index}>

                        <p className="w-full max-w-[452px] font-medium">
                          Q{index+1}
                        </p>

                        <p className="w-full max-w-[452px] font-small">
                          {item.q} : {item.a}
                        </p>

                        <br></br>
                      </div>
                    )):
                    
                    <div>
                      {
                        custDetail.info_data
                      }

                    </div>
                    
                    }
                    
                  </div>
                </div>


                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    메모
                  </label>
                  <textarea
                    rows={6}
                    defaultValue={custDetail.memo}
                    onChange={(e)=>{onChangeValue("memo", e.target.value)}}
                    placeholder="메모를 입력하세요"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
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
