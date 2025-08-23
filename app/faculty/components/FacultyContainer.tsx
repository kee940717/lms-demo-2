

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Plus, Users, Video, FileText, Calendar, BarChart3, Upload, Eye, Edit } from "lucide-react"
import { getCoursesByInstructor, createCourse, type Course } from "@/lib/courses"
import { createZoomMeeting, getZoomMeetings, type ZoomMeeting } from "@/lib/integrations"
import CreateCourseForm from "./CreateCourseForm"
import { useRouter } from "next/navigation"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface ComponentProps {
    userDetails: any
    instructorId: any
}


function FacultyContainer({ userDetails, instructorId }: ComponentProps) {

    const [courses, setCourses] = useState<Course[]>([])
    const [meetings, setMeetings] = useState<ZoomMeeting[]>([])
    const [reload, setReload] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateMeeting, setShowCreateMeeting] = useState(false)
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCreateMeeting = async (meetingData: any) => {
        try {
            const newMeeting = await createZoomMeeting({
                ...meetingData,
                hostId: instructorId,
            })
            setMeetings([...meetings, newMeeting])
            setShowCreateMeeting(false)
        } catch (error) {
            console.error("Failed to create meeting:", error)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log(userDetails)
                const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_PATH +'get-course-by-user', {
                    user_id: userDetails.id
                });
                console.log('Success:', response.data);
                setCourses(response.data.data)
            } catch (error: any) {
                console.error('Error:', error.response?.data || error.message);
            }
        }
        if (userDetails) {
            loadData()
        }
    }, [userDetails, reload])


    const handleRedirect = (path: any) => {
        router.push(path)
    }

    const stats = {
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.status === "published").length,
        draftCourses: courses.filter((c) => c.status === "draft").length,
        totalStudents: courses.reduce((sum, course) => sum + (course as any).enrolledStudents || 0, 0),
        upcomingMeetings: meetings.filter((m) => new Date(m.startTime) > new Date()).length,
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
                        <p className="text-muted-foreground">Create and manage your courses and content</p>
                    </div>
                    <div className="flex space-x-2">
                        <Dialog open={showCreateMeeting} onOpenChange={setShowCreateMeeting}>
                            {/* <DialogTrigger asChild> */}
                                <Button variant="outline" onClick={()=>ShowToast("Comming Soon", "This feature is under development")}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Meeting
                                </Button>
                            {/* </DialogTrigger> */}
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Schedule Zoom Meeting</DialogTitle>
                                    <DialogDescription>Create a live session for your course</DialogDescription>
                                </DialogHeader>
                                {/* <CreateMeetingForm onSubmit={handleCreateMeeting} courses={courses} /> */}
                            </DialogContent>
                        </Dialog>

                        <CreateCourseForm userDetails={userDetails} reload={reload} setReload={setReload} />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCourses}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.publishedCourses}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.draftCourses}</div>
                        </CardContent>
                    </Card>

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
                            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.upcomingMeetings}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="courses" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="courses">My Courses</TabsTrigger>
                        <TabsTrigger value="meetings">Live Sessions</TabsTrigger>
                        <TabsTrigger value="content">Content Library</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="courses" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map((course) => (
                                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
                                            <Badge variant="outline">{course.level}</Badge>
                                        </div>
                                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>{course.category}</span>
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button size="sm" className="flex-1" onClick={() => handleRedirect(`faculty/course-edit/${course.id}`)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleRedirect(`courses/${course.id}/learn`)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="meetings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Scheduled Live Sessions</CardTitle>
                                <CardDescription>Manage your Zoom meetings and live sessions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {meetings.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No meetings scheduled</p>
                                        <Button className="mt-4" onClick={()=>ShowToast("Comming Soon", "This feature is under development")}>
                                        {/* <Button className="mt-4" onClick={() => setShowCreateMeeting(true)}> */}
                                            Schedule Your First Meeting
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {meetings.map((meeting) => (
                                            <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <h3 className="font-medium">{meeting.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{meeting.description}</p>
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                                        <span>{new Date(meeting.startTime).toLocaleDateString()}</span>
                                                        <span>{new Date(meeting.startTime).toLocaleTimeString()}</span>
                                                        <span>{meeting.duration} minutes</span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" variant="outline">
                                                        Copy Link
                                                    </Button>
                                                    <Button size="sm">Start Meeting</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Library</CardTitle>
                                <CardDescription>Upload and manage your course materials</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                                    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                            <Video className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="font-medium mb-2">Upload Video</h3>
                                            <p className="text-sm text-muted-foreground">Add video lectures & demonstrations</p>
                                        </CardContent>
                                    </Card>
                                    </div>
                                    <div onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                                    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer min-h-[150px]">
                                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="font-medium mb-2">Upload PDF</h3>
                                            <p className="text-sm text-muted-foreground">Add reading materials and handouts</p>
                                        </CardContent>
                                    </Card>
                                    </div>

                                    <div onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                                    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                            <h3 className="font-medium mb-2">Other Files</h3>
                                            <p className="text-sm text-muted-foreground">Upload presentations and resources</p>
                                        </CardContent>
                                    </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Analytics</CardTitle>
                                <CardDescription>Track student engagement and course performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Analytics dashboard coming soon</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

export default FacultyContainer;