
import Landing from "@/components/landing/landing"


interface Data {
  contentList: [],
  pageInfo: {}
}
 

// export const revalidate = 60
 
// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true // or false, to 404 on unknown paths
 
// [category]와 [product] 모두에 대한 세그먼트를 생성합니다.
export async function generateStaticParams() {
  // const products = await fetch('https://.../products').then((res) => res.json())
 
  // return products?.map((product) => ({
  //   category: product.category.slug,
  //   product: product.id,
  // }))
  return []//초기요청은 캐싱없이 랜더링
}
 

export default async function Page({ params }: { params: { store_code: string, page_code:string } }) {
  //process.env.BACK_DOMAIN
  const url =  process.env.BACK_DOMAIN + '/landing/content/list?store_code='+params.store_code+"&page_code="+params.page_code

  let result;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Fetch failed with status:', res.status);
      // throw new Error('Failed to fetch data');
    }
    result = await res.json();
  } catch (e) {
    console.error(e);
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  const contentData : Record<string,any> = {}
  let pageInfoData : Record<string,any> = {}

  pageInfoData = result.pageInfo
  pageInfoData.store_code = params.store_code
  pageInfoData.page_code = params.page_code

  if(pageInfoData.status != 'Y'){
    return <div>만료된 페이지입니다.</div>;
  }

  let today = new Date()
  console.log("in event page no cache ::: " + today)

  const qaList : Record<string,any>[] = []
  const subList_1 : Record<string,any>[] = []
  const subList_2 : Record<string,any>[] = []

  result.contentList.forEach((item : any)=>{
    if(item.content_type == "main"){
      contentData.mainImg = item
    }
    if(item.content_type == "send"){
      contentData.sendButtonImg = item
    }
  

    if(item.content_type == "sub"){
      const content_name_Arr= item.content_name.split("_");
      const subNumber = parseInt(content_name_Arr[1])
      const temp = {...item, text:item.content_text, fileName:item.content_img_name, subNumber:subNumber}
      if(subNumber < 10){
        subList_1.push(temp)
      }else{
        subList_2.push(temp)
      }
      
    }
   

    if(item.content_type == "q"){
      const content_name_Arr= item.content_name.split("_");
      const qNumber = parseInt(content_name_Arr[1])
      const qTemp = {...item, text:item.content_text, fileName:item.content_img_name, qNumber:qNumber, isAImg : true, selectedANumber : null, aList:[]}
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


      const aTemp = {...item, text : item.content_text, value:aNumber, qNumber:qNumber, aNumber : aNumber, [tempKeyName] : item.content_img_name, [tempKeyName2] : item.content_img_path}

      const temp = qaList[qNumber].aList.find((item : any) => (item.content_name.indexOf(qNumber+"_"+aNumber) > -1))
     
      if(temp){
        temp[tempKeyName] = item.content_img_name;
        temp[tempKeyName2] = item.content_img_path
      }else{
        qaList[qNumber].aList.push(aTemp)
      }

    }

  })

  contentData.qaList = qaList
  contentData.subList_1 = subList_1
  contentData.subList_2 = subList_2

  const noscriptList : any[] = []
  const scriptList : any[] = []

  result.scriptList?.forEach((item:any) => {
   
   
 
    if(item.script_content?.indexOf("noscript") > -1){
      let sc = item.script_content?.replace(/<\/?noscript>/g, '').trim();

      item.script_content = sc.replace(/<!--[\s\S]*?-->/g, '');
      
      noscriptList.push(item)
    }else{
      let sc = item.script_content?.replace(/<\/?script>/g, '').trim();

      item.script_content = sc.replace(/<!--[\s\S]*?-->/g, '');
      scriptList.push(item)
    }
  });


  // console.log(noscriptList);
  // console.log(scriptList);


  return (
    <>
       {/* <head>
          {scriptList?.map((item : any) => {
            console.log("item", item);

            return <script key={item.script_id} dangerouslySetInnerHTML={{ __html: item.script_content }} />
          } )}
      </head> */}

      {/* <body> */}

      {/* {nosciprtList?.map((item : any) => (
            <noscript key={item.script_id} dangerouslySetInnerHTML={{ __html: item.script_content }} />
        ))} */}



        <Landing contentData={contentData} pageInfoData={pageInfoData} scriptList={scriptList} noscriptList={noscriptList}>

        </Landing>

      {/* </body> */}


      

    </>
  )
}