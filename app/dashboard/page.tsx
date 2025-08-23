'use client';
import { DashboardLayout } from "@/components/dashboard-layout"
import DashboardContainer from "./components/DashboardContainer"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userDetails, setUserDetails] = useState("")
  const router = useRouter();



  return (
    <>
      <DashboardLayout setUserDetails={setUserDetails}>
        <DashboardContainer userDetails={userDetails} />
      </DashboardLayout>
    </>

  )
}
