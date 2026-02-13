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
import * as XLSX from 'xlsx';
import useLocalStorage from "@/hooks/useLocalStorage";
import {useReactTable,getCoreRowModel,getSortedRowModel,SortingState,flexRender,} from '@tanstack/react-table'
//import { cookies } from "next/headers";

function formatDate(date : any){
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = date.getDate().toString().padStart(2, '0');

  return year+'/'+month+'/'+day
}

function generateExcel(column_name_arr : any, data_arr : any, file_name : any) {
  const workbook = XLSX.utils.book_new();
  const ws_data = [column_name_arr].concat(data_arr);
  console.log(ws_data)
  const worksheet = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(workbook, worksheet, '디비리스트');
  XLSX.writeFile(workbook, file_name+'.xlsx');
}


const Page = (props:any) => {


  const [alldata, setAllData] = useState<any[]>([]); // 초기 전체 데이터
  const [pagingInfo, setPagingInfo] = useState<Record<string,any>>({}); // 검색어 상태 관리
  const [checkList, setCheckList] = useState<any[]>([]); // 초기 전체 데이터
  const [current_store_name, setCurrent_store_name] = useLocalStorage('current_store_name', '');

  const [sorting, setSorting] = useState<SortingState>([])
  const columns = [
    {
      accessorKey: 'id',
      header: '고유',
      size : 100
    },
    {
      accessorKey: 'cust_name',
      header: '이름',
      size : 150
    },
    {
      accessorKey: 'cust_phone_number',
      header: '연락처',
      size : 100
    },
    {
      accessorKey: 'cust_age',
      header: '나이',
      size : 100
    },
    {
      accessorKey: 'info_data',
      header: '기타',
      size : 200
    },
    {
      accessorKey: 'memo',
      header: '메모',
      size : 200
    },
    {
      accessorKey: 'last_update',
      header: '신청일시',
      size : 200
    },
    {
      accessorKey: 'status',
      header: '상태',
      size : 100
    },
    {
      accessorKey: 'media_name',
      header: '매체',
      size : 100
    },
    {
      accessorKey: 'event_name',
      header: '이벤트',
      size : 200
    },
    
  ]

  const table = useReactTable({
    data: alldata,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onChange', // 열 크기 조정 모드 추가
  })
  
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
  

  const fetchdd = async (param  : Record<string,any> = {} ) => {
    try {
      const targetUrl = '/api/store/db/list'

      const param2 : Record<string,any> = {

        store_code : store_code,
        // startDate : param.startDate,
        // endDate : param.endDate,
        // page_num : param.page_num || null,
        // keyword : param.keyword || null,
        ...param

      }

      // console.log("param::: ", param2)

      // const param2 = {...param, store_code : store_code, startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)} 
      const res = await fetchToFrontServer.boaGet(targetUrl,param2)
      const result = await res.json()

      setAllData(result.data.list); // 원본 데이터를 설정

      const paging = {...result.data.paging, startDate : param2.startDate, endDate:param2.endDate}
      // console.log(paging)
      setPagingInfo(paging)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {

    fetchData({store_code : store_code, startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)});
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

    <DefaultLayout type={'store'}>
      
    <Breadcrumb pageName="디비리스트" />

    <div className="my-3">
      <SearchBox fetchData={fetchData} placeholder={"검색어 입력"} 
      param={{...pagingInfo, pageNum : null , startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)}}></SearchBox> 

    </div>

    <div className="mx-auto flex gap-3">

      <div className="flex-grow">  
        <Datepicker value={dateValue}  onChange={(newValue:any) => {
      setDateValue({startDate:newValue.startDate, endDate:newValue.endDate})}}  />      
      </div>

      <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" 
      onClick={()=>{ fetchData({store_code : store_code, ...pagingInfo, pageNum : null, startDate : formatDate(dateValue.startDate), endDate : formatDate(dateValue.endDate)})}}>
          조회</button>
          <button type="button" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" 
      onClick={()=>{
          const column_name_arr =  ["고유", "이름", "연락처","나이", "기타", "메모", "신청일시", "상태", "매체", "이벤트"]
          // 이 부분
          //함수하나만들어서 setDateValue({startDate:newValue.startDate, endDate:newValue.endDate})}}  />   이것처럼 넘기면될듯
          const data_arr = alldata.map(obj => {
            const status = obj.status ? STORE_STATUS[obj.status as keyof typeof STORE_STATUS].text : ''
            return [obj.id, obj.cust_name, obj.cust_phone_number, obj.cust_age, obj.info_data, obj.memo, formatTimeStamp(obj.last_update), status, obj.media_name, obj.event_name]
          
          });

          const excel_name = current_store_name + "_" + pagingInfo.startDate + "~" + pagingInfo.endDate+"("+pagingInfo.pageNum+")"
          generateExcel(column_name_arr, data_arr, excel_name)
        }}>
          데이터 엑셀로 다운</button>
   
       
  
    </div>



    <div className="flex flex-col gap-10">
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-center dark:bg-meta-4">

              {columns.map((column:any) => (
                <th
                  key={column.accessorKey}
                  className={"min-w-["+column.size+"px] px-4 py-4 font-medium text-black dark:text-white cursor-pointer"}
                  onClick={() => table?.getColumn(column.accessorKey)?.toggleSorting()}
                
                >
                  {column.header}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[table?.getColumn(column.accessorKey)?.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel()?.rows?.map((row, key) => (
              <tr key={key} className="text-center hover:bg-slate-100" 
              onDoubleClick={()=>{window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/store/"+store_code+"/db/list/detail?id="+row.original.id, '상세페이지', 'width=550,height=700')}}>
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
                    {row.original.id}                
                  </h5>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark " >
                  <h5 className="text-black dark:text-white">
                    {row.original.cust_name}
                  </h5>
                </td>
                
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {row.original.cust_phone_number}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {row.original.cust_age}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">

                  {row.original.info_data ? <Tooltip message={row.original.info_data}>
                    <h5 className="text-black dark:text-white">
                      
                        {row.original.info_data.length > 20 ? row.original.info_data.substring(0, 15) + '...' : row.original.info_data}
                     
                    </h5>
                    </Tooltip>

                    : null
                    }

                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">

                  {row.original.memo ? <Tooltip message={row.original.memo}>
                    <h5 className="text-black dark:text-white">
                      
                        {row.original.memo.length > 20 ? row.original.memo.substring(0, 15) + '...' : row.original.memo}
                     
                    </h5>
                    </Tooltip>

                    : null
                    }

                </td>
                

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {formatTimeStamp(row.original.last_update)}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {row.original.status ? STORE_STATUS[row.original.status as keyof typeof STORE_STATUS].text : ''}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {row.original.media_name}
                  </p>
                </td>

                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {row.original.event_name}
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
