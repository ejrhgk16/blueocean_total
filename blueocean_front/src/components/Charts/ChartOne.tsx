"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import fetchToFrontServer_csr from "@/boaUtil/fetchToFrontServer_csr";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: true,
});



interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC<{store_code:any}> = ({store_code}) => {

  let options2: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      events: {
        mounted: () => setIsChartLoaded(true), // ApexCharts의 mounted 이벤트 사용
      },
      
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
  
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        1,2,3,4,5,6,7,8,9,10,11,12
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: 100,
    },
  };

  const [isChartLoaded, setIsChartLoaded] = useState(false);

  
  let series = [
      {
        name: "등록자 수",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },

    ]

   const fetchData = async (param={}) => {
      try {
        const targetUrl = '/api/store/dashboard/chart'

        const res = await fetchToFrontServer_csr.boaGet(targetUrl,param)
        const result = await res.json()
        
        let max = Math.ceil(result.data.max / 10) * 10;

        if(max > 10 && max <= 50) max = 50
        if(max > 50 && max <= 100) max = 100
        if(max > 100 && max <= 500) max = 500
        if(max > 500) max = 1000

        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: result.data.dateList,
          },
          yaxis: {
            ...prevOptions.yaxis,
            max: max,
          },
        }));

        setChartData(result.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

  
  const [chartData, setChartData] = useState<Record<string,any>>({dateList : [], dataList : []})

  const [selectedType, setSelectedType] = useState('day')
  const [options, setOptions] = useState<Record<string, any>>(options2)



  const onClickTypeButton = async (type : any) => {
    setSelectedType(type)
  }

  // useEffect(()=>{fetchData({type:selectedType, store_code:store_code})},[])

  

  useEffect(()=>{fetchData({type:selectedType, store_code:store_code})}, [selectedType])

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">등록자 수 추이</p>
              <p className="text-sm font-medium"></p>
            </div>
          </div>

        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button onClick={()=>{onClickTypeButton('day')}} className={selectedType=="day"?
            "rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark":
            "rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark" }>
              Day
            </button>
            <button onClick={()=>{onClickTypeButton('week')}} className={selectedType=="week"?
            "rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark":
            "rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark" }>
              Week
            </button>
            <button onClick={()=>{onClickTypeButton('month')}} className={selectedType=="month"?
            "rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark":
            "rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark" }>
              Month
            </button>

          </div>
        </div>
      </div>
     
      <div>
      <div id="chartOne" className="-ml-5" style={{ position: "relative", width: "100%", minHeight: "500px" }}>
      {
        <ReactApexChart
          options={options}
          series={[{name:"등록자 수", data:chartData.dataList}]}
          type="area"
          height={500}
          width={"100%"}
        />

      } 
      </div>
    </div> 
   
    </div>
  );
};

export default ChartOne;
