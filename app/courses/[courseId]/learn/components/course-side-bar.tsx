import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    X,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    PlayCircle,
    FileText,
    BookOpen,
} from "lucide-react"


interface Lesson {
    content: string | null
    description: string | null
    duration: number | null
    id: number | null
    isRequired: boolean
    moduleId: number
    order: number | null
    preview: boolean
    title: string | null
    type: string | null
}


interface ComponentProps {
    sidebarOpen : any;
    setSidebarOpen : (value : any) => void;
    courseData : any
    progressPercentage : any;
    completedCount : any;
    totalLessons : any;
    toggleModuleExpansion : (value : any) => void;
    expandedModules : any;
    navigateToLesson : (value : any) => void;
    completedLessons : any
    currentLessonId : any
}


function CourseSideBar ({
    sidebarOpen,
    setSidebarOpen,
    courseData,
    progressPercentage,
    completedCount,
    totalLessons,
    toggleModuleExpansion,
    expandedModules,
    navigateToLesson,
    completedLessons,
    currentLessonId,
 } : ComponentProps) {

    const formatDuration = (duration: number | null): string => {
        if (!duration) return "0 min"
        const hours = Math.floor(duration)
        const minutes = Math.round((duration - hours) * 60)
        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${Math.round(duration * 60)} min`
    }
    
    const getLessonIcon = (lesson: Lesson) => {
        if (completedLessons.has(lesson.id!)) {
            return <CheckCircle className="h-4 w-4 text-green-600" />
        }

        switch (lesson.type) {
            case "video":
                return <PlayCircle className="h-4 w-4 text-blue-600" />
            case "quiz":
                return <FileText className="h-4 w-4 text-purple-600" />
            default:
                return <BookOpen className="h-4 w-4 text-gray-600" />
        }
    }

    return(
        <div
            className={`
                ${sidebarOpen ? "w-80 overflow-x-auto" : "w-0"} 
                transition-all duration-300 bg-white dark:bg-gray-800 border-r sticky top-0 h-screen overflow-y-auto
            `}
        >
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold truncate">{courseData.title}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                        <span>Course Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                        {completedCount} of {totalLessons} lessons completed
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-2 h-[calc(100vh-150px)] overflow-y-auto">
                {courseData.modules.map((module : any) => (
                    <Card key={module.id} className="overflow-hidden">
                        <CardHeader
                            className="pb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => toggleModuleExpansion(module.id)}
                        >   
                            <div>
                                <Badge variant="outline" className="text-xs m-0">
                                    {module.lessons.filter((l : any) => l.id !== null).length} lessons
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                    {expandedModules.has(module.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{module.description}</div>
                        </CardHeader>

                        

                        {expandedModules.has(module.id) && (
                            <CardContent className="pt-0">
                                <div className="space-y-1">
                                    {module.lessons.map((lesson : any) => {
                                        if (!lesson.id || !lesson.title) return null

                                        const isCurrentLesson = lesson.id === currentLessonId
                                        const isCompleted = completedLessons.has(lesson.id)

                                        return (
                                            <div
                                                key={lesson.id}
                                                className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isCurrentLesson
                                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200"
                                                    : ""
                                                    }`}
                                                onClick={() => navigateToLesson(lesson.id!)}
                                            >
                                                <div className="flex-shrink-0">{getLessonIcon(lesson)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`truncate ${isCurrentLesson ? "font-medium" : ""}`} title={lesson.title}>
                                                        {lesson.title}
                                                        <div className="text-xs text-muted-foreground">
                                                            {formatDuration(lesson.duration)}
                                                            {lesson.type && (
                                                                <>
                                                                    {" • "}
                                                                    <span className="capitalize">{lesson.type}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isCurrentLesson && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
export default CourseSideBar