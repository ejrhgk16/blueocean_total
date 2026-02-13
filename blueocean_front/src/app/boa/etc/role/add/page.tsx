'use client'
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import XButtonWithName from "@/components/FormElements/xbutton";

import InputSearchList from "@/components/FormElements/inputSearchList";
import { useRouter, useSearchParams } from "next/navigation";
import SelectOption from "@/components/FormElements/SelectOption";
import CheckboxTwo from "@/components/FormElements/CheckboxTwo";
//import { cookies } from "next/headers";




const Page = () => {

  const [roleDetail, setRoleDetail] = useState<any>({}); 
  const [connMenuList, setConnMenuList] = useState<any[]>([]);
  
  const [menuList, setMenuList] = useState<any[]>([]);
  const [roleTypeList , setRoleTypeList] = useState<any[]>([{value:'admin', text:'admin'}, {value:'client', text:'client'}]);
  const [statusList, setStatusList] = useState<any[]>([{value:'Y', text:'활성화'}, {value:'N', text:'비활성화'}]);

  const [allCheckTF, setAllCheckTF] = useState({boa : false, store:false});
    

    // useEffect로 초기 데이터를 fetch
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        
        const targetUrl2 = '/api/common/menu/all'

        const res2 = await fetchToFrontServer.boaGet(targetUrl2)
        const result2 = await res2.json()
        const newData = result2.data?.map((item:any) => ({
          ...item,      
          isCheck: false ,
          text : item.menu_name   
        }));
        setMenuList(newData)
    
                
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    
    fetchData();
  }, []);


  const sendData = async ()=>{
    const targetUrl = "/api/admin/etc/role/add"

    const body = {
      ...roleDetail,
      conn_menu_list : menuList.filter((item)=>{return item.isCheck})
    }


    try {
      const res  = await fetchToFrontServer.boaPost(targetUrl, body)
      if(res.ok){
  
        const result = await res.json()
        alert(result.data.msg)
        if(result.data.code == "fail")return
        window.opener.location.reload()
        window.close()
      }
      else{alert("저장실패 :: !")}
    } catch (error) {
      alert("서버에러 발생 :: !")
      
    }
    
  }




  const selectOptionStatus = (value : any)=>{
    setRoleDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      status: value   // name 키의 값만 변경
    }));
  }

  const selectOptionRoleType = useCallback((value : any)=>{
    setRoleDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      role_type: value   // name 키의 값만 변경
    }));
  },[])


  const onChangeValue = (name:any, value:any)=>{
    setRoleDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      [name]: value.trim()   // name 키의 값만 변경
    }));
  }


//메뉴 체크리스트
  const checkboxChange = (item:any)=>{

    const updatedCheckboxes = menuList?.map((data) => {
      //console.log( { ...data, isCheck : !data.isCheck } )
      return data.menu_id == item.menu_id ? { ...data, isCheck : !data.isCheck } : data
    });


    setMenuList(updatedCheckboxes);

  }

  useEffect(() => { //전체 체크 해제

    if(menuList.filter((item)=>{return item.isCheck&&item.menu_type == 'boa'}).length == menuList.filter((item)=>{return item.menu_type == 'boa'}).length){
      setAllCheckTF(allCheckTF => ({...allCheckTF, boa:true}))
    }else{
      setAllCheckTF(allCheckTF=>({...allCheckTF, boa:false}))
    }
    if(menuList.filter((item)=>{return item.isCheck&&item.menu_type == 'store'}).length == menuList.filter((item)=>{return item.menu_type == 'store'}).length){
      setAllCheckTF(allCheckTF=>({...allCheckTF, store:true}))
    }else{
      setAllCheckTF(allCheckTF=>({...allCheckTF, store:false}))
    }
  }, [menuList]);


//전체 체크
const onClickAllCheck = (type: 'boa' | 'store') => {
  const updatedCheckboxes = menuList?.map((data) => {
    //console.log( { ...data, isCheck : !data.isCheck } )
    if(type == data.menu_type){
      return { ...data, isCheck : !allCheckTF[type] }
    }else{
      return data
    }
  });

  setMenuList(updatedCheckboxes);
};






  return (

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                권한 추가
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      권한명
                    </label>
                    <input
                      type="text" defaultValue={roleDetail.role_name}
                      placeholder="권한명 입력"
                      onChange={(e)=>{onChangeValue("role_name", e.target.value)}}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      설명
                    </label>
                    <input
                      type="text" defaultValue={roleDetail.memo}
                      onChange={(e)=>{onChangeValue("memo", e.target.value)}}
                      placeholder="설명"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>


                <SelectOption subject={"활성화"} optionList={statusList} selectedValue={roleDetail.status} selectFnc={selectOptionStatus} key={"statusSelect"} />

                <SelectOption subject={"권한종류"} optionList={roleTypeList} selectedValue={roleDetail.role_type} selectFnc={selectOptionRoleType} key={"clientTypeSelect"} />

                <div className="mb-6">
                  <div className="mb-3 mt-5 flex items-center justify-between">
                    <div className="block text-sm font-medium text-black dark:text-white">관리자 메뉴 목록 </div> &nbsp;&nbsp; <button onClick={()=>{onClickAllCheck('boa')}}>[전체선택]</button>
                  </div>
                  <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              
                    <div className="flex flex-auto flex-wrap gap-3">

                    {menuList?.map((item, index)=>{
                                            
                      if(item.menu_type == 'boa'){
                        return <CheckboxTwo item={item} onChangeCheckBox={checkboxChange} isCheck={item.isCheck}  key={index}/>
                      }     
                    
                    }
                    )}

                    </div>

                  </div>
 
                </div>

                <div className="mb-6">
                  <div className="mb-3 mt-5 flex items-center justify-between">
                    <div className="block text-sm font-medium text-black dark:text-white">클라이언트 메뉴 목록 </div> &nbsp;&nbsp; <button onClick={()=>{onClickAllCheck('store')}}>[전체선택]</button>
                  </div>
                  <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              
                    <div className="flex flex-auto flex-wrap gap-3">

                    {menuList?.map((item, index)=>{
                      if(item.menu_type == 'store'){
                        return <CheckboxTwo item={item} onChangeCheckBox={checkboxChange} isCheck={item.isCheck}  key={index}/>
                      }                  
                    
                    }
                    )}

                    </div>

                  </div>
 
                </div>

                {/* <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div> */}

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendData}>
                  저장하기
                </button>
              </div>
            {/* </form> */}
          </div>

  );
};


export default Page;
