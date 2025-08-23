"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
    Save,
    Eye,
    ArrowLeft,
    Settings,
    BookOpen,
    Users,
    BarChart3,
    MessageSquare,
    CheckCircle,
    AlertCircle,
    Clock,
} from "lucide-react"
import { getCourseById, updateCourse, type Course } from "@/lib/courses"
import { CourseBasicsTab } from "@/app/faculty/course-edit/[courseId]/components/course-basics-tab"
import { CourseCurriculumTab } from "@/app/faculty/course-edit/[courseId]/components/course-curriculum-tab"
import { CourseSettingsTab } from "@/app/faculty/course-edit/[courseId]/components/course-settings-tab"
import { CourseStudentsTab } from "@/app/faculty/course-edit/[courseId]/components/course-students-tab"
import { CourseAnalyticsTab } from "@/app/faculty/course-edit/[courseId]/components/course-analytics-tab"
import { CourseMessagesTab } from "@/app/faculty/course-edit/[courseId]/components/course-messages-tab"
import axios from "axios"
import { ShowToast } from "@/components/loading_notification/ShowToast"


export default function CourseEditPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.courseId as string

    const [course, setCourse] = useState<Course | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null)
    const [activeTab, setActiveTab] = useState("basics")

    useEffect(() => {
        loadCourse()
    }, [courseId])


    const loadCourse = async () => {
        try {
            //TODO: To add UserDetails
            const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_PATH +'get-course-data', {
                user_id: "1",
                course_id: courseId,
            });
            console.log('Success:', response.data);
            setCourse(response.data.data)
            setIsLoading(false)
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
            setAlert({ type: "error", message: "Failed to load course" })
        }
    }


    const handleSaveCourse = async () => {
        ShowToast('Comming soon', "This feature is under development")
        return
        if (!course) return

        setIsSaving(true)
        try {
            const updatedCourse = await updateCourse(courseId, course)
            if (updatedCourse) {
                setCourse(updatedCourse)
                setHasUnsavedChanges(false)
                setAlert({ type: "success", message: "Course saved successfully!" })
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to save course" })
        } finally {
            setIsSaving(false)
        }
    }

    const handleCourseUpdate = (updates: Partial<Course>) => {
        if (course) {
            setCourse({ ...course, ...updates })
            setHasUnsavedChanges(true)
            console.log(course)
        }
    }

    const handlePublishCourse = async () => {
        if (!course) return

        const updatedCourse = { ...course, status: "published" as const }
        setIsSaving(true)
        try {
            const result = await updateCourse(courseId, updatedCourse)
            if (result) {
                setCourse(result)
                setAlert({ type: "success", message: "Course published successfully!" })
            }
        } catch (error) {
            setAlert({ type: "error", message: "Failed to publish course" })
        } finally {
            setIsSaving(false)
        }
    }

    const getCompletionStatus = () => {
        if (!course) return { completed: 0, total: 6 }

        let completed = 0
        const total = 6

        // Check basic info
        if (course.title && course.description && course.category) completed++

        // Check curriculum
        if (course.modules && course.modules.length > 0) completed++

        // Check pricing (assuming it's set)
        completed++

        // Check landing page
        if (course.thumbnail) completed++

        // Check messages setup
        completed++

        // Check captions/accessibility
        completed++

        return { completed, total }
    }

    const { completed, total } = getCompletionStatus()
    const completionPercentage = (completed / total) * 100

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Loading course...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!course) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
                    <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push("/faculty")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Courses
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" onClick={() => router.push("/faculty")}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Courses
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div>
                            <h1 className="text-2xl font-bold">{course.title}</h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
                                <span className="text-sm text-muted-foreground">
                                    {completed}/{total} sections completed
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => window.open(`/courses/${courseId}`, "_blank")}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                        <Button onClick={handleSaveCourse} disabled={isSaving || !hasUnsavedChanges}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                        {course.status === "draft" && (
                            <Button onClick={handlePublishCourse} disabled={isSaving || completionPercentage < 100}>
                                Publish Course
                            </Button>
                        )}
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <Alert variant={alert.type === "error" ? "destructive" : alert.type === "warning" ? "default" : "default"}>
                        {alert.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        <AlertDescription>{alert.message}</AlertDescription>
                    </Alert>
                )}

                {/* Unsaved Changes Warning */}
                {hasUnsavedChanges && (
                    <Alert variant="default" className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800 dark:text-orange-200">
                            You have unsaved changes. Don't forget to save your progress.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Progress Card */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Course Completion</CardTitle>
                                <CardDescription>Complete all sections to publish your course</CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
                                <div className="text-sm text-muted-foreground">Complete</div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Course Sections</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab("basics")}
                                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${activeTab === "basics" ? "bg-accent border-r-2 border-primary" : ""
                                            }`}
                                    >
                                        <BookOpen className="h-4 w-4 mr-3" />
                                        <span>Course Basics</span>
                                        <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("curriculum")}
                                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${activeTab === "curriculum" ? "bg-accent border-r-2 border-primary" : ""
                                            }`}
                                    >
                                        <BookOpen className="h-4 w-4 mr-3" />
                                        <span>Curriculum</span>
                                        {course.modules && course.modules.length > 0 ? (
                                            <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                        ) : (
                                            <div className="h-4 w-4 ml-auto border-2 border-gray-300 rounded-full" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("settings")}
                                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${activeTab === "settings" ? "bg-accent border-r-2 border-primary" : ""
                                            }`}
                                    >
                                        <Settings className="h-4 w-4 mr-3" />
                                        <span>Settings</span>
                                        <CheckCircle className="h-4 w-4 ml-auto text-green-600" />
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("students")}
                                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${activeTab === "students" ? "bg-accent border-r-2 border-primary" : ""
                                            }`}
                                    >
                                        <Users className="h-4 w-4 mr-3" />
                                        <span>Students</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("analytics")}
                                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${activeTab === "analytics" ? "bg-accent border-r-2 border-primary" : ""
                                            }`}
                                    >
                                        <BarChart3 className="h-4 w-4 mr-3" />
                                        <span>Analytics</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("messages")}
                                        className={`w-full flex items-center px-4 py-3 text-left hover:bg-accent transition-colors ${activeTab === "messages" ? "bg-accent border-r-2 border-primary" : ""
                                            }`}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-3" />
                                        <span>Messages</span>
                                    </button>
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === "basics" && <CourseBasicsTab course={course} onUpdate={handleCourseUpdate} />}
                        {activeTab === "curriculum" && <CourseCurriculumTab course={course} onUpdate={handleCourseUpdate} />}
                        {activeTab === "settings" && <CourseSettingsTab course={course} onUpdate={handleCourseUpdate} />}
                        {activeTab === "students" && <CourseStudentsTab courseId={courseId} />}
                        {activeTab === "analytics" && <CourseAnalyticsTab courseId={courseId} />}
                        {activeTab === "messages" && <CourseMessagesTab courseId={courseId} />}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
