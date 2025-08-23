"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
// import { getCoursesByInstructor, createCourse, type Course } from "@/lib/courses"
// import { createZoomMeeting, getZoomMeetings, type ZoomMeeting } from "@/lib/integrations"
import { useRouter } from "next/navigation"
import FacultyContainer from "@/app/faculty/components/FacultyContainer"

export default function FacultyPage() {
  const [userDetails, setUserDetails] = useState<any>("")
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // If no token, redirect to login page
      router.push('/login');
      return;
    }

    const fetchProtectedData = async () => {
      setLoadingData(true);
      setError('');
      try {
        const response: any = await fetch(process.env.NEXT_PUBLIC_API_BASE_PATH +'api/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Attach the JWT token
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setUserDetails(data.data)
        } else if (response.status === 401) {
          // Token expired or invalid
          setError('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('jwtToken'); // Clear invalid token
          router.push('/login'); // Redirect to login
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch protected data.');
        }
      } catch (err) {
        console.error('Error fetching protected data:', err);
        setError('Network error or server is unreachable.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchProtectedData();
  }, [router]); // Depend on router to avoid lint warnings, though it's stable

  return (
    <DashboardLayout>
      <FacultyContainer userDetails={userDetails} instructorId={userDetails.username} />
    </DashboardLayout>
  )
}


