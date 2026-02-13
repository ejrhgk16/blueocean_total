'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";

import ChartOne from "@/components/Charts/ChartOne";
import CardDataStats from "@/components/CardDataStats";
import ChartTwo from "@/components/Charts/ChartTwo";


const Dashboard_s: React.FC<{params :any}> = ({params}) => {
  
  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터
  const [pagingInfo, setPagingInfo] = useState<Record<string,any>>({}); // 검색어 상태 관리
  const [checkList, setCheckList] = useState<any[]>([]); // 초기 전체 데이터

  const [chartData, setChartData] = useState<Record<string,any>>({})
  const [regInfo, setRegInfo] = useState<Record<string,any>>({month_count:'0', status_01_count :'0', today_count:'0', yesterday_count:'0'})

  const store_code = params.code

  
  
  const fetchdd_info = async (param={}) => {
    try {
      const targetUrl = '/api/store/dashboard/info'
      const res = await fetchToFrontServer.boaGet(targetUrl,param)
      const result = await res.json()

      setRegInfo(result.data)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchdd_info({store_code : store_code});
  }, []);


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

    <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
                  <div className="flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
                    <div>
                      <h4 className="mb-0.5 text-xl text-black dark:text-white md:text-title-lg">
                        {regInfo.today_count}
                      </h4>
                      <p className="text-sm font-medium">오늘 등록자 수</p>
                    </div>

                  </div>
                  <div className="flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark xl:border-b-0 xl:border-r xl:pb-0">
                    <div>
                      <h4 className="mb-0.5 text-xl text-black dark:text-white md:text-title-lg">
                        {regInfo.yesterday_count}
                      </h4>
                      <p className="text-sm font-medium">어제 등록자 수</p>
                    </div>

                  </div>
                  <div className="flex items-center justify-center gap-2 border-b border-stroke pb-5 dark:border-strokedark sm:border-b-0 sm:pb-0 xl:border-r">
                    <div>
                      <h4 className="mb-0.5 text-xl  text-black dark:text-white md:text-title-lg">
                        {regInfo.month_count}
                      </h4>
                      <p className="text-sm font-medium">이번달 등록자 수</p>
                    </div>
  
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div>
                      <h4 className="mb-0.5 text-xl text-black dark:text-white md:text-title-lg">
                        {regInfo.status_01_count}
                      </h4>
                      <p className="text-sm">상태 미변경 수</p>
                    </div>

                  </div>
                </div>
              </div>
      </div>

      

      <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne store_code={store_code} />
      </div>  

    {/* <Pagination pageInfo={pagingInfo} fetchData={fetchData} key={"storeList"}></Pagination> */}

    </>


  );
};

export default Dashboard_s;
