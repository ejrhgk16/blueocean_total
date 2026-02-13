'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
//import { cookies } from "next/headers";


const Page = () => {

  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터


    // useEffect로 초기 데이터를 fetch

    const fetchData = useCallback((param={}) => {
      fetchdd(param)
    }, []);
  

  const fetchdd = async (param={}) => {
    try {
      const targetUrl = '/api/admin/etc/role/list'
      const res = await fetchToFrontServer.boaGet(targetUrl,param)
      const result = await res.json()
      setAllData(result.data); // 원본 데이터를 설정

    } catch (error) {
    }
  };

  useEffect(() => {

    fetchData();
  }, []);





  return (

    <DefaultLayout>
    <Breadcrumb pageName="권한 관리" />
            
    <br></br>

    <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" onClick={()=>{window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/boa/etc/role2/add", '상세페이지', 'width=550,height=700');}}>추가</button>

    <br></br> 

    <div className="flex flex-col gap-10">
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-center dark:bg-meta-4">

              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                권한명
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                권한종류
              </th>
              <th className="min-w-[300px] px-4 py-4 font-medium text-black dark:text-white">
                설명
              </th>
              <th className="min-w-[60px] px-4 py-4 font-medium text-black dark:text-white">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {alldata?.map((item, key) => (
              <tr key={key} className="text-center">
              
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center" >
                  <h5 className="text-black dark:text-white font-medium">
                    <Link href={process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/boa/client/store/detail?store_code="+item.store_code} rel="noopener noreferrer" target="_blank" className="hover:underline" onClick={(e)=>{
                      e.preventDefault();
                      const target = e.target as HTMLAnchorElement
                      window.open(target.href, '상세페이지', 'width=550,height=700');
                      
                    }}>
                      {item.role_name}
                    </Link>                 
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark " >
                  <h5 className="text-black dark:text-white">
                    {item.role_type}
                  </h5>
                </td>
                
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.memo}
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

  </DefaultLayout>

  );
};


export default Page;
