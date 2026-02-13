'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import TableTwo from "@/components/Tables/TableTwo";


import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ECommerce from "@/components/Dashboard/E-commerce";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useEffect, useState } from "react";
import Link from "next/link";
import SwitcherTwo from "@/components/Switchers/SwitcherTwo";
//import { cookies } from "next/headers";




const AccessListPage = () => {

  const targetUrl = '/api/admin/etc/access/list'

   const [roleList, setRoleList] = useState<any[]>([]); // 초기 전체 데이터
  // const [filteredData, setFilteredData] = useState<any[]>([]); // 필터링된 데이터
  // const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 관리


    // useEffect로 초기 데이터를 fetch
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetchToFrontServer.boaGet(targetUrl)
          const result = await res.json()
          setRoleList(result.data)

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      
      fetchData();
    }, []);

    const addClientType = () => {
      setRoleList([...roleList, { id: roleList.length + 1, name: '', memo:'', status:'Y' }]);
    };

    const removeClientType = (id:any) =>{
      setRoleList(roleList.filter(item => item.id !== id));
    }


    const changeClientTypeInfo = (item : any)=>{
      const updatedList = roleList?.map((e)=> e.id === item.id ? item : e )

      setRoleList( updatedList)
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

      const targetUrl = "/api/admin/etc/access/update"

      try {
        const res  = await fetchToFrontServer.boaPost(targetUrl, roleList)
        if(res.ok)alert("저장 성공 ::: !")
        else{alert("저장실패 :: !")}
      } catch (error) {
        alert("서버에러 발생 :: !")
        
      }
      
    }


  return (

    <DefaultLayout>
    <Breadcrumb pageName="접근제한 관리" />

    <div className="hidden sm:block">

       
      </div>

        
      <br></br>


    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

      <div className="">

        {roleList?.map(item=>{
          
          //item.name= item.block_ip
          return <SwitcherTwo element={item} onChangeInfo={changeClientTypeInfo}  columName1 = 'ip'  key={item.id}></SwitcherTwo>

        } 
        )}
        
        <br></br><br></br>
        <div className="mb-7.5 flex flex-wrap gap-5 xl:gap-5" x-data="{ switcherToggle: false }" style={{display: 'flex', justifyContent: 'right', }}>

            <button className="inline-flex items-center justify-center rounded-md border border-meta-3 px-5 py-4 text-center font-medium text-meta-3 hover:bg-opacity-90 lg:px-8 xl:px-5"
            onClick={addClientType}
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


export default AccessListPage