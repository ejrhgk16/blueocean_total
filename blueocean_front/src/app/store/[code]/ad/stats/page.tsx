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

function formatDate(date : any){
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = date.getDate().toString().padStart(2, '0');

  return year+'/'+month+'/'+day
}


const Page = (props:any) => {


  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터
  const [pagingInfo, setPagingInfo] = useState<Record<string,any>>({}); // 검색어 상태 관리

  const store_code = props.params.code;

  let today = new Date()
  let before30day = new Date()
  before30day.setDate(today.getDate() - 60);

  const [dateValue, setDateValue] = useState({ 
    startDate: before30day, 
    endDate: today
  });


    // useEffect로 초기 데이터를 fetch

    const fetchData = useCallback((param={}) => {
      fetchdd(param)
    }, []);
  

  const fetchdd = async (param={}) => {
    try {
      const targetUrl = '/api/store/ad/stats'
      const param2 : Record<string,any> = {...param, store_code : store_code} 
      const res = await fetchToFrontServer.boaGet(targetUrl,param2)
      const result = await res.json()

      setAllData(result.data.list); // 원본 데이터를 설정
      const paging = {...result.data.paging, startDate : param2.startDate, endDate:param2.endDate}
      setPagingInfo(paging)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  

  useEffect(() => {

    fetchData({store_code : store_code, startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)});
  }, []);



  return (

    <DefaultLayout type={'store'}>
    <Breadcrumb pageName="광고현황" />

    <div className="mb-6">

    <div className="w-full">

      <SearchBox fetchData={fetchData} placeholder={"검색어 입력"} 
        param={{...pagingInfo, pageNum : null , startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)}}>
      </SearchBox>

      <br></br>

      </div>
      <div className="mx-auto flex gap-3">
        <div className="flex-grow"> 
          <Datepicker 
          value={dateValue} 
          onChange={(newValue:any) => {
            setDateValue({startDate:newValue.startDate, endDate:newValue.endDate})
          }}  /> 
          </div>

          <button type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" 
          onClick={()=>{ fetchData({store_code : store_code, ...pagingInfo, pageNum : null, startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)}) }}>
            조회</button>
          
        </div>





    </div>
 

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
              <th className="min-w-[15] px-4 py-4 font-medium text-black dark:text-white">
                활성화
              </th>
              <th className="min-w-[50] px-4 py-4 font-medium text-black dark:text-white">
                매체
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
               이벤트
              </th>
              <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">
                전체방문수
              </th>
              <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">
               전체등록수
              </th>
              <th className="min-w-[50px] px-4 py-4 font-medium text-black dark:text-white">
               기간등록수
              </th>
              <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
               등록일
              </th>
            </tr>
          </thead>
          <tbody>
            {alldata?.map((item, key) => (
              <tr key={key} className="text-center hover:bg-slate-100">
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
                    {item.visit_count}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.reg_count_total}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.reg_count_period}
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
