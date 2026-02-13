'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";


import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useEffect, useState } from "react";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocalStorage";
import { formatDate, formatTimeStamp } from "@/boaUtil/dateUtil";
import { checkIsExpire } from "@/boaUtil/tokenExpireCheckUtil";
//import { cookies } from "next/headers";




const  TablesPage = () => {

  const targetUrl = '/api/admin/dashboard'

  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터
  const [filteredData, setFilteredData] = useState<any[]>([]); // 필터링된 데이터
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리
  const [current_store_code, setCurrent_store_code] = useLocalStorage('current_store_code', '');
  const [current_store_name, setCurrent_store_name] = useLocalStorage('current_store_name', '');


    // useEffect로 초기 데이터를 fetch
    useEffect(() => {
      
      const fetchData = async () => {
        try {
          const res = await fetchToFrontServer.boaGet(targetUrl)
          const result = await res.json()
          setAllData(result.data); // 원본 데이터를 설정
          setFilteredData(result.data); // 필터링된 데이터를 원본 데이터로 초기화
        } catch (error) {
        }
      };

      
      fetchData();
    }, []);


      // 검색어 입력 및 Enter 키 입력 시 데이터 필터링
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 검색어가 공백이 아니면 데이터를 필터링
      if (searchTerm.trim()) {
        const filtered = alldata.filter(item => 
          item.store_name.toLowerCase()?.includes(searchTerm.toLowerCase()) // 조건에 맞게 필터링
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(alldata); // 검색어가 없을 경우 원본 데이터를 다시 설정
      }
    }
  };

    // 검색어 상태 관리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  

  return (

    <DefaultLayout>
    <Breadcrumb pageName="클라이언트 리스트" />
    <div className="hidden sm:block">

          
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="클라이언트 검색"
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125" onChange={handleChange} onKeyDown={handleSearch} 
              />
            </div>
       
        </div>

        
      <br></br>


    <div className="flex flex-col gap-10">
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-center dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
              클라이언트
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
              당월등록
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                전일등록
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                당일등록
              </th>

              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                상점 등록일
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((item, key) => (
              <tr key={key} className="text-center">
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <h5 className="font-medium text-c-blue dark:text-white ">
                    <Link href={process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/store/"+item.store_code+"/dashboard"} rel="noopener noreferrer" target="_blank" className="hover:underline" onClick={(e)=>{
                      e.preventDefault();
                      setCurrent_store_code(item.store_code)
                      setCurrent_store_name(item.store_name)
                      const target = e.target as HTMLAnchorElement
                      window.open(target.href);
                      
                    }}>{item.store_name}</Link>
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center" >
                  <h5 className="text-black dark:text-white ">
                   {item.month_count}
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark " >
                  <h5 className="text-black dark:text-white">
                    {item.yesterday_count}
                  </h5>
                </td>
                
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.today_count}
                  </p>
                </td>


                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatTimeStamp(item.register_time)}
                  </p>
                </td>

                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>



    
  </DefaultLayout>

  );
};


export default TablesPage;
