"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Download, Mail, MoreHorizontal, Users, TrendingUp, Clock, Award } from "lucide-react"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface CourseStudentsTabProps {
  courseId: string
}

// Mock student data
const mockStudents = [
  {
    id: "1",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@hospital.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledDate: "2024-01-15",
    progress: 78,
    lastActive: "2024-01-20",
    completedLessons: 12,
    totalLessons: 15,
    averageScore: 92,
    status: "active",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "m.chen@medcenter.org",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledDate: "2024-01-10",
    progress: 45,
    lastActive: "2024-01-19",
    completedLessons: 7,
    totalLessons: 15,
    averageScore: 88,
    status: "active",
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    email: "sarah.w@clinic.com",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledDate: "2024-01-08",
    progress: 100,
    lastActive: "2024-01-18",
    completedLessons: 15,
    totalLessons: 15,
    averageScore: 96,
    status: "completed",
  },
  {
    id: "4",
    name: "Dr. James Rodriguez",
    email: "j.rodriguez@university.edu",
    avatar: "/placeholder.svg?height=40&width=40",
    enrolledDate: "2024-01-12",
    progress: 23,
    lastActive: "2024-01-14",
    completedLessons: 3,
    totalLessons: 15,
    averageScore: 85,
    status: "inactive",
  },
]

export function CourseStudentsTab({ courseId }: CourseStudentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "all" || student.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  const stats = {
    totalStudents: mockStudents.length,
    activeStudents: mockStudents.filter((s) => s.status === "active").length,
    completedStudents: mockStudents.filter((s) => s.status === "completed").length,
    averageProgress: Math.round(mockStudents.reduce((sum, s) => sum + s.progress, 0) / mockStudents.length),
    averageScore: Math.round(mockStudents.reduce((sum, s) => sum + s.averageScore, 0) / mockStudents.length),
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Students Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enrolled Students</CardTitle>
              <CardDescription>Manage and track your students' progress</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm"  onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                <Mail className="h-4 w-4 mr-2" />
                Message All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Filter Badges */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Filter by:</span>
                {["all", "active", "completed", "inactive"].map((filter) => (
                  <Badge
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Badge>
                ))}
              </div>

              {/* Students Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{student.progress}%</span>
                              <span className="text-muted-foreground">
                                {student.completedLessons}/{student.totalLessons}
                              </span>
                            </div>
                            <Progress value={student.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{student.averageScore}%</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(student.lastActive).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "completed"
                                ? "default"
                                : student.status === "active"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Analytics</CardTitle>
                  <CardDescription>Detailed progress tracking for all students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Progress analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Engagement</CardTitle>
                  <CardDescription>Track student activity and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Engagement metrics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
