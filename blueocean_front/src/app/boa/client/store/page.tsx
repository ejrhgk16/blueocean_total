'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";


import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "@/components/paging/Pagination";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "@/components/searchBox/SearchBox";
import { formatTimeStamp } from "@/boaUtil/dateUtil";
//import { cookies } from "next/headers";


const ClientStorePage = () => {

  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터
  const [pagingInfo, setPagingInfo] = useState<Record<string,any>>({}); // 검색어 상태 관리
  const [checkList, setCheckList] = useState<any[]>([]); // 초기 전체 데이터


    // useEffect로 초기 데이터를 fetch

    const fetchData = useCallback((param={}) => {
      fetchdd(param)
    }, []);
  

  const fetchdd = async (param={}) => {
    try {
      const targetUrl = '/api/admin/client/store/list'
      const res = await fetchToFrontServer.boaGet(targetUrl,param)
      const result = await res.json()

      setAllData(result.data.storeList); // 원본 데이터를 설정

      setPagingInfo(result.data.paging)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {


    fetchdd();
  }, []);

  const checkboxChange = (isChecked:any, store_code:any)=>{

    if(isChecked){
      addCheckList(store_code)
    }else{
      removeCheckList(store_code)
    }

  }

  const addCheckList = (store_code :any) => {
    setCheckList([...checkList, store_code]);
  };

  const removeCheckList = (store_code:any) =>{

    setCheckList(checkList.filter(item => item !== store_code));
  }

  const onClickStatusButton = async(status:any)=>{
    const param = {status : status, storeCodeList : checkList}


    if(checkList.length == 0){
      alert("체크된 리스트 없음 :: ")
      return
    }

    try {
      const targetUrl = '/api/admin/client/store/status'
      const res = await fetchToFrontServer.boaPost(targetUrl,param)
      if(res.ok){
        alert("변경 완료 :: ")
        window.location.reload()
      }else{
        alert("실패 ::: ")
      }


    } catch (error) {
      alert("실패 ::: ")
    }
  
  }



  return (

    <DefaultLayout>
    <Breadcrumb pageName="클라이언트 관리" />
    
    <SearchBox fetchData={fetchData}></SearchBox>
        
    <br></br>

    <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=>{window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/boa/client/store/add", '상세페이지', 'width=590,height=700');}}>추가</button>
    <button type="button" className="text-white bg-blue-700 hover:bg-opacity-90 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={()=>{onClickStatusButton('Y')}}>일괄활성화</button>
    <button type="button" className="text-white bg-red hover:bg-opacity-90 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-red-300 focus:outline-none dark:focus:ring-blue-800" onClick={()=>{onClickStatusButton('N')}}>일괄비활성화</button>

    <br></br> 

    <div className="flex flex-col gap-10">
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-center dark:bg-meta-4">
              <th className="min-w-[15px] px-4 py-4 font-medium text-black dark:text-white">
                
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                코드
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                상점명
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                항목
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                담당자
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
               등록일
              </th>
              <th className="min-w-[60px] px-4 py-4 font-medium text-black dark:text-white">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {alldata?.map((item, key) => (
              <tr key={key} className="text-center">
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                  <input type="checkbox" style={{zoom:1.5}} checked={checkList?.includes(item.store_code)} onChange={(e)=>{checkboxChange(e.target.checked, item.store_code)}}></input>

                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center" >
                  <h5 className="text-black dark:text-white font-medium">
                    <Link href={process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/boa/client/store/detail?store_code="+item.store_code} rel="noopener noreferrer" target="_blank" className="hover:underline" onClick={(e)=>{
                      e.preventDefault();
                      const target = e.target as HTMLAnchorElement
                      window.open(target.href, '상세페이지', 'width=590,height=700');
                      
                    }}>
                      {item.store_code}
                    </Link>                 
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark " >
                  <h5 className="text-black dark:text-white">
                    {item.store_name}
                  </h5>
                </td>
                
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.client_type_name}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.user_name}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatTimeStamp(item.register_time)}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.status}
                  </p>
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>

    <Pagination pageInfo={pagingInfo} fetchData={fetchData} key={"storeList"}></Pagination>

    
  </DefaultLayout>

  );
};


export default ClientStorePage;
