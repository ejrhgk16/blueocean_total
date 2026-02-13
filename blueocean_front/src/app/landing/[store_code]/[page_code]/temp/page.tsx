'use client';

import { useState, useEffect } from 'react';
import Landing from "@/components/landing/landing";
import fetchToFrontServer_csr from '@/boaUtil/fetchToFrontServer_csr';

// --- 타입 정의 ---
interface PageParams {
  store_code: string;
  page_code: string;
}

interface PageProps {
  params: PageParams;
}

interface PageInfo {
  status: string;
  store_code: string;
  page_code: string;
  [key: string]: any; // 그 외 다른 속성들
}

interface Answer {
  text: string;
  value: number;
  qNumber: number;
  aNumber: number;
  [key: string]: any;
}

interface Question {
  text: string;
  fileName: string;
  qNumber: number;
  isAImg: boolean;
  selectedANumber: number | null;
  aList: Answer[];
  [key: string]: any;
}

interface SubContent {
  text: string;
  fileName: string;
  subNumber: number;
  [key: string]: any;
}

interface ContentData {
  mainImg?: any;
  sendButtonImg?: any;
  qaList: Question[];
  subList_1: SubContent[];
  subList_2: SubContent[];
}

interface ScriptItem {
  script_id: number;
  script_content: string;
  [key: string]: any;
}

// --- 컴포넌트 시작 ---
export default function CsrLandingPage({ params }: PageProps) {
  // console.log(params)
  const { store_code, page_code } = params;

  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [pageInfoData, setPageInfoData] = useState<PageInfo | null>(null);
  const [scriptList, setScriptList] = useState<ScriptItem[]>([]);
  const [noscriptList, setNoscriptList] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store_code || !page_code) {
      setLoading(false);
      setError('Store code or Page code is missing.');
      return;
    }

    async function fetchDataAndProcess() {
      setLoading(true);
      try {
        const url = (process.env.NEXT_PUBLIC_BACK_DOMAIN) + '/landing/content/list?store_code=' + store_code + "&page_code=" + page_code;
        const param2 = {page_code : page_code, store_code : store_code} 
        const res = await fetch(url)
        const result = await res.json()

        

        if (!res.ok) {
          throw new Error(`데이터를 가져오는 데 실패했습니다: ${res.status}`);
        }

        const processedPageInfo: PageInfo = {
          ...result.pageInfo,
          store_code: store_code,
          page_code: page_code,
        };

        console.log("processedPageInfo", processedPageInfo)

        if (processedPageInfo.status !== 'Y') {
          throw new Error("비활성화 이벤트");
        }

        const processedContentData: Partial<ContentData> = {};
        const qaList: Question[] = [];
        const subList_1: SubContent[] = [];
        const subList_2: SubContent[] = [];

        result.contentList.forEach((item: any) => {
            if(item.content_type == "main"){
                processedContentData.mainImg = item
            }
            if(item.content_type == "send"){
                processedContentData.sendButtonImg = item
            }

            if(item.content_type == "sub"){
                const content_name_Arr= item.content_name.split("_");
                const subNumber = parseInt(content_name_Arr[1])
                const temp: SubContent = {...item, text:item.content_text, fileName:item.content_img_name, subNumber:subNumber}
                if(subNumber < 10){
                    subList_1.push(temp)
                }else{
                    subList_2.push(temp)
                }
            }

            if(item.content_type == "q"){
                const content_name_Arr= item.content_name.split("_");
                const qNumber = parseInt(content_name_Arr[1])
                const qTemp: Question = {...item, text:item.content_text, fileName:item.content_img_name, qNumber:qNumber, isAImg : true, selectedANumber : null, aList:[]}
                qaList.push(qTemp)
            }

            if(item.content_type == "a"){
                const content_name_Arr= item.content_name.split("_");
                const qNumber = parseInt(content_name_Arr[1])
                const aNumber = parseInt(content_name_Arr[2])
                const a_yn = content_name_Arr[3]

                if(!item.content_img_name){
                    qaList[qNumber].isAImg = false
                }

                const tempKeyName = a_yn == "y" ? "fileName_check_y" : "fileName_check_n"
                const tempKeyName2 = a_yn == "y" ? "content_img_path_y" : "content_img_path_n"

                const aTemp: Answer = {...item, text : item.content_text, value:aNumber, qNumber:qNumber, aNumber : aNumber, [tempKeyName] : item.content_img_name, [tempKeyName2] : item.content_img_path}

                const temp = qaList[qNumber].aList.find((item : any) => (item.content_name.indexOf(qNumber+"_"+aNumber) > -1))
                
                if(temp){
                    temp[tempKeyName] = item.content_img_name;
                    temp[tempKeyName2] = item.content_img_path
                }else{
                    qaList[qNumber].aList.push(aTemp)
                }
            }
        });

        processedContentData.qaList = qaList;
        processedContentData.subList_1 = subList_1;
        processedContentData.subList_2 = subList_2;

        const processedNoscriptList: ScriptItem[] = [];
        const processedScriptList: ScriptItem[] = [];

        result.scriptList?.forEach((item: any) => {
            if(item.script_content?.indexOf("noscript") > -1){
                let sc = item.script_content?.replace(/<\/?noscript>/g, '').trim();
                item.script_content = sc.replace(/<!--[\s\S]*?-->/g, '');
                processedNoscriptList.push(item);
            } else {
                let sc = item.script_content?.replace(/<\/?script>/g, '').trim();
                item.script_content = sc.replace(/<!--[\s\S]*?-->/g, '');
                processedScriptList.push(item);
            }
        });

        setPageInfoData(processedPageInfo);
        setContentData(processedContentData as ContentData);
        setScriptList(processedScriptList);
        setNoscriptList(processedNoscriptList);

      } catch (err: any) {
        // setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDataAndProcess();
  }, [store_code, page_code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  if (!contentData || !pageInfoData) {
    return <div>콘텐츠를 표시할 수 없습니다.</div>;
  }

  return (
    <>
      <Landing 
        contentData={contentData} 
        pageInfoData={pageInfoData} 
        scriptList={scriptList} 
        noscriptList={noscriptList}
      />
    </>
  );
}

