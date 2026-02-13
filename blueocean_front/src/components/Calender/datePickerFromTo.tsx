import { useState } from "react";
//import {DatePicker} from "@nextui-org/date-picker";
import Datepicker from "react-tailwindcss-datepicker";


const DatePickerFromTo: React.FC<{defaultDateObj?:any, onchangeValue:any}> = ({defaultDateObj={}, onchangeValue}) => {

  let today = new Date()
  let yesterday = new Date()
  yesterday.setDate(today.getDate() - 1);

  const [value, setValue] = useState({ 
    startDate: yesterday, 
    endDate: today
  });
  

  return (
    // <DatePicker label="시작일" className="max-w-[284px]" />
    <Datepicker value={value} onChange={(newValue:any) => setValue(newValue)}  /> 
  );
};

export default DatePickerFromTo;
