"use client";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";

// const Pagination: React.FC<{subject:any, optionList:any, selectedValue:any ,selectFnc:any}> = ({subject, optionList=[], selectedValue='', selectFnc}) => {
//   const [selectedOption, setSelectedOption] = useState(selectedValue);
//   const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

//   const changeTextColor = () => {
    
//     setIsOptionSelected(true);
//   };

//   useEffect(() => {
//     setSelectedOption(selectedValue);
//   }, [selectedValue]);

const Pagination: React.FC<{pageInfo:any, schParam?:any, fetchData:any}> = ({pageInfo={},schParam={}, fetchData})=>{
    
    const [paging, setPaging] = useState(pageInfo)
    const [pagingNumberList, setpagingNumberList] = useState<any[]>([])

    const onClickPage = (e:React.MouseEvent<HTMLAnchorElement, MouseEvent>, pageNum:any)=>{
        e.preventDefault()
        const param = {...schParam, ...paging, pageNum:pageNum, keyword : paging.keyword}
        fetchData(param)
    }



    useEffect(()=>{
        setPaging(pageInfo)

        const startNum = pageInfo.startPage
        const endNum = pageInfo.endPage

        const pageArr = []
       
        for(var i = startNum; i<= endNum; i++ ){
            pageArr.push(i)
        }

        setpagingNumberList(pageArr)

  
    

    }, [pageInfo])



    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
            <a
            href="#"
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
            Previous
            </a>

        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
            {/* <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">97</span> results
            </p> */}
            </div>
            <div>
            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">

                
                {
                    paging.prevTF ? 
                    <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray focus:z-20 focus:outline-offset-0"
                    onClick={(e)=>{onClickPage(e, pageInfo.startPage-1)}}
                    >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
                    </a> :null
                  /* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", 
                  Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */

                }

                


                {pagingNumberList?.map((pageNum, i)=>(
                    <a key={i}
                    href="#"
                    aria-current="page"
                    className={pageInfo.pageNum == pageNum ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray focus:z-20 focus:outline-offset-0"}
                    onClick={(e)=>{onClickPage(e, pageNum)}}
                    >
                    {pageNum}
                    </a>
                ))}
                

                
                {/* <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
                </span> */}

                {
                    paging.nextTF ?
                    <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray focus:z-20 focus:outline-offset-0"
                    onClick={(e)=>{onClickPage(e, pageInfo.endPage+1)}}
                    >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
                    </a> : null 
                }
            

            </nav>
            </div>
        </div>
        </div>


  );
};

export default Pagination;
