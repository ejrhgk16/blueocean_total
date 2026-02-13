'use client'
import fetchToFrontServer_csr from "@/boaUtil/fetchToFrontServer_csr";
import SelectOption from "@/components/FormElements/SelectOption";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "@/css/layout2.css"
import Link from "next/link";
import { stringify } from "querystring";
import { formatDate } from "@/boaUtil/dateUtil";
import Head from "next/head";
import Script from "next/script";
import "@/css/satoshi.css";
import "@/css/style.css";


const Landing: React.FC<{contentData:any, pageInfoData:any, scriptList:any, noscriptList:any}> = ({contentData, pageInfoData, scriptList, noscriptList}) => {
  const [mounted, setMounted] = useState(false);
  const [pageInfo, setPageInfo] = useState<Record<string, any>>({})
  const [regInfo, setRegInfo] = useState<Record<string, any>>({cust_name:'', cust_phone_number:'',cust_phone_number_1:'010',cust_phone_number_2:'0',cust_phone_number_3:'0', cust_age:0, info_data:{},privacy_agree01:false, privacy_agree02:false})

  // const [mainImg, setMainImg] = useState<Record<string, any>>({}) //imgFile : 원본파일 서버에 저장할때, imgSrc:화면에 띄울때
  // const [sendButtonImg, setSendButtonImg] = useState<Record<string, any>>({}) //imgFile : 원본파일 서버에 저장할때, imgSrc:화면에 띄울때
   const [qaList, setQaList] = useState<any[]>(contentData.qaList)//[{type:'q' fileName:'', text:'', imgFile : ''qNumber:'']
  // const [subList_1, setSubList_1] = useState<any[]>([])
  // const [subList_2, setSubList_2] = useState<any[]>([])


  const [isInRegInputArea, setIsInRegInputArea] = useState(false)

  useEffect(() => {
    setMounted(true);

    // script 삽입, scroll 이벤트 등록 등
  }, []);



  const targetRef = useRef<HTMLDivElement>(null);
  const targetRef2 = useRef<HTMLDivElement>(null);

  const dmsdms = (word:any)=>{//은는 은 는 구분 함수
    const lastChar = word[word.length - 1];
    const uni = lastChar.charCodeAt(0);
  
    if (uni < 44032 || uni > 55203) return word + '는';
  
    return word + ((uni - 44032) % 28 > 0 ? '은' : '는');
  }

  useEffect(() => {
    if (!mounted) return;

    // const clientHtml = document.head.innerHTML;
    // console.log("Client Rendered HTML:", clientHtml);

    const handleScroll = () => {
        const section = document.getElementById('inputArea');
        if (section) {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // 섹션이 화면에 완전히 보이는지 확인
            if (rect.top >= 0 && rect.bottom <= windowHeight) {
                setIsInRegInputArea(true);
            } 
            // 섹션이 화면에 부분적으로 보이는지 확인
            else if (rect.top < windowHeight && rect.bottom > 0) {
                setIsInRegInputArea(true);
            } 
            else {
                setIsInRegInputArea(false);
            }
        }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('scroll', handleScroll);
}, [mounted]);


  useEffect(() => {
    setPageInfo(pageInfoData)
    setQaList(contentData.qaList)

    const privacy01checkTF = pageInfoData.privacy01checkYN == "Y" ? true : false
    const privacy02checkTF = pageInfoData.privacy02checkYN == "Y" ? true : false

    setRegInfo(prevState => ({
      ...prevState,
      privacy_agree01 : privacy01checkTF,
      privacy_agree02 : privacy02checkTF
    }))

    fetchdd2();


  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log("sscc :: " )
    // 받아온 script 태그의 내용을 직접 실행
    // let scriptContent = pageInfo.scriptList
    let addedScripts : any[] = [];
    scriptList.forEach((element : any, index:any) => {
      if (element.script_content) {

  
        // 이미 존재하는 스크립트인지 확인
        const existingScript = document.querySelector(`script[data-custom="${element.num}"]`);
        if (existingScript) {
          return;
        }
  
        const script = document.createElement('script');
        script.textContent = element.script_content;
        script.setAttribute('data-custom', element.num); // 고유 식별자 추가
  
        try {
          document.head.appendChild(script);
          addedScripts.push(script);
        } catch (error) {
          console.error('스크립트 추가 중 오류 발생:', error);
        }
      }
    });

    noscriptList.forEach((element : any, index:any) => {
      if (element.script_content) {

  
        // 이미 존재하는 스크립트인지 확인
        const existingScript = document.querySelector(`noscript[data-custom="${element.num}"]`);
        if (existingScript) {
          return;
        }
  
        const script = document.createElement('noscript');
        script.textContent = element.script_content;
        script.setAttribute('data-custom', element.num); // 고유 식별자 추가
  
        try {
          document.body.appendChild(script);
          addedScripts.push(script);
        } catch (error) {
          console.error('스크립트 추가 중 오류 발생:', error);
        }
      }
    });
  
    // 클린업 함수
    return () => {
      addedScripts.forEach(script => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      });
    };

  }, [mounted, scriptList, noscriptList]);

  const fetchdd2 = async () => {
    const targetUrl = '/api/landing/count'
    const res = await fetchToFrontServer_csr.boaGet(targetUrl,{page_code : pageInfoData.page_code})
  }


  const onClickSendButton = async ()=>{

    if(!isInRegInputArea){
      if (targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return
    }

    if(!regInfo.privacy_agree01){
      if (targetRef2.current) {
        targetRef2.current.scrollIntoView({ behavior: 'smooth' });
      }
      alert("개인정보이용동의를 체크해주세요")
      return
    }
    if(!regInfo.privacy_agree02){
      if (targetRef2.current) {
        targetRef2.current.scrollIntoView({ behavior: 'smooth' });
      }
      alert("전화수신 및 정보전달 이용동의를 체크해주세요")
      return
    }
    if(!regInfo.cust_name){
      alert("이름을 입력해주세요")
      return
    }

    if(pageInfoData.ageYN == "Y" && !regInfo.cust_age){
      alert("나이를 입력해주세요")
      return
    }



    const targetUrl = "/api/landing/add"

    const selectedQa : any[]  = []

    for(const item of qaList){
      const temp : Record<string,any> = {}
      temp.q = item.content_text
      temp.a = null

      if(item?.aList?.length > 0){
        const tempA = item.aList[item.selectedANumber]
        temp.a = tempA?.content_text
      }else{//주관식
        temp.a = item.a
      }

      if(!temp.a){
        alert("질문(" + temp.q + ")의 답변을 입력해주세요")
        return
      }
     
      selectedQa.push(temp)

    }
    
    const cust_phone_number = regInfo.cust_phone_number_1 +''+regInfo.cust_phone_number_2+''+regInfo.cust_phone_number_3

    if(cust_phone_number?.length != 11){
      alert("전화번호를 정확히 입력해주세요")
      return
    }

    let block_keyword_list = []
    if(pageInfo.block_keyword){
      block_keyword_list = pageInfo.block_keyword.split(",")
    }

    for (let block_keyword of block_keyword_list) {

      block_keyword = block_keyword.trim()
      for(const item of qaList){
        if(item?.a != null && String(item.a).trim() === block_keyword){
           alert(dmsdms(block_keyword)+' 이벤트 신청 불가합니다')
            return;          
        }
        // if (body.info_data.indexOf(item) > -1) {
        //   alert(dmsdms(item)+' 이벤트 신청 불가합니다')
        //   return; 
        // }
      }

    }

    const body = {
      ...regInfo,
      cust_phone_number : cust_phone_number,
      page_code : pageInfo.page_code,
      store_code : pageInfo.store_code,
      info_data : JSON.stringify(selectedQa)
      
    }



    if(pageInfo.limit_age && regInfo.cust_age && regInfo.cust_age <= pageInfo.limit_age){
      alert(pageInfo.limit_age + "세 이하는 이벤트 신청 불가합니다")
      return
    }



    if(pageInfo.external_api && pageInfo.external_api != "undefined" &&  pageInfo.external_api != "null"){

      let external_api =  pageInfo.external_api



      const external_apiArr = external_api.split("?")
      const targetUrl2 = external_apiArr[0]


      let paramString = external_apiArr[1]

      paramString = paramString.replaceAll("[cust_name]", regInfo.cust_name)
      paramString = paramString.replaceAll("[cust_age]", regInfo.cust_age)
      paramString = paramString.replaceAll("[cust_phone_number]", cust_phone_number)

      selectedQa.forEach((element : any, index:any) => {
        const tempKey = "q"+index
        const tempValue = element.a
        paramString = paramString.replaceAll(`[${tempKey}]`, tempValue)
      }); 

      paramString = paramString.replaceAll("[info_data]", body.info_data)
      //selectedQa로 q별로 컬럼 다르게 넣을수있게 수정요청
      
      let today = new Date(); 
      paramString = paramString.replaceAll("[time]", formatDate(today))


      const paramArr = paramString.split("&")

      const body2:Record<string, any> = {}
      for(let i =0; i<paramArr.length; i++){

        const tmepString = paramArr[i]
        const tmepStringArr = tmepString.split("=")
        const keyString = tmepStringArr[0];
        const valueString = tmepStringArr[1];

        body2[keyString] = valueString

      }

      body2.targetUrl = targetUrl2

    

      try {
        // let option :Record<string, any> = {};
        // option.method = 'POST'
        // option.headers = {"Content-Type" : "application/json"}    
        // option.cache = 'no-store';
        // option.credentials = 'include'
    
        // if(body2){        
        //     option.body = JSON.stringify(body2)
        // }
        // fetch(targetUrl2, option);

        fetchToFrontServer_csr.boaPost("/api/common/google/excel", body2)//엑셀 외에도 외부api

      } catch (error) {
        console.log(error)
      }
     
      
    }


    try {
      const res  = await fetchToFrontServer_csr.boaPost(targetUrl, body)
      if(res.ok){
        const result =await res.json()
        // alert(result.data.msg)
        if(result.data.code == "fail"){
          alert(result.data.msg)
          return
        }

        let comp_url = process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/landing/"+pageInfo.store_code+"/"+ pageInfo.page_code+"/comp"
        if(pageInfo.replace_page_code){
          comp_url += "?replace_page_code="+pageInfo.replace_page_code
        }
        window.location.replace(comp_url)  
        // if(pageInfo.next_url){
        //   window.location.replace(pageInfo.next_url)  
        // }
        //window.close()
      }
      else{
        const result = await res.json()
        if(!result.data.msg){
          alert("등록실패")
          return
        }
       
      }
    } catch (error) {
      alert("등록 실패 :: !")

    }
    




  }

  const onChangeValue = (name:any, value:any,)=>{

    setRegInfo((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
     // [name]: type == "checkbox"?value: value.trim()   // name 키의 값만 변경
     [name]: name=="privacy_agree01" || name=="privacy_agree02"  ? value : value.trim()
    }));
  }

  const onClickA = (qNumber:any, aNumber:any)=>{

    const updatedList = qaList?.map((e)=> {
      return e.qNumber === qNumber ? {...e, selectedANumber : aNumber} : e
    
    } )
    setQaList(updatedList)
  }

  const inputA = (qNumber:any, value:any)=>{
    const updatedList = qaList?.map((e)=> {
      return e.qNumber === qNumber ? {...e, a : value} : e
    } )
    setQaList(updatedList)
  }

  const handleCheckboxChange_01 = (event:any) => {
    setRegInfo((prev)=>({...prev, privacy_agree01 : event.target.checked})); // 체크박스 상태 업데이트
  };

  const handleCheckboxChange_02 = (event:any) => {
    setRegInfo((prev)=>({...prev, privacy_agree02 : event.target.checked})); // 체크박스 상태 업데이트
  };


  if (!mounted) return null;


  return (

    <div className="bg-white overflow-x-hidden">
      {/* <Head>
        {scriptList?.map((item : any) => {
        console.log("item", item);

        return <script key={item.script_id} dangerouslySetInnerHTML={{ __html: item.script_content }} />
      } )}
      </Head> */}

      {/* {scriptList?.map((item : any) => {
        console.log("item", item);

        return <Script id="gtm-script" strategy="afterInteractive" key={item.script_id} dangerouslySetInnerHTML={{ __html: item.script_content }} />
      } )} */}

        {noscriptList?.map((item : any) => (
        <noscript key={item.script_id} dangerouslySetInnerHTML={{ __html: item.script_content }} />
      ))}

      <div className="flex flex-col lg:mx-auto lg:max-w-5xl min-w-screen min-h-screen">


        <div className="flex-grow items-center ">
        {contentData.mainImg?.content_img_path ?
          <Image key={"maing_"}
            src={contentData.mainImg.content_img_path} // 이미지 파일 경로
            alt="mainImg"
            width={1500} // 최대 너비
            height={400} // 최대 높이
            className="w-full h-auto"
            priority
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw,
            (max-width: 1024px) 75vw,
            1500px"
            onError={() => {console.error(`Image load failed`);}}
          /> : ''
           }
          {contentData.subList_1?.map(
            (item : any, index:any)=>(
              <Image
              key={"sub_1"+index}
              src={item.content_img_path} // 이미지 파일 경로
              alt="sub"
              width={1500} // 최대 너비
              height={400} // 최대 높이
              className="w-full h-auto"
              sizes="(max-width: 640px) 100vw,
              (max-width: 1024px) 75vw,
              1500px"
              onError={() => {console.error(`Image load failed`);}}
            />
            )
          )}
          <br></br>
          <div className="px-8 w-full text-left" id="inputArea"  ref={targetRef}>
          {qaList?.map((item: any, index) => (
            <div key={`q_${index}`} className="flex-row mt-5">
              <Image
                src={item.content_img_path}
                alt="q"
                width={1500}
                height={400}
                className="w-full h-auto"
                key={`q_img_${index}`}
                onError={() => {console.error(`Image load failed`);}}
              />
              <br />
              {!item.aList || item.aList.length > 0 ? (
                item.isAImg ? (
                  <div className="flex justify-center w-full">
                    <div
                      className={`flex gap-3 place-items-center`}
                      key={`q_div_${index}`}
                    >
                      {item.aList?.map((item2: any, index2: any) => (
                        <div
                          className=""
                          key={`a_img_${index}_${index2}`}
                          onClick={() => {
                            onClickA(item.qNumber, item2.aNumber);
                          }}
                        >
                          <Image
                            src={
                              item.selectedANumber == item2.aNumber
                                ? item2.content_img_path_y
                                : item2.content_img_path_n
                            }
                            alt="a"
                            width={100}
                            height={100}
                            className="w-full h-auto"
                            onError={() => {console.error(`Image load failed`);}}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <SelectOption
                      optionList={item.aList}
                      subject={"항목"}
                      selectedValue={""}
                      keyName={item.qNumber}
                      selectFnc={onClickA}
                      key={`selectOption_${index}`}
                    />
                  </div>
                )
              ) : (
                <input
                  type="text"
                  placeholder="답변을 입력해주세요"
                  defaultValue={""}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                  onChange={(e) => {
                    inputA(item.qNumber, e.target.value);
                  }}
                />
              )}
              {qaList.length != index + 1 ? <br /> : ""}
            </div> 
          ))}

          <br></br>

          <div className="w-full">
            <div className="mt-5">
            <label className="text-black text-xl font-bold">이름</label> 
            <input
              type="text" 
              placeholder="이름을 입력해주세요"
              defaultValue={''}
              className="mt-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
              onChange={(e)=>{onChangeValue("cust_name", e.target.value)}}//onChangeValue("page_name", e.target.value)
            /></div>

        <div className="mt-5">
          <label className="text-black text-xl font-bold">전화번호</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="010"
              defaultValue={'010'}
              className="mt-2 w-1/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
              onChange={(e) => onChangeValue("cust_phone_number_1", e.target.value)}
            />
            <span className="flex items-center justify-center">-</span>
            <input
              type="number"
              placeholder="0000"
              id="phone2"
              className="mt-2 w-1/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
              onChange={(e) => onChangeValue("cust_phone_number_2", e.target.value)}
              onKeyUp={(e) => {
                if (e.currentTarget.value.length === 4) {
                  document.getElementById("phone3")?.focus();
                }
              }}
            />
            <span className="flex items-center justify-center">-</span>
            <input
              type="number"
              placeholder="0000"
              id="phone3"
              className="mt-2 w-1/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
              onChange={(e) => onChangeValue("cust_phone_number_3", e.target.value)}
            />
          </div>
        </div>
           {/* <div className="mt-2 flex flex-row items-center">
           <span className="text-black text-xl font-bold w-20">나이 : </span> */}

            {
              pageInfoData.ageYN == "Y" ?            
              <div className="mt-5">
                <label className="text-black text-xl font-bold">나이</label> 
                <input
                  type="number" 
                  placeholder="나이를 입력해주세요"
                  defaultValue={''}
                  className="mt-2 w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                  onChange={(e)=>{onChangeValue("cust_age", e.target.value)}}//onChangeValue("page_name", e.target.value)
                />
               </div> : ''
            }



          </div>
        <hr className="my-8 border-stroke" ></hr>
          
          {/* <div className="flex max-w-1/2 justify-center">
          <div className="flex" ref={targetRef2}>
            <input id = "privacy_agree01" name="privacy_agree01" className="mr-1 mb-2" type="checkbox" style={{verticalAlign: 'middle'}} checked={regInfo.privacy_agree01}  onChange={handleCheckboxChange_01}></input><span className="text-xs" onClick={()=>{onChangeValue("privacy_agree01", true)}} >개인정보취급방침동의  </span>&nbsp;&nbsp; 
            <span onClick={(e)=>{
                 e.preventDefault();
                 window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN+"/landing/"+ pageInfo.store_code+"/"+ pageInfo.page_code+"/privacy?privacy_num="+pageInfo.privacy_num);
                      
            }} className="text-xs cursor-default hover:text-blue-700">[자세히보기]</span>
          </div>
          <br></br>
          <div className="flex" ref={targetRef2}>
            <input id = "privacy_agree02" name="privacy_agree02" className="mr-1 mb-2" type="checkbox" style={{verticalAlign: 'middle'}} checked={regInfo.privacy_agree02}  onChange={handleCheckboxChange_02}></input><span className="text-xs" onClick={()=>{onChangeValue("privacy_agree02", true)}} >전화수신동의 및 정보전달동의  </span>&nbsp;&nbsp; 
    
          </div>
          </div> */}
          <div className="flex max-w-1/2 justify-center">
            <div className="text-left" ref={targetRef2}>
              <div className="mb-2">
                <input
                  id="privacy_agree01"
                  name="privacy_agree01"
                  className="mr-1"
                  type="checkbox"
                  style={{verticalAlign: 'middle'}}
                  checked={regInfo.privacy_agree01}
                  onChange={handleCheckboxChange_01}
                />
                <span className="text-xs" onClick={() => {onChangeValue("privacy_agree01", true)}}>
                  개인정보취급방침동의
                </span>
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(process.env.NEXT_PUBLIC_FRONT_DOMAIN + "/landing/" + pageInfo.store_code + "/" + pageInfo.page_code + "/privacy?privacy_num=" + pageInfo.privacy_num);
                  }}
                  className="text-xs cursor-default hover:text-blue-700 ml-2"
                >
                  [자세히보기]
                </span>
              </div>
              <div className="mb-2">
                <input
                  id="privacy_agree02"
                  name="privacy_agree02"
                  className="mr-1"
                  type="checkbox"
                  style={{verticalAlign: 'middle'}}
                  checked={regInfo.privacy_agree02}
                  onChange={handleCheckboxChange_02}
                />
                <span className="text-xs" onClick={() => {onChangeValue("privacy_agree02", true)}}>
                  전화수신동의 및 정보전달동의
                </span>
              </div>
            </div>
        </div>

        <hr className="my-8 border-stroke"></hr>
          
        <br></br>

          
        <div className="w-full lg:max-w-5xl" onClick={onClickSendButton}>
            {contentData.sendButtonImg?.content_img_path ?<Image src={contentData.sendButtonImg.content_img_path} alt="q" width={1500} height={400}  className="w-full h-auto" key={"send_img_"}  onError={() => {console.error(`Image load failed`);}}/>:''}

        </div>

          </div>
          {/* <div className="w-full lg:max-w-5xl" onClick={onClickSendButton}>
           {contentData.sendButtonImg?.content_img_path ?<Image src={contentData.sendButtonImg.content_img_path} alt="q" width={1500} height={400}  className="w-full h-auto" key={"send_img_"}/>:''}

         </div> */}

          <br></br><br></br><br></br>
          {contentData.subList_2?.map(
            (item : any, index:any)=>(
              <Image
              key={"sub_1"+index}
              src={item.content_img_path} // 이미지 파일 경로
              alt="sub"
              width={1500} // 최대 너비
              height={400} // 최대 높이
              sizes="(max-width: 640px) 100vw,
              (max-width: 1024px) 75vw,
              1500px"
              className="w-full h-auto"
              onError={() => {console.error(`Image load failed`);}}
            />
            )
          )}

 
          

          <div className="pb-10 xsm:pb-10 sm:pb-30 md:pb-50 md2:pb-50 lg:pb-50 xl:pb-50 2xl:pb-50"></div>
          <br></br><br></br><br></br>

     </div>

      <div className="w-full lg:max-w-5xl fixed bottom-0" onClick={onClickSendButton}>
          {contentData.sendButtonImg?.content_img_path ?<Image src={contentData.sendButtonImg.content_img_path} alt="q" width={1500} height={400}  className="w-full h-auto" key={"send_img_"}  onError={() => {console.error(`Image load failed`);}}/>:''}

      </div>


    </div>
</div>
  )
};


export default Landing;
