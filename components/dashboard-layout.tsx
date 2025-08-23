"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart3, BookOpen, Eye, Home, Mail, Menu, Settings, Trophy, Users, Award, Bell, Router } from "lucide-react"
import { UserDropDown } from "./user_dropdown"
import { LoadingSkeleton } from "./loading_notification/loading-skeleton"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
//   { name: "DICOM Viewer", href: "/cases/viewer", icon: Eye },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Achievements", href: "/achievements", icon: Award },
  { name: "Faculty", href: "/faculty", icon: Users },
  { name: "Admin", href: "/admin", icon: Users },
//   { name: "Settings", href: "/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode;
  setUserDetails ?: (value: any) => void;
}

export function DashboardLayout({ children, setUserDetails }: DashboardLayoutProps) {

  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>('')



  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      // If no token, redirect to login page
      router.push('/login');
      return;
    }

    // Function to fetch protected data
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
          setUser(data.data)
          if (setUserDetails){
            setUserDetails(data.data)
          }
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


  
  if (loadingData) {
    return (
      <LoadingSkeleton/>
    )
  }
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RL</span>
              </div>
              <span className="font-bold text-xl">RadiologyLMS</span>
            </Link>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center flex-shrink-0 px-4 py-5">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RL</span>
                </div>
                <span className="font-bold text-xl">RadiologyLMS</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-2">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-background border-b">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden ml-4" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1" />
            <div className="ml-4 flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <ModeToggle />
              <UserDropDown user={user}/>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
