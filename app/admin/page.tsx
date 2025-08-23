"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Mail,
  Settings,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  CreditCard,
  UserPlus,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCourses: number
  totalRevenue: number
  monthlyGrowth: number
  pendingPayments: number
  emailCampaigns: number
  systemHealth: number
}

interface RecentActivity {
  id: string
  type: "user_signup" | "course_enrollment" | "payment" | "email_sent"
  description: string
  timestamp: Date
  status: "success" | "pending" | "error"
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    pendingPayments: 0,
    emailCampaigns: 0,
    systemHealth: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  const mockStats: DashboardStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalCourses: 45,
    totalRevenue: 89750.5,
    monthlyGrowth: 12.5,
    pendingPayments: 8,
    emailCampaigns: 12,
    systemHealth: 98.5,
  }

  const mockActivity: RecentActivity[] = [
    {
      id: "1",
      type: "user_signup",
      description: "Dr. Sarah Johnson signed up for RadiologyLMS",
      timestamp: new Date("2024-01-18T10:30:00"),
      status: "success",
    },
    {
      id: "2",
      type: "payment",
      description: "Payment of $299.99 received from Dr. Michael Chen",
      timestamp: new Date("2024-01-18T09:15:00"),
      status: "success",
    },
    {
      id: "3",
      type: "email_sent",
      description: "Welcome email campaign sent to 45 new users",
      timestamp: new Date("2024-01-18T08:00:00"),
      status: "success",
    },
    {
      id: "4",
      type: "course_enrollment",
      description: "15 users enrolled in Advanced MRI Techniques",
      timestamp: new Date("2024-01-17T16:45:00"),
      status: "success",
    },
    {
      id: "5",
      type: "payment",
      description: "Payment verification pending for Dr. Lisa Thompson",
      timestamp: new Date("2024-01-17T14:20:00"),
      status: "pending",
    },
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats(mockStats)
      setRecentActivity(mockActivity)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "user_signup":
        return UserPlus
      case "course_enrollment":
        return BookOpen
      case "payment":
        return CreditCard
      case "email_sent":
        return Mail
      default:
        return Activity
    }
  }

  const getStatusIcon = (status: RecentActivity["status"]) => {
    switch (status) {
      case "success":
        return CheckCircle
      case "pending":
        return Clock
      case "error":
        return AlertCircle
      default:
        return Activity
    }
  }

  const getStatusColor = (status: RecentActivity["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="grid gap-4 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of your RadiologyLMS platform</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={()=>ShowToast('Comming Soon', "This feature is under development")}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={()=>ShowToast('Comming Soon', "This feature is under development")}>
              <BarChart3 className="h-4 w-4 mr-2"/>
              View Reports
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Across all specialties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemHealth}%</div>
                <Progress value={stats.systemHealth} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Marketing
              </CardTitle>
              <CardDescription>Manage email campaigns and communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Active Campaigns</span>
                  <Badge>{stats.emailCampaigns}</Badge>
                </div>
                <Link href="/admin/marketing">
                  <Button className="w-full">
                    Manage Campaigns
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Management
              </CardTitle>
              <CardDescription>Track payments and user permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Pending Payments</span>
                  <Badge variant="secondary">{stats.pendingPayments}</Badge>
                </div>
                <Link href="/admin/payments">
                  <Button className="w-full">
                    View Payments
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                User Management
              </CardTitle>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">New Users Today</span>
                  <Badge variant="default">12</Badge>
                </div>
                {/* <Link href="/admin/users"> */}
                  <Button className="w-full" onClick={()=>ShowToast('Comming Soon', "This feature is under development")}>
                    Manage Users
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                {/* </Link> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type)
                const StatusIcon = getStatusIcon(activity.status)
                const statusColor = getStatusColor(activity.status)

                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted">
                    <div className="flex-shrink-0">
                      <ActivityIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp.toLocaleString()}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full bg-transparent" onClick={()=>ShowToast('Comming Soon', "This feature is under development")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
