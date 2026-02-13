'use client';

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface BodyLayoutProps {
  children: React.ReactNode;
}

export default function BodyLayout({ children }: BodyLayoutProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 클라이언트 마운트 전에는 아무것도 렌더링하지 않음
  if (!mounted) return null;

  const isExcludedPage = pathname.includes("landing");
//   console.log("isExcludedPage", isExcludedPage)

  if (isExcludedPage) {
    return <div className="bg-white overflow-x-hidden">{children}</div>;
  }

  return <div className="dark:bg-boxdark-2 dark:text-bodydark">{children}</div>;
}
