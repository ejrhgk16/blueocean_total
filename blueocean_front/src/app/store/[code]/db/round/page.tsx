'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useEffect, useState } from "react";
import Link from "next/link";
import SwitcherTwo from "@/components/Switchers/SwitcherTwo";
//import { cookies } from "next/headers";




const  Page = (props:any) => {

  const store_code = props.params.code;

  const targetUrl = '/api/store/db/round/list'

   const [dataList, setDataList] = useState<any[]>([]); // 초기 전체 데이터
  // const [filteredData, setFilteredData] = useState<any[]>([]); // 필터링된 데이터
  // const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리


    // useEffect로 초기 데이터를 fetch
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetchToFrontServer.boaGet(targetUrl, {store_code:store_code})
          const result = await res.json()
          setDataList(result.data)

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      
      fetchData();
    }, []);

    const addData = () => {
      setDataList([...dataList, {index : dataList.length, round_num:0, round_quantity:0, name: 0, memo:0 }]);
    };

    const removeClientType = (id:any) =>{
      setDataList(dataList.filter(item => item.id !== id));
    }

    const changeInfo = (item : any)=>{

      const updatedList = dataList?.map((data)=> data.index === item.index ? {...item, round_num : item.name, round_quantity : item.memo} : data )

      setDataList( updatedList)
    }
  
    // const changeStatus = (id:any,  e:any) => {

    //   var status = ''

    //   if(e.target.value){
    //     status='Y'
    //   }else{
    //     status='N'
    //   }

    //   const updatedList = clientTypeList?.map((item)=> item.id === id ? { ...item, status : status}: item )

    //   setClientTypeList( updatedList)
    // };

    const sendData = async ()=>{

      const targetUrl = "/api/store/db/round/update"

      const param = {store_code : store_code, dataList : dataList}

      try {
        const res  = await fetchToFrontServer.boaPost(targetUrl, param)
        if(res.ok)alert("저장 성공 ::: !")
        else{alert("저장실패 :: !")}
      } catch (error) {
        alert("서버에러 발생 :: !")

      }
      
    }


  return (

    <DefaultLayout type={'store'}>
    <Breadcrumb pageName="차수 관리" />

    <div className="hidden sm:block">

       
      </div>

        
      <br></br>


    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

      <div className="">

        {dataList?.map((item, index)=>{
          return <SwitcherTwo element={item} onChangeInfo={changeInfo} key={index} columName1 = {"차수번호"} columName2={"개수"} inputType={"number"}></SwitcherTwo>
          
        })}
        
        <br></br><br></br>
        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-5" x-data="{ switcherToggle: false }" style={{display: 'flex', justifyContent: 'right', }}>

            <button className="inline-flex items-center justify-center rounded-md border border-meta-3 px-5 py-4 text-center font-medium text-meta-3 hover:bg-opacity-90 lg:px-8 xl:px-5"
            onClick={addData}
            >
              추가
            </button>

            <button className="inline-flex items-center justify-center rounded-md border border-primary px-5 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-5"
            onClick={sendData}
            >
              저장
            </button>


        </div>
      </div>

    </div>


    
  </DefaultLayout>

  );
};


export default Page;
