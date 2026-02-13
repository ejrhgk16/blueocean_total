'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import {formatTimeStamp} from "@/boaUtil/dateUtil";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CheckboxOne from "@/components/Checkboxes/CheckboxOne";
import Pagination from "@/components/paging/Pagination";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "@/components/searchBox/SearchBox";
import Datepicker from "react-tailwindcss-datepicker";
import Tooltip from "@/components/Tooltip/tooltip";
import { STORE_STATUS } from "@/constants/codeList";
//import { cookies } from "next/headers";

const Page = (props:any) => {


  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터
  const [pagingInfo, setPagingInfo] = useState<Record<string,any>>({}); // 검색어 상태 관리

  const store_code = props.params.code;


    // useEffect로 초기 데이터를 fetch

    const fetchData = useCallback((param={}) => {
      fetchdd(param)
    }, []);
  

  const fetchdd = async (param={}) => {
    try {
      const targetUrl = '/api/store/ad/manage'
      const param2 = {...param, store_code : store_code} 
      const res = await fetchToFrontServer.boaGet(targetUrl,param2)
      const result = await res.json()

      setAllData(result.data.list); // 원본 데이터를 설정
      setPagingInfo(result.data.paging)

    } catch (error) {
    }
  };

  useEffect(() => {

    fetchData({store_code : store_code});
  }, []);



  return (

    <DefaultLayout type={'store'}>
    <Breadcrumb pageName="광고관리" />

    <div className="mb-6">
      <SearchBox fetchData={fetchData} placeholder={"검색어 입력"}></SearchBox> 

    </div>

    <button onClick={()=>{window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/store/"+store_code+"/ad/manage/add", '추가', 'width=610,height=900');}} type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" >추가</button>

    <br></br>
 

    <div className="flex flex-col gap-10">
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-center dark:bg-meta-4">
              {/* <th className="min-w-[15px] px-4 py-4 font-medium text-black dark:text-white">
                
              </th> */}
              <th className="min-w-[15px] px-4 py-4 font-medium text-black dark:text-white">
                고유
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                랜딩코드
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                랜딩명
              </th>
              <th className="min-w-[300px] px-4 py-4 font-medium text-black dark:text-white">
               url
              </th>
              <th className="min-w-[15] px-4 py-4 font-medium text-black dark:text-white">
                활성화
              </th>
              <th className="min-w-[50] px-4 py-4 font-medium text-black dark:text-white">
                매체
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
               이벤트
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
               등록일
              </th>
            </tr>
          </thead>
          <tbody>
            {alldata?.map((item, key) => (
              <tr key={key} className="text-center hover:bg-slate-100" 
              onDoubleClick={()=>{window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/store/"+store_code+"/ad/manage/detail?page_code="+item.page_code+"&store_code="+ store_code, '상세페이지', 'width=610,height=900')}}>
                {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                  <input type="checkbox" style={{zoom:1.5}} checked={checkList?.includes(item.store_code)} onChange={(e)=>{checkboxChange(e.target.checked, item.store_code)}}></input>

                </td> */}

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center" >
                  <h5 className="text-black dark:text-white font-medium">
                    {/* <Link href={process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/boa/client/store/detail?store_code="+item.store_code} rel="noopener noreferrer" target="_blank" className="hover:underline" onClick={(e)=>{
                      e.preventDefault();
                      const target = e.target as HTMLAnchorElement
                      window.open(target.href, '상세페이지', 'width=550,height=700');
                      
                    }}>
                      {item.pageName}
                    </Link> */}
                    {item.page_id}                
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark " >
                  <h5 className="text-black dark:text-white">
                    {item.page_code}
                  </h5>
                </td>
                
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.page_name}
                  </p>

                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">

                  <h5 className="font-medium text-c-blue dark:text-white ">
                    <Link href={item.url} rel="noopener noreferrer" target="_blank" className="hover:underline" onDoubleClick={(e)=>{e.stopPropagation()}} 
                    onClick={(e)=>{
                      e.preventDefault();
                      const target = e.target as HTMLAnchorElement
                      window.open(target.href);
                      
                    }}>{item.url}</Link>
                  </h5>

                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">

                  {/* {item.info_data ? <Tooltip message={item.info_data}>
                    <h5 className="text-black dark:text-white">
                      
                        {item.info_data.length > 20 ? item.info_data.substring(0, 15) + '...' : item.info_data}
                     
                    </h5>
                    </Tooltip>

                    : null
                    } */}

                  <p className="text-black dark:text-white">
                    {item.status}
                  </p>

                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">

                  {/* {item.memo ? <Tooltip message={item.memo}>
                    <h5 className="text-black dark:text-white">
                      
                        {item.memo.length > 20 ? item.memo.substring(0, 15) + '...' : item.memo}
                     
                    </h5>
                    </Tooltip>

                    : null
                    } */}
                    {item.media_name}

                </td>
                

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.event_name}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                   <p className="text-black dark:text-white">
                    {formatTimeStamp(item.last_update)}
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


export default Page;
