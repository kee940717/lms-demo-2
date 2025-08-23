'use client';
import CoursesContainer from "./components/CoursesContainer"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CoursesPage() {
    const [userDetails, setUserDetails] = useState<any>("");

    return (
        <DashboardLayout setUserDetails={setUserDetails}>
            <CoursesContainer userDetails={userDetails}/>
        </DashboardLayout>
    )
}

