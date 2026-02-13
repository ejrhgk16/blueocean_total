// "use client";
// import "jsvectormap/dist/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";

// import React, { useEffect, useState } from "react";


import { AuthProvider } from "@/context/AuthContext";


import "@/css/satoshi.css";
import "@/css/style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 

  // const pathname = usePathname();
  
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 500);
  // }, []);


  return (
    <html >
      <head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}
      </head>

      {/* <head>
        <script key={12} dangerouslySetInnerHTML={{ __html: aa }} />
      </head> */}


      {
//         isExcludedPage == false ?       
//         <AuthProvider>
//         <body suppressHydrationWarning={true}>
//           <div className="dark:bg-boxdark-2 dark:text-bodydark ">
// {/*    
//             {loading ? <Loader /> : children} */}
//             {children}
//           </div>
//         </body>
//         </AuthProvider>
        
//         :
//         <body suppressHydrationWarning={true}>
//         <div className="bg-white overflow-x-hidden ">
//           {children}
//         </div>
//       </body>
      }

      <AuthProvider>
        <body suppressHydrationWarning={true}>
         
            {children}
         

          {/* 필요 시 고정 오버레이, 모달 등 */}
          {/* <div id="overlay-root"></div> */}
        </body>
      </AuthProvider>
  

    </html>
  );
}
