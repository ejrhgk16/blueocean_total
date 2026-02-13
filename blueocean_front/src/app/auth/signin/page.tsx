'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'
import useLocalStorage from "@/hooks/useLocalStorage";
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";

const SignIn: React.FC = () => {

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isFailLogin, setIsFailLogin] = useState(Boolean);
  const { login, authState } = useAuth();
  const [boaMenuList, setBoaMenuList] = useLocalStorage('boaMenuList', {});
  const [storeMenuList, setStoreMenuList] = useLocalStorage('storeMenuList', {});
  const [userInfo, setUserInfo] = useState<Record<string,any>>({role_type : ''});
  const [current_store_code, setCurrent_store_code] = useLocalStorage('current_store_code', '');
  const [current_store_name, setCurrent_store_name] = useLocalStorage('current_store_name', '');

  const router = useRouter();

  const fetchData = async (e:any) => {
    e.preventDefault();

    const targetUrl = '/api/auth/login'
    const body = {user_login_id : userId, user_password : password}

    const res = await fetchToFrontServer.boaPost(targetUrl, body)

    const result = await res.json()

    if(result.data.loginSuccesYN == 'Y'){

      setIsFailLogin(false);
      setUserInfo({role_type :result.data.role_type, store_list : result.data.store_list})
      login(result.data.user_login_id, result.data.user_name, result.data.role_name, result.data.role_type, JSON.stringify(result.data.store_list ? result.data.store_list : []));

      const res2 = await fetchToFrontServer.boaGet('/api/common/menu')
      const result2 = await res2.json() 

      setBoaMenuList(Object.values(result2.data.boa))
      setStoreMenuList(Object.values(result2.data.store))

    }else{
      setIsFailLogin(true);
    }
  }

  return (
    <div>
      <div className="">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <span className="mt-15 inline-block">
              <Image
              width={500}
              height={500}
              src={"/images/logo/boa_logo.png"}
              alt="Logo"
              priority
            />
              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5 ">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              </h2>

              {isFailLogin ? (
                  <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                      <div className="w-full">
                        <h5 className="mb-3 font-semibold text-[#B45454]">
                          로그인 실패하였습니다.
                        </h5>
                      </div>
                      <div></div>
                  </div>
                ) : ( <></>
              )}

               {authState?.role_type == "client" && authState?.isLogin   ? 
                JSON.parse(authState.store_list)?.map((item : any)=>(
                  <div key={"link_"+item.store_code}>
                  <Link onClick={()=>{
                    setCurrent_store_code(item.store_code)
                    setCurrent_store_name(item.store_name)
                  }}  
                  href={"/store/"+item.store_code+"/dashboard"} className="inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10">
                    {item.store_name +" 관리자 페이지로 이동"}
                  </Link>
                  <br></br>
                  <br></br>
                  <br></br>
                  </div>
                )) : ''
                } 

              {userInfo?.role_type == "admin" && authState?.isLogin   ? 
                  <>
                  <Link href="/boa/dashboard" className="inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10">
                  관리자 페이지로 이동
                </Link>
                  </>
                 : ''
                } 

              {authState?.isLogin ? (            
                ''
                ):
               (<form onSubmit={(e)=>{ fetchData(e)}}>
                &nbsp;&nbsp;
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    아이디
                  </label>
                  <div className="relative">
                    <input
                      type="id"
                      placeholder="아이디를 입력해주세요"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>setUserId(e.target.value)}
                    />
                    <span className="absolute right-4 top-4">
                      <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z" fill=""/></g></svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    비밀번호
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>setPassword(e.target.value)}
                    />
                    <span className="absolute right-4 top-4">
                      <svg className="fill-current" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.5"><path d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z" fill=""/><path d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z" fill=""/></g></svg>
                    </span>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;