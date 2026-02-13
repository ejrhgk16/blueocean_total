'use client'
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import XButtonWithName from "@/components/FormElements/xbutton";

import InputSearchList from "@/components/FormElements/inputSearchList";
import { useRouter, useSearchParams } from "next/navigation";
import SelectOption from "@/components/FormElements/SelectOption";
//import { cookies } from "next/headers";




const Page = (props :any) => {

  const searchParams = useSearchParams()
  const checkListAsString = searchParams.get('list')
  const checkList = JSON.parse(decodeURIComponent(checkListAsString as string));

  const [deliveryList, setDeliveryList] = useState<any[]>([]); 
  const [pageList, setPageList] = useState<any[]>([]);

  const [selectedStoreCode, setSelectedStoreCode] = useState('')
  const [selectedPageCode, setSelectedPageCode] = useState('')

    useEffect(() => {
    
      const fetchData = async () => {
        try {
          
          const targetUrl2 = '/api/store/db/manage/delivery'
          const res2 = await fetchToFrontServer.boaGet(targetUrl2, {list : checkList})
          const result2 = await res2.json()


          setDeliveryList(result2.data)

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      
      fetchData();
    }, []);
  


  const sendData = async ()=>{
    const targetUrl = "/api/store/db/manage/delivery/update"

    const body = {
      store_code : selectedStoreCode,
      page_code : selectedPageCode,
      deliveryList : deliveryList
    }

    try {
      const res  = await fetchToFrontServer.boaPost(targetUrl, body)
      if(res.ok){
        alert("저장 성공 ::: !")
        //window.opener.location.reload()
        window.close()
      }
      else{alert("저장실패 :: !")}
    } catch (error) {
      alert("서버에러 발생 :: !")
      
    }
    
  }



  const inputSearchFnc =  async (searchWord:any)=>{

    //초기화
    setSelectedStoreCode('')
    setSelectedPageCode('')
    setPageList([])
    
    const targetUrl = "/api/common/search/store"
    const param = {searchWord : searchWord}
    const res = await fetchToFrontServer.boaGet(targetUrl, param)
    const result = await res.json()

    if(result.data){
      const newData=result.data?.map((item : any)=>{
        return {...item, text:item.store_name, value:item.store_code}
      })
      return newData
    }else{
      return []
    } 
  }

  const inputSearchItemClickFnc1 = useCallback(async (item:any)=>{ 

    setSelectedStoreCode(item.value)
    setSelectedPageCode('')

    const targetUrl2 = '/api/store/db/manage/delivery/page' // <<<<
    const res2 = await fetchToFrontServer.boaGet(targetUrl2, {store_code : item.value});
    const result = await res2.json()

    setPageList(result.data)

  },[])


  const selectOption = useCallback((page_code : any)=>{
    
    // const pageObj = pageList?.map((item)=>{
    //   if(item.page_code == page_code) return {...item}
    // })

    setSelectedPageCode(page_code)

  },[])


  return (

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                  고유번호{checkListAsString} 전달
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">

              <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    상점선택
                  </label>

                  <InputSearchList id="1" subject={"상점"} searchFnc={inputSearchFnc} itemClickFnc={inputSearchItemClickFnc1} key={"adnubInputSearch"} ></InputSearchList >
                </div>


                <SelectOption subject={"랜딩"} optionList={pageList} selectedValue={selectedPageCode} selectFnc={selectOption} key={"statusSelect"} />

    
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendData}>
                  저장하기
                </button>
              </div>
            {/* </form> */}
          </div>

  );
};


export default Page;
