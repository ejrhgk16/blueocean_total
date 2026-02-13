"use client";
import React, { useEffect, useState } from "react";

const SelectOption: React.FC<{subject:any, optionList:any, selectedValue:any ,selectFnc:any, keyName?:any, isNoHeader?:any, qNumber?:any}> = ({subject, optionList=[], selectedValue='', selectFnc, keyName='', isNoHeader = false, qNumber=0}) => {
  const [selectedOption, setSelectedOption] = useState(selectedValue);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    
    setIsOptionSelected(true);
  };

  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue]);

  function getObjectParticle(word:any) {//을를 을 를 구분
    // 한글 자음과 모음의 유니코드 범위
    const lastChar = word.charCodeAt(word.length - 1);
    const baseCode = '가'.charCodeAt(0); // 가의 유니코드 기준
    const hasBatchim = (lastChar - baseCode) % 28 !== 0; // 받침 유무 체크

    return word+(hasBatchim ? '을' : '를');
}


  return (
    <div className="">
      {isNoHeader? <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {" "}
        {subject}{" "}
      </label>
      :""
      }

      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          value={selectedOption ?? ''} 
          onChange={(e) => {
            setSelectedOption(e.target.value);
            
            changeTextColor();

            if(keyName !== null && keyName !== undefined && keyName !== ''){
              selectFnc(keyName, e.target.value)
            }
            else{
              selectFnc(e.target.value)
            }
          }}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {getObjectParticle(subject)} 선택하세요
          </option>

          {optionList?.map((item:any, index:any)=>(
            <option key={index} value={item.value} className="text-body dark:text-bodydark">
              {item.text}
            </option>
          )

          )}

        </select>

        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectOption;
