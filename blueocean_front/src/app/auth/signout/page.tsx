'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import fetchToFrontServer_csr from "@/boaUtil/fetchToFrontServer_csr";

const SignUp: React.FC = () => {

  const { logout, authState } = useAuth();
  const router = useRouter();

  const targetUrl = '/api/auth/logout'
  const body = {}

  useEffect(() => {
    fetchToFrontServer_csr.boaGet(targetUrl, body).then(()=>{
      logout();
      router.replace("/")
  })
  }, [])

  return (
    <div></div>
  );
};

export default SignUp;
