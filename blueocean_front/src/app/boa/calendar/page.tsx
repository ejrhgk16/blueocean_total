import Calendar from "@/components/Calender";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect } from "react";
import axios from 'axios';

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const fetchData = async () => {

  try {

    const params2 = {abc : "testsetset", def : "test123123"}
    //const response = await axios.get("http://localhost:3300/api", {params : {url : "testsetset"}});
    const queryString = new URLSearchParams(params2).toString(); 
    const response = await fetch(process.env.FRONT_DOMAIN +'/api/boa?'+queryString , {cache : 'no-store'});


    //console.log(response)
    return response

  } catch (err) {

  }
};

const CalendarPage = () => {


  const abc= fetchData();

  return (
    
    <DefaultLayout>
 
      <Calendar />
    </DefaultLayout>
  );
};

export default CalendarPage;
