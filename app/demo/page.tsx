'use client';
// pages/login.js (for Pages Router) or app/login/page.js (for App Router)
// This example uses the Pages Router convention, but can be adapted for App Router.
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// For icons
import { User, Lock, LogIn, LoaderIcon } from 'lucide-react'; 

export default function LogoutPage() {
  const router = useRouter();

  useEffect(()=>{
    if (window !== undefined){
      localStorage.removeItem('jwtToken'); // Clear invalid token
      router.push('/'); // Redirect to login
    }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      <LoaderIcon className='animate-spin'/> <span className='ml-2'>You are logging out</span>
    </div>
  );
}
