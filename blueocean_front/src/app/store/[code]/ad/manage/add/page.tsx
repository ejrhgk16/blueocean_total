'use client'
import fetchToFrontServer from "@/boaUtil/fetchToFrontServer_csr";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SelectOption from "@/components/FormElements/SelectOption";
import { STORE_STATUS } from "@/constants/codeList";
import Image from "next/image";
import CheckboxTwo from "@/components/FormElements/CheckboxTwo";
import { checkIsExpire } from "@/boaUtil/tokenExpireCheckUtil";
//import { cookies } from "next/headers";


const Page = (props:any) => {

  const store_code = props.params.code;

  const [pageDetail, setPageDetail] = useState<any>({
    replace_page_code: '',
    status: 'Y',
    event_num: '',
    media_id: '',
    script_num: '',
    privacy_num: '',
    next_url : '',
    api_num : '',
    script_num_comp: '',
    limit_age : '',
    block_keyword : '',
    ageYN : 'Y',
    privacy01checkYN : 'Y',
    privacy02checkYN : 'Y'
  }); 
  
  const [mainImg, setMainImg] = useState<Record<string, any>>({imgFile : '', imgSrc : ''}) //imgFile : 원본파일 서버에 저장할때, imgSrc:화면에 띄울때
  const [sendButtonImg, setSendButtonImg] = useState<Record<string, any>>({imgFile : '', imgSrc : ''}) //imgFile : 원본파일 서버에 저장할때, imgSrc:화면에 띄울때
  const [compImg, setCompImg] = useState<Record<string, any>>({imgFile : '', imgSrc : ''}) //imgFile : 원본파일 서버에 저장할때, imgSrc:화면에 띄울때
  
  // const [qList, setQList] = useState<any[]>([])//[{type:'q' fileName:'', text:'', imgFile : ''qNumber:'']
  // const [aList, setAList] = useState<any[]>([])//[{type:'a' name:'', text:'', imgFile_Y : '',  qNumber:'']
  
  const [subList, setSubList] = useState<any[]>([])

  const [qaList, setQaList] = useState<any[]>([])//[{type:'q' fileName:'', text:'', imgFile : ''qNumber:'']

  const [statusList, setStatusList] = useState<any[]>([{value:'Y', text:'활성화'}, {value:'N', text:'비활성화'}]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [privacyList, setPrivacyList] = useState<any[]>([]);
  const [scriptList, setScriptList] = useState<any[]>([]);
  const [scriptList_comp, setScriptList_comp] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [apiList, setApiList] = useState<any[]>([]);
  const [ageYNList, setAgeYNList] = useState<any[]>([{value:'Y', text:'활성화'}, {value:'N', text:'비활성화'}]);
  const [privacy01checkYNList, setPrivacy01checkYNList] = useState<any[]>([{value:'Y', text:'개인정보이용동의 디폴트 체크 활성화'}, {value:'N', text:'개인정보이용동의 디폴트 체크 비활성화'}]);
  const [privacy02checkYNList, setPrivacy02checkYNList] = useState<any[]>([{value:'Y', text:'전화수신동의 디폴트 체크 활성화'}, {value:'N', text:'전화수신동의 디폴트 체크 비활성화'}]);

  const fetchdd = async (param={}) => {
    try {

      const param1 = {store_code : store_code}

      const targetUrl1 = '/api/store/etc/event'
      const targetUrl2 = '/api/store/etc/privacy'
      const targetUrl3 = '/api/store/etc/script'
      const targetUrl4 = '/api/admin/etc/media/list'
      const targetUrl5 = '/api/store/etc/external/list'

      const [res1, res2, res3, res4, res5] = await Promise.all([
        fetchToFrontServer.boaGet(targetUrl1, {...param1, isAddPage_yn : 'y'}),
        fetchToFrontServer.boaGet(targetUrl2, param1),
        fetchToFrontServer.boaGet(targetUrl3, param1),
        fetchToFrontServer.boaGet(targetUrl4, {}),
        fetchToFrontServer.boaGet(targetUrl5, param1),
      ]);
  
      const [result1, result2, result3, result4, result5] = await Promise.all([
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json(),
        res5.json(),
      ]);
  
  
      setEventList(result1.data?.map((item:any, index:any)=>(
        {...item, text:item.event_name, value:item.num}
      )));
      setPrivacyList(result2.data?.map((item:any, index:any)=>(
        {...item, text:item.privacy_name, value:item.num}
      )));
  
      setScriptList(result3.data?.map((item:any, index:any)=>(
        {...item, text:item.script_name, value:item.num, isCheck: false}
      )));
      setScriptList_comp(result3.data?.map((item:any, index:any)=>(
        {...item, text:item.script_name, value:item.num, isCheck: false}
      )));
      setMediaList(result4.data?.map((item:any, index:any)=>(
        {...item, text:item.name, value:item.id}
      )));
      setApiList(result5.data?.map((item:any, index:any)=>(
        {...item, text:item.api_name, value:item.num}
      )));


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      const isExpire = await checkIsExpire()
      if(isExpire){            
        window.close()
        window.opener.location.href = '/auth/signout'
      }
      fetchdd({store_code : store_code});
    }
    fetchAll()
    
  }, []);


  const sendData = async ()=>{

    
    if(!pageDetail.page_name && !pageDetail.replace_page_code){
      alert("페이지 명을 입력하세요")
      return
    }

    // if(!mainImg.imgFile && !pageDetail.replace_page_code){
    //   alert("메인 이미지를 선택하세요")
    //   return
    // }

    // if(!sendButtonImg.imgFile && !pageDetail.replace_page_code){
    //   alert("제출버튼 이미지를 선택하세요")
    //   return
    // }

    // if(!compImg.imgFile && !pageDetail.replace_page_code){
    //   alert("완료페이지 이미지를 선택하세요")
    //   return
    // }
    
    const targetUrl = "/api/store/ad/manage/add"
    

    const formData = new FormData();

    const scriptNumArr = scriptList.filter((item) => item.isCheck).map((item) => item.num);

    let scriptNumArrJson = ''
    scriptNumArrJson=JSON.stringify(scriptNumArr)

    const scriptNumArr_comp = scriptList_comp.filter((item) => item.isCheck).map((item) => item.num);

    let scriptNumArrJson_comp = ''
    scriptNumArrJson_comp=JSON.stringify(scriptNumArr_comp)
    

    formData.append("store_code", store_code);
    formData.append("page_name", pageDetail.page_name)
    formData.append("replace_page_code", pageDetail.replace_page_code)
    formData.append("status", pageDetail.status)
    formData.append("event_num", pageDetail.event_num)
    formData.append("media_id", pageDetail.media_id)
    formData.append("script_num", scriptNumArrJson)
    formData.append("script_num_comp", scriptNumArrJson_comp)
    formData.append("privacy_num", pageDetail.privacy_num)
    formData.append("next_url", pageDetail.next_url)

    formData.append("limit_age", pageDetail.limit_age)
    formData.append("block_keyword", pageDetail.block_keyword)
    formData.append("api_num", pageDetail.api_num)
    formData.append("ageYN", pageDetail.ageYN)

    formData.append("privacy01checkYN", pageDetail.privacy01checkYN)
    formData.append("privacy02checkYN", pageDetail.privacy02checkYN)
    
    if(!pageDetail.page_name){
      alert("페이지명을 입력하세요")
      return
    }

    let fileNumber = 0

    let temp = {
      content_type:'main',
      content_name:'main',
      content_text : '',
      content_img_name:mainImg.imgFile.name,
    }

   
    if(mainImg.imgFile){
      formData.append("content_0_info", JSON.stringify(temp));
      formData.append("files", mainImg.imgFile);
      formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
      fileNumber = fileNumber +1;
    }

    temp = {
      content_type:'send',
      content_name:'send',
      content_text : '',
      content_img_name:sendButtonImg.imgFile.name,
    }
    if(sendButtonImg.imgFile){ //서버에서 파일 순서랑 nubmer_info 맞추기위해서, 이미지 없이도 체크박스 같은것들 떠야한다면 fileNumber_n카운트로 추가해서 해야햘듯
      formData.append("content_1_info", JSON.stringify(temp));
      formData.append("files", sendButtonImg.imgFile);
      formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
      fileNumber = fileNumber +1;
    }

    temp = {
      content_type:'comp',
      content_name:'comp',
      content_text : '',
      content_img_name:compImg.imgFile.name,
    }
    if(compImg.imgFile){ //서버에서 파일 순서랑 nubmer_info 맞추기위해서, 이미지 없이도 체크박스 같은것들 떠야한다면 fileNumber_n카운트로 추가해서 해야햘듯
      formData.append("content_2_info", JSON.stringify(temp));
      formData.append("files", compImg.imgFile);
      formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
      fileNumber = fileNumber +1;
    }

    subList.forEach((element, index)=>{
      const temp = {
        content_type:'sub',
        content_name:'sub_'+element.subNumber+"_"+element.id,
        content_text: element.text,
        content_img_name:element.fileName,
      }


      if(element.imgFile){
  
        formData.append('content_'+fileNumber+"_info", JSON.stringify(temp));
        formData.append('files', element.imgFile);
        formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
        fileNumber = fileNumber +1;

      }

    })

    
    let aList: Record<string, any>[] = []
   

    //a_y List 먼저 추가 - 서버에서 인덱스로 꺼내는것땜에 순서 지켜주기위해서
    qaList.forEach((element, index) => {
      
      if (!element.text) {
        return; 
      }

      const temp = {
        content_type:'q',
        content_name:'q_'+element.qNumber,
        content_text: element.text,
        content_img_name:element.fileName,
      }

      if(element.imgFile){
  
        formData.append('content_'+fileNumber+"_info", JSON.stringify(temp));
        formData.append('files', element.imgFile);
        fileNumber = fileNumber +1;
        
      }
      aList = aList.concat(element.aList)

      formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
      


    });

    //a_y List 먼저 추가 - 서버에서 인덱스로 꺼내는것땜에 순서 지켜주기위해서
    aList.forEach((element, index) => {

      if (!element.text) {
        return; 
      }
 
      const temp = {
        content_type:'a',
        content_name:'a_'+element.qNumber+"_"+element.aNumber+'_y',
        content_text: element.text,
        content_img_name:element.fileName_check_y,
      }

      if(element.imgFile_check_y){
        formData.append('content_'+fileNumber+"_info", JSON.stringify(temp));
        formData.append('files', element.imgFile_check_y);
        fileNumber = fileNumber +1;
      }

      
      formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
      

    });

    //답변 미체크리스트
    aList.forEach((element, index) => {

      if (!element.text) {
        return; 
      }

      const temp = {
        content_type:'a',
        content_name:'a_'+element.qNumber+"_"+element.aNumber+'_n',
        content_text: element.text,
        content_img_name:element.fileName_check_n,
      }

      if(element.imgFile_check_n){  
        formData.append('content_'+fileNumber+"_info", JSON.stringify(temp));
        formData.append('files', element.imgFile_check_n);
        fileNumber = fileNumber +1;
      }

     
      formData.append('insert_db_'+temp.content_name, JSON.stringify(temp)) 
      

    });

  // formData.forEach((value, key) => {
  //   console.log(key + ': ' + value);
  // });
  //   return



  

    try {
      const res  = await fetchToFrontServer.boaPost_formData(targetUrl, formData)
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



  const onChangeValue = (name:any, value:any)=>{
    setPageDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      [name]: value.trim()   // name 키의 값만 변경
    }));
  }

  const selectImg = ( e :any , type:any)=>{

    const file = e.target.files[0];
    if(!file)return

    const reader = new FileReader();
    reader.onloadend = () => {
     
      if(type == "main"){
        
        setMainImg({imgFile : file, imgSrc : reader.result})
      }else if(type == "send"){
        setSendButtonImg({imgFile : file, imgSrc : reader.result})
      }else if(type == "comp"){
        setCompImg({imgFile : file, imgSrc : reader.result})
      }
    };
    reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기 위한 메서드입니다. FileReader API의 readAsDataURL 메서드를 사용하여 파일(이미지, 텍스트 등)을 읽고, 이를 base64로 인코딩된 데이터 URL 형식으로 변환합니
 
 
  }

  //질문이미지 선택용
  const selectImg_q = (e:any, qNumber:any)=>{//[{type:'q' fileName:'', text:'', imgFile : ''qNumber:'']
    const file = e.target.files[0];
    if(!file)return

    setQaList((prevList : any) => {

      return prevList?.map((item : any) => 
        item.qNumber === qNumber ? { ...item, fileName:file.name, imgFile: file } : item
      );
    });
  }

    //답이미지 선택용
    const selectImg_a = (e:any, qNumber:any, aNumber:any, isCheckImg:any)=>{//[{type:'a' fileName_check_y:'' fileName_check_n imgFile_check_y imgFile_check_n, text:'', imgFile : ''qNumber:'' aNumber:']
      const file = e.target.files[0];
      if(!file)return

      const imgNameKey= isCheckImg ? 'fileName_check_y' : 'fileName_check_n'
      const imgFileKey= isCheckImg ? 'imgFile_check_y' : 'imgFile_check_n'

      const existingItem = qaList.find(item => item.qNumber === qNumber);
      let aTemp = existingItem.aList[aNumber];
      aTemp[imgNameKey] = file.name
      aTemp[imgFileKey] = file


      const updateQaList =qaList?.map((item : any)=>{
        return item.qNumber == qNumber ? existingItem : item
      })

      setQaList(updateQaList)
  

    }

    const onChangeValue_q = (qNumber:any, value:any)=>{
      setQaList((prevList : any) => {
        return prevList?.map((item : any) => {

          return item.qNumber === qNumber ? { ...item,  text:value} : item
        }
    
        );

      });
    }

    const onChangeValue_a = (qNumber:any, aNumber:any, value:any)=>{

      const existingItem = qaList.find(item => item.qNumber === qNumber);
      existingItem.aList[aNumber].text = value;


      const updateQaList =qaList?.map((item : any)=>{
        return item.qNumber == qNumber ? existingItem : item
      })

      setQaList(updateQaList)
    }

    const addQFnc = ()=>{//질문추가
      const temp1 =  {

        name:'', text:'', 
        qNumber: qaList.length,
        aList:[],
        imgFile : null,
        fileName : '',

      }
      setQaList((prevList)=>{return [...prevList, temp1];} )

    }

    const addAFnc = (qNumber:any)=>{//답변추가

      const existingItem = qaList.find(item => item.qNumber === qNumber);

      const aNumber = existingItem.aList.length 

      const temp2 =  {

        name:'', text:'', 
        qNumber: qNumber,
        aNumber : aNumber, 
        imgFile_check_y: null, 
        imgFile_check_n:null,
        fileName_check_y : '',
        fileName_check_n : ''   
    
      }
      existingItem.aList.push(temp2)

      const updateQaList =qaList?.map((item : any)=>{
        return item.qNumber == qNumber ? existingItem : item
      })

      setQaList(updateQaList)
    }

    const addSub = ()=>{//질문추가
      const temp1 =  {
        id : subList.length,
        name:'', text:'', 
        subNmber: 0,
        imgFile : null,
        fileName : '',

      }
      setSubList((prevList)=>{return [...prevList, temp1];} )

    }

      //질문이미지 선택용
  const selectImg_sub = (e:any, id:any)=>{//[{type:'q' fileName:'', text:'', imgFile : ''qNumber:'']
    const file = e.target.files[0];
    if(!file)return
    setSubList((prevList : any) => {

      return prevList?.map((item : any) => 
        item.id == id ? { ...item, fileName:file.name, imgFile: file } : item
      );
    });
  }

  
  const onChangeValue_sub = (id:any, value:any)=>{
    setSubList((prevList : any) => {
      return prevList?.map((item : any) => {

        return item.id == id ? { ...item,  subNumber:value} : item
      }
  
      );

    });
  }


  const selectOption = useCallback((keyName:any, value : any)=>{
    setPageDetail((prevState :any) => ({
      ...prevState,  // 이전 상태를 복사
      [keyName]: value   // name 키의 값만 변경
    }));
  },[])

  const checkboxChange = (item:any, type:any="ad")=>{

    const updatedCheckboxes = scriptList?.map((data) => {
      //console.log( { ...data, isCheck : !data.isCheck } )
      return data.num == item.num ? { ...data, isCheck : !data.isCheck } : data
    });


    setScriptList(updatedCheckboxes);

  }

  const checkboxChange_2 = (item:any, type:any="ad")=>{
    
    const updatedCheckboxes = scriptList_comp?.map((data) => {
      //console.log( { ...data, isCheck : !data.isCheck } )
      return data.num == item.num ? { ...data, isCheck : !data.isCheck } : data
    });
    setScriptList_comp(updatedCheckboxes);

  }

  const removeList_sub = (id : any)=>{
    const updateList = subList.filter((item)=>(item.id != id))
    setSubList(updateList)
  }

  const removeList_q = (qNumber : any)=>{
    let updateList = qaList.filter((item)=>(item.qNumber != qNumber))
    console.log("remove q :: ", updateList)
    updateList = updateList.map((item: any, index: number) => ({
      ...item,
      qNumber: index,
      aList : item.aList?.map((item2 : any)=>({...item2, qNumber : index}))
    }));
    setQaList(updateList)
  }

  const removeList_a = (qNumber : any, aNumber: any)=>{
    const existingItem = qaList.find(item => item.qNumber === qNumber);
    let updateAList = existingItem?.aList?.filter((item : any)=>(item.aNumber != aNumber));
    updateAList = updateAList.map((item: any, index: number) => ({
      ...item,
      aNumber: index
    }));
    existingItem.aList = updateAList

    setQaList((prevList : any) => {

      return prevList?.map((item : any) => 
        item.qNumber === qNumber ? existingItem : item
      );
    });

  }

  





  return (

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                광고추가
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      랜딩명
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                      onChange={(e)=>{onChangeValue("page_name", e.target.value)}}
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      랜딩연동코드
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>{onChangeValue("replace_page_code", e.target.value)}}
                    />
                  </div>
                </div>

            <div className=" ">
              <label htmlFor="mainImg" className="hover:text-c-blue ">
                <input onChange={(e)=>{selectImg(e,'main')}} type="file" name="mainImg" id="mainImg" className="sr-only"/><span></span>
                <span>[메인이미지 선택]</span>
              </label>

            {mainImg.imgSrc ? 
              <Image src={mainImg.imgSrc} alt="abc" className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              width={400}
              height={200}
              style={{ width: "auto",height: "auto",}}/>
                         :
                         ''

              }
            </div>

            <br></br>


            <div className=" ">
              <label htmlFor="sendBtnImg" className="hover:text-c-blue ">
                <input onChange={(e)=>{selectImg(e,'send')}} type="file" name="sendBtnImg" id="sendBtnImg" className="sr-only"/><span></span>
                <span>[제출버튼 이미지 선택]</span>
              </label>

              {sendButtonImg.imgSrc ? 
                <Image src={sendButtonImg.imgSrc} alt="sendBtnImg" className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                width={400}
                height={100}
                style={{ width: "auto",height: "auto",}}/>
                          :
                          ''

                }
            </div>
            <br></br>

            
            <div className=" ">
              <label htmlFor="compImg" className="hover:text-c-blue ">
                <input onChange={(e)=>{selectImg(e,'comp')}} type="file" name="compImg" id="compImg" className="sr-only"/><span></span>
                <span>[왼료페이지 이미지 선택]</span>
              </label>

            {compImg.imgSrc ? 
              <Image src={compImg.imgSrc} alt="abc" className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
              width={400}
              height={200}
              style={{ width: "auto",height: "auto",}}/>
                         :
                         ''

              }
            </div>

            <br></br>
          

            {subList?.map((item, index)=>{
                     
            return (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark " key={'sub'+index}>
              <div>
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark  ">
                  <div>
                  <span className="text-xs"> -- </span> &nbsp;&nbsp;
                  <input
                    type="number"
                    id={'sub_'+index + '' } 
                    value={item.subNumber || ''}
                    onChange={(e)=>{onChangeValue_sub(item.id, e.target.value)}}
                    placeholder="순서 입력"
                    className=" outline-none w-1/2"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label htmlFor={'sub_img_'+index + ''} className="hover:text-c-blue">
                      <input onChange={(e)=>{selectImg_sub(e,item.id)}} type="file" id={'sub_img_'+index + ''} className="sr-only"/><span></span>
                      <span className="text-xs">[서브 이미지 선택]</span>
                  </label>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-xs hover:text-c-blue hover:cursor-default" onClick={()=>{removeList_sub(item.id)}}>[삭제]</span>
               
                  </div>
                  <div>
                    <span className="text-xs">파일명 : {item.fileName}</span>
                  </div>
                  
                </div>
                </div>
                </div>

                
            )})}

            < div className="mb-3 mt-5 items-center justify-between">
                <button onClick={()=>{addSub()}}><label className="hover:text-c-blue">[서브이미지 추가]</label></button>
                <span className="text-xs"> ** 0~9:메인바로다음 10~ : 입력란 다음</span>
            </div>
            
           
                
            

                <br></br>
          <div className="space-y-4">
          {qaList?.map((item, index)=>{

                                            
            return (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark " key={'q'+index}>
              <div>
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark  ">
                  <div>
                  --&nbsp;&nbsp;
                  <input
                    type="text"
                    id={'a_'+index + '' } 
                    value={item.text || ''}
                    onChange={(e)=>{onChangeValue_q(index, e.target.value)}}
                    placeholder="질문 입력"
                    className=" outline-none w-1/2"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <label htmlFor={index + ''} className="hover:text-c-blue">
                      <input onChange={(e)=>{selectImg_q(e,index)}} type="file" name={index + ''} id={index + ''} className="sr-only"/><span></span>
                      <span className="text-xs">[질문 이미지 선택]</span>
                  </label>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="text-xs hover:text-c-blue hover:cursor-default" onClick={()=>{removeList_q(index)}}>[삭제]</span>

                  </div>
                  <div>
                    <span className="text-xs">파일명 : {item.fileName}</span>
                  </div>
                  
                </div>
              
                
                
            
                <div className="flex flex-col flex-row gap-5.5 p-6.5 ">
                    {item?.aList?.map((item2 : any, index2:any)=>{
                
                      return(
                        item.qNumber == item2.qNumber ? 
                      <div key={'a'+index+''+index2}>
                        <div>
                        :::&nbsp;&nbsp;<input type="text"  id={'a_'+index + '' + index2}  value={item2.text || ''} onChange={(e)=>{onChangeValue_a(index, index2, e.target.value)}} placeholder="답변 입력"className="outline-none"/>
    

                      <label htmlFor={'a_check_n'+index + '' + index2} className="hover:text-c-blue">
                          <input onChange={(e)=>{selectImg_a(e, index, index2, false)}} type="file" id={'a_check_n'+index + '' + index2} className="sr-only"/><span></span>
                          <span className="text-xs">[미체크 이미지 선택]</span>
                      </label>
    
    
                      &nbsp;

                      <label htmlFor={'a_check_y'+index + '' + index2} className="hover:text-c-blue">
                          <input onChange={(e)=>{selectImg_a(e, index, index2, true)}} type="file" id={'a_check_y'+index + '' + index2} className="sr-only"/><span></span>
                          <span className="text-xs">[체크 이미지 선택]</span>
                      </label>




                      &nbsp;&nbsp;
                      <span className="text-xs hover:text-c-blue hover:cursor-default" onClick={()=>{removeList_a(index, index2)}}>[삭제]</span>


                      </div>
                      <div>
                        <span className="text-xs"> 파일명 :  {item2.fileName_check_n} / {item2.fileName_check_y}</span>

                      </div>
                        <br></br>
                      </div> : null

                    )})}
                    

                  <div>

                  </div>

                </div>
              </div>
              <br></br>
              <div className="flex flex-col gap-5.5 p-6.5 items-center">
                <button onClick={()=>{addAFnc(index)}} className="items-end  justify-between"><label className="hover:text-c-blue text-xs">[답변추가]</label></button>
              </div>

              <br></br>
   
            </div> 
            
              )
                                          
              }
             )}
             </div>


            <div className="mb-3 mt-5 flex items-center justify-between">
                <button onClick={()=>{addQFnc()}}><label className="hover:text-c-blue">[질문추가]</label></button>
                <span className="text-xs"> ** 답변 이미지만 없는 경우:셀렉트박스형태 ** 답변 텍스트,이미지 둘다 없는 경우:인풋박스형태</span>
            </div>

              <br></br>
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">활성화여부</span>
              <SelectOption subject={"활성화"} optionList={statusList} selectedValue={'Y'} selectFnc={selectOption} keyName={"status"} key={"statustTypeSelect"}/>
              <br></br>
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">이벤트</span>
              <SelectOption subject={"이벤트"} optionList={eventList} selectedValue={''} selectFnc={selectOption} keyName={"event_num"} key={"clientTypeSelect"}/>
              <br></br>
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">매체</span>
              <SelectOption subject={"매체"} optionList={mediaList} selectedValue={''} selectFnc={selectOption}keyName={"media_id"} key={"mediaTypeSelect"}/>
              <br></br>
              {/* <SelectOption subject={"스크립트"} optionList={scriptList} selectedValue={''} selectFnc={selectOption} keyName={"script_num"} key={"scriptSelect"}/> */}
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">개인정보취급방침</span>
              <SelectOption subject={"개인정보취급방침"} optionList={privacyList} selectedValue={''} selectFnc={selectOption} keyName={"privacy_num"} key={"privacySelect"}/>
              <br></br>
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">개인정보 이용동의 디폴트 체크 여부</span>
              <SelectOption subject={"개인정보 이용동의 디폴트 체크 여부"} optionList={privacy01checkYNList} selectedValue={''} selectFnc={selectOption} keyName={"privacy01checkYN"} key={"privacy01checkYNSelect"}/>
              <br></br>
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">전화수신 동의 디폴트 체크 여부</span>
              <SelectOption subject={"전화수신 동의 디폴트 체크 여부"} optionList={privacy02checkYNList} selectedValue={''} selectFnc={selectOption} keyName={"privacy02checkYN"} key={"privacy02checkYNSelect"}/>
              <br></br>
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">외부api</span>
              <SelectOption subject={"외부api"} optionList={apiList} selectedValue={''} selectFnc={selectOption} keyName={"api_num"} key={"apiSelect"}/>

              <div className="mb-6">
                  <div className="mb-3 mt-5 flex items-center justify-between">
                    <div className="block text-sm font-medium text-black dark:text-white">스크립트 목록 </div> &nbsp;&nbsp;
                  </div>
                  <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              
                    <div className="flex flex-auto flex-wrap gap-3">

                    {scriptList?.map((item, index)=>{

                      return <CheckboxTwo item={item} onChangeCheckBox={checkboxChange} isCheck={item.isCheck}  key={index}/>

                    }
                    )}

                    </div>

                  </div>
 
                </div>

                <div className="mb-6">
                  <div className="mb-3 mt-5 flex items-center justify-between">
                    <div className="block text-sm font-medium text-black dark:text-white">스크립트 목록 - 완료페이지용 </div> &nbsp;&nbsp;
                  </div>
                  <div className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
              
                    <div className="flex flex-auto flex-wrap gap-3">

                    {scriptList_comp?.map((item, index)=>{

                      return <CheckboxTwo item={item} onChangeCheckBox={checkboxChange_2} isCheck={item.isCheck}  key={index}/>

                    }
                    )}

                    </div>

                  </div>
 
                </div>

             {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      이동주소
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>{onChangeValue("next_url", e.target.value)}}
                    />
                  </div>

              </div> */}
{/* 
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      외부api
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      onChange={(e)=>{onChangeValue("external_api", e.target.value)}}
                    />
                  </div>

              </div> */}
              <span className="mb-3 block text-sm font-medium text-black dark:text-white">나이입력 활성화 여부</span>
              <SelectOption subject={"나이입력 활성화 여부"} optionList={ageYNList} selectedValue={''} selectFnc={selectOption} keyName={"ageYN"} key={"ageSelect"}/>

              <br></br>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      제한 나이
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      defaultValue={pageDetail.limit_age || ''}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                      onChange={(e)=>{onChangeValue("limit_age", e.target.value)}}
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      차단 키워드 &nbsp;&nbsp; <span className="text-sm text-body"> ** 여러개 차단 하는 경우 , 붙여서 추가하면됨 - 공백없이</span> 
                    </label>
                    <input
                      type="text" 
                      placeholder="Enter"
                      defaultValue={pageDetail.block_keyword || ''}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                      onChange={(e)=>{onChangeValue("block_keyword", e.target.value)}}
                    />
                  </div>
                </div>
                

                
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendData}>
                  저장하기
                </button>
              </div>
            {/* </form> */}
          </div>

  );
};


export default Page;
