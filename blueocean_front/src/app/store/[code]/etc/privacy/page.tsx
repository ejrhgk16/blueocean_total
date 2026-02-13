'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useEffect, useState } from "react";
import Link from "next/link";
import SwitcherTwo from "@/components/Switchers/SwitcherTwo";
//import { cookies } from "next/headers";

const  Page = (props : any) => {

  const store_code = props.params.code;

  const targetUrl = '/api/store/etc/privacy'

   const [priavacyList, setPriavacyList] = useState<any[]>([]); // 초기 전체 데이터

    // useEffect로 초기 데이터를 fetch
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetchToFrontServer.boaGet(targetUrl, {store_code : store_code})
          const result = await res.json()
          setPriavacyList(result.data)

          // setPriavacyList(result.data?.map((item:any, index:any)=>(
          //   {...item, id:index}
          // )))

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      
      fetchData();
    }, []);

    const addClientType = () => {
      setPriavacyList([...priavacyList, { num: priavacyList.length, privacy_name: '', privacy_content:''}]);
    };

    const removeClientType = (id:any) =>{
      setPriavacyList(priavacyList.filter(item => item.id !== id));
    }


    const onChangeValue = (item : any, name : any, value:any)=>{
      const updatedList = priavacyList?.map((e)=> {return e.num === item.num ? {...item, [name] : value} : e} )

      setPriavacyList(updatedList)
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

      const targetUrl = "/api/store/etc/privacy/update"

      const param = {store_code : store_code, list : priavacyList}

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
    <Breadcrumb pageName="개인정보 이용동의 관리" />

    <div className="hidden sm:block">

       
      </div>

        
      <br></br>


    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

      <div className="">

        {priavacyList?.map((item, index)=>(
            <div key={index}>
            <input
              id={"privacy_name"+index}
              type="text"
              defaultValue={item.privacy_name}
              placeholder="명칭 입력"
              className="w-full border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e)=>{onChangeValue(item, 'privacy_name', e.target.value)}}
            />

          <textarea
            id={"privacy_content"+index}
            rows={6}
            defaultValue={item.privacy_content}
            placeholder="내용 입력"
            className="w-full border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={(e)=>{onChangeValue(item, 'privacy_content', e.target.value)}}
          ></textarea>

            <br></br><br></br>
          
            </div>
        ))}



        
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


export default Page;
