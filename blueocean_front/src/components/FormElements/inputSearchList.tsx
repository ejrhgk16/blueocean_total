import useDebounce from "@/hooks/useDebounce";
import React, { useState, useEffect, useRef } from "react";
import { KeyboardEvent } from 'react';

interface Option {
  value: string;
  text: string;
  selected: boolean;
  element?: HTMLElement;
}

interface DropdownProps {
  id: string;
}

// const useDebounce = (value :any, delay:any) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   console.log("useDebounce ::: ")
  
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
    
//     return () => clearTimeout(timer);
//   }, [value, delay]);
  
//   return debouncedValue;
// }

const InputSearchList: React.FC<{id:any, searchFnc:any, itemClickFnc:any, defaultValue?:any, type?:any, subject?:any, subject2?:any}> = React.memo(({ id, searchFnc, itemClickFnc, defaultValue='', type=1, subject='계정', subject2}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null); 

  const[searchDataList, setSearchDataList] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('')
  
  const [isSearch, setIsSearch] = useState(false)
  const debouncedSchKeyWord = useDebounce(searchKeyword, 250);



  useEffect(() => {

    setSearchKeyword(defaultValue)

  }, [defaultValue]);

  useEffect(()=>{

    if(!isSearch){
      return
    }
    
    try{
      const search = async ()=>{

        const data = await searchFnc(debouncedSchKeyWord)

        setSearchDataList(data)
        open()
      }

      if(debouncedSchKeyWord){
        search()
      }

    }catch(error){

    }
  },[debouncedSchKeyWord])



  const select = (item:any)=>{

    setIsSearch(false)

    if(type!=2){
      setSearchKeyword(item.text)  
    }else{
      setSearchKeyword('')  
    }
    
    itemClickFnc(item)
    setShow(false)
  }

  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  // const select = (index: number, event: React.MouseEvent) => {
  //   const newOptions = [...options];

  //   if (!newOptions[index].selected) {
  //     newOptions[index].selected = true;
  //     newOptions[index].element = event.currentTarget as HTMLElement;
  //     setSelected([...selected, index]);
  //   } else {
  //     const selectedIndex = selected.indexOf(index);
  //     if (selectedIndex !== -1) {
  //       newOptions[index].selected = false;
  //       setSelected(selected.filter((i) => i !== index));
  //     }
  //   }

  //   setOptions(newOptions);
  // };


  const selectedValues = () => {
    return selected?.map((option) => options[option].value);
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !show ||
        dropdownRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setShow(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <div className="relative z-50" >

      <div>

        <div className="flex flex-col items-center">
          
          <div className="relative z-20 inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div ref={trigger} className="w-full">
                <div className="mb-2">
                  <div className="flex flex-auto flex-wrap gap-3">
               
                   
                      <div className="flex-1">
                        <input
                          //defaultValue={defaultText}
                          value={searchKeyword ? searchKeyword : ''}
                          placeholder={subject2? subject2 : "추가할 " +subject+" 검색"}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary" 
                          onKeyDown={()=>{setIsSearch(true)}} onChange={(e)=>{setSearchKeyword(e.target.value)}}//키보드로 눌러서 입력한경우만 검색되도록 
                        />
                      </div>
                
                  </div>

                </div>
              </div>
              <div className="w-full px-4">
                <div
                  className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-gray shadow dark:bg-form-input ${
                    isOpen() ? "" : "hidden"
                  }`}
                  ref={dropdownRef}
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                >
                  <div className="flex w-full flex-col">
                      <div key={'searchResult'}>
                        <div
                          className="w-full cursor-pointer rounded-t border-b border-stroke dark:border-form-strokedark"
   
                        >
                          <div
                            className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 `}//${option.selected ? "border-primary" : ""}
                          >
                            <div className="flex w-full items-center">
                              <div className="mx-2 leading-6">
                                검색결과 :::: 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
  
                    {searchDataList?.map((item, index) => (
                      <div key={index}>
                        <div
                          className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
   
                          onClick={(event) =>{ select(item) }}
                        >
                          <div
                            className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 `}//${option.selected ? "border-primary" : ""}
                          >
                            <div className="flex w-full items-center">
                              <div className="mx-2 leading-6">
                                {item.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
InputSearchList.displayName = "InputSearchList";
export default InputSearchList;
