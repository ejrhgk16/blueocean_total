'use client'
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import XButtonWithName from "@/components/FormElements/xbutton";

import InputSearchList from "@/components/FormElements/inputSearchList";
import { useRouter, useSearchParams } from "next/navigation";
import SelectOption from "@/components/FormElements/SelectOption";
import { checkIsExpire } from "@/boaUtil/tokenExpireCheckUtil";

const AccountDetailClient = () => {
 
  const searchParams = useSearchParams()
  const user_id = searchParams.get('user_id')

  const [accountDetail, setAccountDetail] = useState<any>({}); 
  const [connStoreList, setConnStoreList] = useState<any[]>([]); 
  const [roleList, setRoleList] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([{value:'Y', text:'활성화'}, {value:'N', text:'비활성화'}]);
    
  useEffect(() => {
    if (!user_id) return; // Do not fetch if user_id is not available yet

    const fetchData = async () => {
      try {
        const targetUrl1 = '/api/admin/account/detail'
        const targetUrl2 = '/api/admin/etc/role/list'

        const [res1, res2] = await Promise.all([fetchToFrontServer.boaGet(targetUrl1, {user_id : user_id}), fetchToFrontServer.boaGet(targetUrl2)])
        
        const result1 = await res1.json()
        const result2 = await res2.json()
        
        setAccountDetail(result1.data)
        
        const newData2=result2.data?.map((item : any)=>{
          return {text:item.role_name, value:item.role_id}
        })
        setRoleList(newData2)

        if(result1.data.conn_store_list)setConnStoreList(result1.data.conn_store_list)
        else setConnStoreList([])
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchAll = async () => {
      const isExpire = await checkIsExpire()
      if(isExpire){            
        window.close()
        window.opener.location.href = '/auth/signout'
      }
      fetchData();
    }
    fetchAll()
  }, [user_id]); // Add user_id to dependency array

  const sendData = async ()=>{
    const targetUrl = "/api/admin/account/update"
    const body = {
      ...accountDetail,
      conn_store_list : connStoreList
    }

    try {
      const res  = await fetchToFrontServer.boaPost(targetUrl, body)
      if(res.ok){
        alert("저장 성공 ::: !")
        window.opener.location.reload()
        window.close()
      }
      else{alert("저장실패 :: !")}
    } catch (error) {
      alert("서버에러 발생 :: !")
    }
  }

  const onClickXButtonfnc = (item :any)=>{
    setConnStoreList(connStoreList.filter(data => data.store_code !== item.store_code));
  }

  const inputSearchFnc =  async (searchWord:any)=>{
    const targetUrl = "/api/common/search/store"
    const param = {searchWord : searchWord}
    const res = await fetchToFrontServer.boaGet(targetUrl, param)
    const result = await res.json()

    if(result.data){
      const newData=result.data?.map((item : any)=>{
        return {...item, text:item.store_name, value:item.store_code}
      })
      return newData
    }else{
      return []
    } 
  }

  const inputSearchItemClickFnc2 = (item:any)=>{
    const len = connStoreList.filter((element)=>{
      if(element.store_code == item.value)return element
    }).length

    if(len>0)return

    item.store_code = item.value
    item.store_name = item.text

    setConnStoreList([...connStoreList, item])
  }

  const selectOptionStatus = (value : any)=>{
    setAccountDetail((prevState :any) => ({ ...prevState, status: value }));
  }

  const selectOptionRoleType = useCallback((value : any)=>{
    setAccountDetail((prevState :any) => ({ ...prevState, role_id: value }));
  },[])

  const onChangeValue = (name:any, value:any)=>{
    setAccountDetail((prevState :any) => ({ ...prevState, [name]: value.trim() }));
  }

  return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                계정 정보 수정
              </h3>
            </div>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">아이디</label>
                  <input
                    type="text" defaultValue={accountDetail.user_login_id}
                    placeholder="Enter"
                    disabled
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">이름</label>
                  <input
                    type="text" defaultValue={accountDetail.user_name}
                    onChange={(e)=>{onChangeValue("user_name", e.target.value)}}
                    placeholder="Enter"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">비밀번호</label>
                  <input
                    type="text" 
                    placeholder="수정할 비밀번호를 입력하세요"
                    onChange={(e)=>{onChangeValue("user_password", e.target.value)}}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <SelectOption subject={"활성화"} optionList={statusList} selectedValue={accountDetail.status} selectFnc={selectOptionStatus} key={"statusSelect"} />
                <SelectOption subject={"권한 종류"} optionList={roleList} selectedValue={accountDetail.role_id} selectFnc={selectOptionRoleType} key={"clientTypeSelect"} />

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">연결 상점 목록</label>
                  <InputSearchList id="2" searchFnc={inputSearchFnc} itemClickFnc={inputSearchItemClickFnc2}  key={"connInputSearch"} type={2} subject={"상점"}></InputSearchList >
                  <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <div className="flex flex-auto flex-wrap gap-3">
                    {connStoreList?.map((item, index)=>{
                      if(!item.store_code && !item.store_name)return null
                      item.id = index
                      if(!item.text){
                        item.text = item.store_name
                      }
                      return <XButtonWithName item={item} onClickButtonfnc={onClickXButtonfnc} key={index}></XButtonWithName>
                    })}
                    </div>
                  </div>
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendData}>
                  저장하기
                </button>
              </div>
      </div>
  );
};

export default AccountDetailClient;
