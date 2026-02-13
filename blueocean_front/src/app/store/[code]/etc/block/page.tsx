'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SwitcherTwo from "@/components/Switchers/SwitcherTwo";
//import { cookies } from "next/headers";
import * as XLSX from 'xlsx';

const  Page = (props : any) => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const store_code = props.params.code;

  const targetUrl = '/api/store/etc/block/list'

  const [blockList, setBlockList] = useState<any[]>([]); // 초기 전체 데이터
  

    // useEffect로 초기 데이터를 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchToFrontServer.boaGet(targetUrl, {store_code : store_code})
        const result = await res.json()

        setBlockList(result.data)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

      
      fetchData();
    }, []);

  const addClientType = () => {
    setBlockList([...blockList, {id: blockList.length, num: blockList.length, cust_name: '',  cust_phone_number:'', status:'Y'}]);
  };

  const removeClientType = (id:any) =>{
    setBlockList(blockList.filter(item => item.id !== id));
  }


  const onChangeValue = (key:any, value:any, id:any)=>{
    if(key == "status"){
      value = value == "Y" ? "N" : "Y"
    }
    const updatedList = blockList?.map((e)=> e.id === id ? {...e, [key]:value} : e )

    setBlockList(updatedList)
  }

  const excelButtonClick = () => {
    fileInputRef?.current?.click();
  };

  // const handleFileChange = async (event : any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     try {
  //       const response = await fetch('/api/upload', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       const data = await response.json();
  //       console.log('Extracted data:', data);
  //     } catch (error) {
  //       console.error('Error uploading file:', error);
  //     }
  //   }
  // };

  const handleFileUpload = (e : any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event : any) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setBlockList(prevBlockList => {
        const newItems = data.map((item : any, index) => ({
          id: prevBlockList.length + index,
          num: prevBlockList.length + index,
          cust_name: item.cust_name,
          cust_phone_number: item.cust_phone_number,
          status: 'Y'
        }));
        return [...prevBlockList, ...newItems];
      });

    };

    reader.readAsBinaryString(file);
  };
    


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

      const targetUrl = "/api/store/etc/block/update"

      // console.log("blocklist " ,blockList.filter((item:any)=>(item.cust_name != '' || item.cust_phone_number != '')))

      const param = {store_code : store_code, list : blockList.filter((item:any)=>(item.cust_name != '' || item.cust_phone_number != ''))}

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
    <Breadcrumb pageName="접근제한 관리" />

    <div className="hidden sm:block">

       
      </div>

        
      <br></br>


    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

      <div className="">

      <button className="inline-flex items-center justify-center rounded-md border border-meta-3 px-5 py-4 text-center font-medium text-meta-3 hover:bg-opacity-90 lg:px-8 xl:px-5"
        onClick={excelButtonClick} >엑셀로 추가</button>
       <input type="file" ref={fileInputRef} onChange={handleFileUpload}style={{ display: 'none' }}accept=".xlsx, .xls"/>

        {blockList?.map((element, index)=>(
            <div key={index} x-data="{ switcherToggle: false }" style={{
              display: 'flex',
              justifyContent: 'center', // 수평 중앙 정렬
        
            }}>
        
              <label
                htmlFor="checkboxLabelOne"
                className="flex cursor-pointer select-none items-center"
              >
                {"이름"} &nbsp;&nbsp;
                <div className="relative">
                  <input type={"text"} placeholder="Default Input" className=" rounded-lg border-[2.0px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                   name="name" value={element.cust_name !== null ? element.cust_name : ''} onChange={(e)=>{onChangeValue("cust_name",e.target.value, element.id)}}/>
                </div>
                
              </label>
        
              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
        
              
              <label
                htmlFor="checkboxLabelOne"
                className="flex cursor-pointer select-none items-center"
              >{"번호"} &nbsp;&nbsp;
                <div className="relative">
                  <input type={"text"} placeholder="Default Input" className="w-150 rounded-lg border-[2.0px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  name="memo" value={element.cust_phone_number !== null ? element.cust_phone_number : ''} onChange={(e)=>{onChangeValue("cust_phone_number",e.target.value, element.id)}}/>
                </div>
                
              </label>
        
              &nbsp;&nbsp;&nbsp;&nbsp;
        
              <label
                htmlFor={element.id}
                className="flex cursor-pointer select-none items-center"
                onClick={()=>{onChangeValue("status", element.status, element.id)}}
              >
                <div className="relative">
                  {/* <input
                    id={element.id}
                    type="checkbox"
                    className="sr-only"
                    checked = {element.status == 'Y' ? true : false}
                    onChange={(e)=>{onChangeValue("status", e.target.checked, element.id)}}
                  /> */}
                  <div className="h-5 w-14 rounded-full bg-meta-9 shadow-inner dark:bg-[#5A616B]"></div>
                  <div 
                    className={`dot absolute -top-1 left-0 h-7 w-7 rounded-full bg-white shadow-switch-1 transition ${
                      element.status === 'N'? false : true
                      && "!right-0 !translate-x-full !bg-primary dark:!bg-white"
                    }`}
                  ></div>
                </div>
              </label>
        
        
              {/* 삭제버튼인데...나중에필요하면 <button className="hover:text-primary"><svg className="fill-current" width="30" height="30" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" fill=""></path><path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" fill=""></path><path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z" fill=""></path><path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z" fill=""></path></svg></button> */}
              <br></br><br></br><br></br><br></br>
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
