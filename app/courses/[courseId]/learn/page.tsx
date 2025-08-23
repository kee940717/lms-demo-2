"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Settings,
    Maximize,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    MessageSquare,
    FileText,
    Clock,
    CheckCircle,
    PlayCircle,
    Brain,
    Menu,
    X,
    ChevronDown,
    ChevronUp,
    User2,
    Clock1,
    ThumbsUp,
    PlusCircle,
    ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { InteractiveQuiz } from "@/components/interactive-quiz"
import ReactPlayer from 'react-player';
import CourseSideBar from "./components/course-side-bar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShowToast } from "@/components/loading_notification/ShowToast"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"


// Mock API data based on the provided JSON structure
const mockCourseData = {
    data: {
        active: 1,
        bio: "Dr. Lee is a board-certified neuroradiologist with over 15 years of experience in advanced neuroimaging. She has published over 100 peer-reviewed articles and is a recognized expert in functional MRI and diffusion tensor imaging.",
        category_description: "Courses covering imaging of the head and neck, including sinuses, orbits, and soft tissues.",
        category_id: 1,
        category_name: "Head and Neck",
        course_id: 1,
        created_at: "Sat, 12 Jul 2025 05:29:48 GMT",
        creator: "1",
        degree: "MD",
        description:
            "Learn the basics of CT and MRI for head and neck anatomy, focusing on normal structures and common pathologies.",
        first_name: "Lee",
        last_name: "Zhi Wei",
        level: "Beginner",
        modules: [
            {
                courseId: 1,
                createdAt: "Sat, 12 Jul 2025 05:32:12 GMT",
                description: "Introduction to key anatomical structures in head and neck imaging using CT and MRI.",
                id: 1,
                lessons: [
                    {
                        content: "1.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 10,
                        isRequired: false,
                        moduleId: 1,
                        order: 1,
                        preview: true,
                        title: "Mapping the Head and Neck: Key Anatomical Landmarks",
                        type: "video",
                    },
                    {
                        content: "quiz-1",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 11,
                        isRequired: false,
                        moduleId: 1,
                        order: 2,
                        preview: true,
                        title: "Identify the Structures: CT and MRI Anatomy Challenge",
                        type: "quiz",
                    },
                    {
                        content: "2.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 12,
                        isRequired: false,
                        moduleId: 1,
                        order: 3,
                        preview: true,
                        title: "Exploring the Skull Base: Bones and Foramina",
                        type: "video",
                    },
                    {
                        content: "quiz-1",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 13,
                        isRequired: false,
                        moduleId: 1,
                        order: 4,
                        preview: true,
                        title: "Match the Muscle: Head and Neck Muscle Anatomy",
                        type: "quiz",
                    },
                    {
                        content: "3.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 14,
                        isRequired: false,
                        moduleId: 1,
                        order: 5,
                        preview: true,
                        title: "Neurovascular Pathways: Cranial Nerves and Vessels",
                        type: "video",
                    },
                ],
                order: 1,
                title: "Overview of Head and Neck Anatomy",
                updatedAt: "Sat, 12 Jul 2025 05:32:12 GMT",
            },
            {
                courseId: 1,
                createdAt: "Sat, 12 Jul 2025 05:32:12 GMT",
                description: "Detailed guide on CT protocols for head and neck imaging, including contrast use.",
                id: 2,
                lessons: [
                    {
                        content: "4.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 15,
                        isRequired: false,
                        moduleId: 2,
                        order: 1,
                        preview: true,
                        title: "Mastering CT Protocols for Head and Neck Imaging",
                        type: "video",
                    },
                    {
                        content: "quiz-1",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 16,
                        isRequired: false,
                        moduleId: 2,
                        order: 2,
                        preview: true,
                        title: "Contrast or Non-Contrast? CT Protocol Decision-Making",
                        type: "quiz",
                    },
                    {
                        content: "5.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 17,
                        isRequired: false,
                        moduleId: 2,
                        order: 3,
                        preview: true,
                        title: "Optimizing CT Scans: Tips for Clear Head and Neck Images",
                        type: "video",
                    },
                    {
                        content: "quiz-1",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 18,
                        isRequired: false,
                        moduleId: 2,
                        order: 4,
                        preview: true,
                        title: "CT Settings Showdown: Parameters for Head and Neck Scans",
                        type: "quiz",
                    },
                    {
                        content: "6.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluttate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 19,
                        isRequired: false,
                        moduleId: 2,
                        order: 5,
                        preview: true,
                        title: "Contrast Administration: Best Practices for Head and Neck CT",
                        type: "video",
                    },
                ],
                order: 2,
                title: "CT Imaging Techniques for Head and Neck",
                updatedAt: "Sat, 12 Jul 2025 05:32:12 GMT",
            },
            {
                courseId: 1,
                createdAt: "Sat, 12 Jul 2025 05:32:12 GMT",
                description: "Video case studies on common pathologies like sinusitis and lymph node enlargement.",
                id: 3,
                lessons: [
                    {
                        content: "7.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 20,
                        isRequired: false,
                        moduleId: 3,
                        order: 1,
                        preview: true,
                        title: "Case Study: Diagnosing Sinusitis on CT and MRI",
                        type: "video",
                    },
                    {
                        content: "quiz-1",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 21,
                        isRequired: false,
                        moduleId: 3,
                        order: 2,
                        preview: true,
                        title: "Spot the Pathology: Sinusitis Imaging Challenge",
                        type: "quiz",
                    },
                    {
                        content: "8.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 22,
                        isRequired: false,
                        moduleId: 3,
                        order: 3,
                        preview: true,
                        title: "Lymph Node Enlargement: Imaging Features and Differential Diagnosis",
                        type: "video",
                    },
                    {
                        content: "quiz-1",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 23,
                        isRequired: false,
                        moduleId: 3,
                        order: 4,
                        preview: true,
                        title: "Pathology Puzzle: Identifying Head and Neck Abnormalities",
                        type: "quiz",
                    },
                    {
                        content: "9.mp4",
                        description:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                        duration: 1.0,
                        id: 24,
                        isRequired: false,
                        moduleId: 3,
                        order: 5,
                        preview: true,
                        title: "Common Tumors and Cysts in Head and Neck Imaging",
                        type: "video",
                    },
                ],
                order: 3,
                title: "Common Pathologies in Head and Neck",
                updatedAt: "Sat, 12 Jul 2025 05:32:12 GMT",
            },
            {
                courseId: 1,
                createdAt: "Sat, 12 Jul 2025 05:32:12 GMT",
                description: "Test your knowledge of head and neck anatomy and imaging findings.",
                id: 4,
                lessons: [],
                order: 4,
                title: "Head and Neck Imaging Quiz",
                updatedAt: "Sat, 12 Jul 2025 05:32:12 GMT",
            },
        ],
        participation_count: 1,
        status: "published",
        title: "Introduction to Head and Neck Imaging",
        updated_at: "Sun, 13 Jul 2025 04:45:34 GMT",
    },
}

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

interface Module {
    courseId: number
    createdAt: string
    description: string
    id: number
    lessons: Lesson[]
    order: number
    title: string
    updatedAt: string
}

interface QuestionReply {
    id: string; 
    user : any
    timestamp: string; 
    content: string; 
    likes : number
}

interface Question {
    id: string; 
    user : any
    timestamp: string; 
    question: string; 
    reply : QuestionReply[]
}


export default function CourseLearnPage({ params }: { params: { courseId: string } }) {
    const [courseData, setCourseData] = useState(mockCourseData.data)
    const [currentLessonId, setCurrentLessonId] = useState<number>(10) // Start with first lesson
    const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set([]))
    const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1])) // First module expanded by default
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState("00:00")
    const [totalTime, setTotalTime] = useState("15:30")
    const [volume, setVolume] = useState(80)
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [newNote, setNewNote] = useState("")
    const [notes, setNotes] = useState<Array<{ id: number; timestamp: string; content: string; lessonId: number }>>([])
    const [questionContent, setQuestionContent] = useState<string>('')
    const [questionReply, setQuestionReply] = useState<string>('')
    const [questionList, setQuestionList] = useState<Question[]>([])
    const [openAddQuestionDialog, setOpenAddQuestionDialog] = useState<boolean>(false);

    // Get all lessons in order
    const getAllLessons = (): (Lesson & { moduleTitle: string })[] => {
        const allLessons: (Lesson & { moduleTitle: string })[] = []
        courseData.modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
                if (lesson.id !== null) {
                    allLessons.push({ ...lesson, moduleTitle: module.title })
                }
            })
        })
        return allLessons.sort((a, b) => (a.order || 0) - (b.order || 0))
    }

    const allLessons = getAllLessons()
    const currentLessonIndex = allLessons.findIndex((lesson) => lesson.id === currentLessonId)
    const currentLesson = allLessons[currentLessonIndex]

    // Calculate progress
    const totalLessons = allLessons.length
    const completedCount = completedLessons.size
    const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

    const formatDuration = (duration: number | null): string => {
        if (!duration) return "0 min"
        const hours = Math.floor(duration)
        const minutes = Math.round((duration - hours) * 60)
        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${Math.round(duration * 60)} min`
    }

    const toggleModuleExpansion = (moduleId: number) => {
        const newExpanded = new Set(expandedModules)
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId)
        } else {
            newExpanded.add(moduleId)
        }
        setExpandedModules(newExpanded)
    }

    const navigateToLesson = (lessonId: number) => {
        setCurrentLessonId(lessonId)
        // Mark previous lesson as completed when navigating
        if (currentLessonId && currentLessonId !== lessonId) {
            setCompletedLessons((prev) => new Set([...prev, currentLessonId]))
        }
    }

    const goToNextLesson = () => {
        if (currentLessonIndex < allLessons.length - 1) {
            const nextLesson = allLessons[currentLessonIndex + 1]
            navigateToLesson(nextLesson.id!)
        }
    }

    const goToPreviousLesson = () => {
        if (currentLessonIndex > 0) {
            const prevLesson = allLessons[currentLessonIndex - 1]
            navigateToLesson(prevLesson.id!)
        }
    }

    const markLessonComplete = () => {
        if (currentLessonId) {
            setCompletedLessons((prev) => new Set([...prev, currentLessonId]))
        }
    }

    const addNote = () => {
        if (newNote.trim() && currentLessonId) {
            const note = {
                id: Date.now(),
                user : "user1",
                timestamp: currentTime,
                content: newNote.trim(),
                lessonId: currentLessonId,
            }
            setNotes((prev) => [...prev, note])
            setNewNote("")
        }
    }

    const handle_ask_question = () => {
        const id = questionList.length
        const newQuestion : Question = {
            id: crypto.randomUUID(), 
            user : "user1",
            timestamp: new Date().toString(), 
            question: questionContent, 
            reply : []
        }
        questionList.push(newQuestion);
        setQuestionList([
            ...questionList,
        ])
        setQuestionContent('')
        setOpenAddQuestionDialog(false)
    }

    const handle_reply_question = (questionID: any) => {
        const questionSelectedForReply = questionList.find((item) => item.id === questionID);
        const answerID = questionSelectedForReply ? questionSelectedForReply.reply.length : 'NA';
        if (!questionSelectedForReply || answerID=='NA') {
            ShowToast("error", "Error")
            return
        }

        const newReply : QuestionReply = {
            id: crypto.randomUUID(), 
            user : "user1",
            timestamp: new Date().toString(), 
            content : questionReply,
            likes : 0
        }
        questionSelectedForReply.reply.push(newReply)
        setQuestionReply('')
        setQuestionList([
            ...questionList,
        ])
    }
    
    const handle_like_on_answer = (questionID: any, answerID : any) => {
        const questionSelectedForReply = questionList.find((item) => item.id === questionID);
        const answerSelected : any = questionSelectedForReply ? questionSelectedForReply.reply.find((item) => item.id === answerID): {};

        if (!questionSelectedForReply || !answerSelected) {
            ShowToast("error", "Error")
            return
        }

        // add to like value
        answerSelected.likes = answerSelected.likes == 0 ? 1 : 0
        setQuestionList([
            ...questionList,
        ])
    }

    const getCurrentLessonNotes = () => {
        return notes.filter((note) => note.lessonId === currentLessonId)
    }

    

    if (!currentLesson) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Lesson not found</h2>
                    <Link href={`/courses/${params.courseId}`}>
                        <Button>Back to Course</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
                {/* Sidebar */}
                {courseData && (
                    <CourseSideBar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        courseData={courseData}
                        progressPercentage={progressPercentage}
                        completedCount={completedCount}
                        totalLessons={totalLessons}
                        toggleModuleExpansion={toggleModuleExpansion}
                        expandedModules={expandedModules}
                        navigateToLesson={navigateToLesson}
                        completedLessons={completedLessons}
                        currentLessonId={currentLessonId}
                    />
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 border-b p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {!sidebarOpen && (
                                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                )}
                                <div>
                                    <h1 className="font-semibold">{currentLesson.title}</h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>{currentLesson.moduleTitle}</span>
                                        <span>•</span>
                                        <span>
                                            Lesson {currentLessonIndex + 1} of {totalLessons}
                                        </span>
                                        <span>•</span>
                                        <Badge variant="outline" className="capitalize">
                                            {currentLesson.type}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={goToPreviousLesson} disabled={currentLessonIndex === 0}>
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={markLessonComplete}
                                    disabled={completedLessons.has(currentLessonId)}
                                >
                                    {completedLessons.has(currentLessonId) ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Completed
                                        </>
                                    ) : (
                                        "Mark Complete"
                                    )}
                                </Button>
                                <Button size="sm" onClick={goToNextLesson} disabled={currentLessonIndex === allLessons.length - 1}>
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    

                    {/* Content Area */}
                    {currentLesson.type === "video" ? (
                        <>
                            {/* Video Player */}
                            <div className="p-4">
                                <ReactPlayer
                                    src={`/${currentLesson.content}`}
                                    controls={true}
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                            {/* Content Tabs */}
                            <div className="flex-1 bg-white dark:bg-gray-800 mt-2">
                                <Tabs defaultValue="overview" className="h-full mb-4">
                                    <div className="border-b px-4">
                                        <TabsList className="grid w-full grid-cols-4 max-w-md mb-2">
                                            <TabsTrigger value="overview">Overview</TabsTrigger>
                                            <TabsTrigger value="notes">Notes</TabsTrigger>
                                            <TabsTrigger value="transcript">Transcript</TabsTrigger>
                                            <TabsTrigger value="qa">Q&A</TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <TabsContent value="overview" className="p-4 space-y-4 ">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <BookOpen className="h-5 w-5" />
                                                    Lesson Overview
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2">Description</h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{currentLesson.description}</p>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2">Lesson Details</h4>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-muted-foreground">Duration:</span>
                                                            <span className="ml-2 font-medium">{formatDuration(currentLesson.duration)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Type:</span>
                                                            <span className="ml-2 font-medium capitalize">{currentLesson.type}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Module:</span>
                                                            <span className="ml-2 font-medium">{currentLesson.moduleTitle}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Required:</span>
                                                            <span className="ml-2 font-medium">{currentLesson.isRequired ? "Yes" : "No"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="notes" className="p-4 space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5" />
                                                    My Notes
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {/* Add New Note */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>Current time: {currentTime}</span>
                                                    </div>
                                                    <Textarea
                                                        placeholder="Add a note at current timestamp..."
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        className="min-h-[80px]"
                                                    />
                                                    <Button onClick={addNote} size="sm" disabled={!newNote.trim()}>
                                                        Add Note
                                                    </Button>
                                                </div>

                                                <div className="border-t pt-4">
                                                    <h4 className="font-medium mb-3">Saved Notes</h4>
                                                    <div className="space-y-3">
                                                        {getCurrentLessonNotes().map((note) => (
                                                            <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {note.timestamp}
                                                                    </Badge>
                                                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                                                        Jump to time
                                                                    </Button>
                                                                </div>
                                                                <p className="text-sm">{note.content}</p>
                                                            </div>
                                                        ))}
                                                        {getCurrentLessonNotes().length === 0 && (
                                                            <p className="text-sm text-muted-foreground text-center py-4">
                                                                No notes for this lesson yet.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="transcript" className="p-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5" />
                                                    Video Transcript
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ScrollArea className="h-96">
                                                    <div className="space-y-2 text-sm leading-relaxed">
                                                        <p className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer">
                                                            [00:00] Welcome to this lesson on {currentLesson.title}.
                                                        </p>
                                                        <p className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer">
                                                            [00:30] In this comprehensive overview, we'll explore the key concepts and practical
                                                            applications.
                                                        </p>
                                                        <p className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer">
                                                            [01:15] {currentLesson.description}
                                                        </p>
                                                        <p className="hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded cursor-pointer">
                                                            [02:00] Let's begin with the fundamental principles that will guide our understanding...
                                                        </p>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="qa" className="p-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <MessageSquare className="h-5 w-5" />
                                                    Questions & Answers 
                                                    {questionList.length > 0 && (
                                                        <PlusCircle onClick={()=>setOpenAddQuestionDialog(true)} className="ml-2"/>
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-center py-8 text-muted-foreground">
                                                    {questionList.length > 0 ? (
                                                        <>
                                                            <Accordion type="single" collapsible className="w-full">
                                                                {questionList.map((item: Question, idx: number) => (
                                                                    <AccordionItem key={item.id} value={item.id} className="border-b">
                                                                    <AccordionTrigger className="flex items-center justify-between p-4 font-medium text-left hover:bg-gray-50 transition-colors">
                                                                        <div>
                                                                            <span className="flex-1">
                                                                            <span className="font-semibold mr-2 text-primary">Q{idx + 1}.</span>
                                                                                {item.question} haha
                                                                            </span>
                                                                        </div>
                                                                    </AccordionTrigger>
                                                                    <div className="flex items-center justify-between space-x-4 m-4 mt-0 text-xs text-gray-500 bg-gray-50/50">
                                                                        <span className="flex items-center space-x-1">
                                                                            <MessageSquare className="w-4 h-4 text-gray-400" />
                                                                            <span>{item.reply.length}</span>
                                                                        </span>
                                                                        <span className="flex items-center space-x-1">
                                                                            <User2 className="w-4 h-4 text-gray-400" />
                                                                            <span>{item.user}</span>
                                                                        </span>
                                                                        <span className="flex items-center space-x-1">
                                                                            <Clock1 className="w-4 h-4 text-gray-400" />
                                                                            <span>{item.timestamp}</span>
                                                                        </span>
                                                                    </div>
                                                                    <AccordionContent className="p-4 bg-gray-50/50">
                                                                        <div className="mb-4 space-y-2">
                                                                            {item.reply.length > 0 ? (
                                                                                    item.reply.map((answer: QuestionReply, i: number) => (
                                                                                    <div
                                                                                        key={answer.id}
                                                                                        className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                                                                    >
                                                                                        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                                                            <div className="flex items-center space-x-2">
                                                                                           <span className="flex items-center space-x-1">
                                                                                                <User2 className="w-4 h-4 text-gray-400" />
                                                                                                <span>{answer.user}</span>
                                                                                            </span>
                                                                                            <span className="flex items-center space-x-1">
                                                                                                <Clock1 className="w-4 h-4 text-gray-400" />
                                                                                                <span>{answer.timestamp}</span>
                                                                                            </span>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-1">
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="sm"
                                                                                                    className="h-6 px-2 text-xs bg-blue-100"
                                                                                                    onClick={() => handle_like_on_answer(item.id, answer.id)}
                                                                                                >
                                                                                                    {answer.likes == 0 ? "Like" : 'Unlike'} 
                                                                                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                                                                                    <span className="text-gray-500 dark:text-gray-400">
                                                                                                        {answer.likes}
                                                                                                    </span>
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex justify-start">
                                                                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                                                                {answer.content}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <p className="text-sm text-gray-500 italic">No replies yet.</p>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-end space-x-2 mt-4">
                                                                            <Textarea 
                                                                                placeholder="Type your reply here..." 
                                                                                className="flex-1 resize-none" 
                                                                                onChange={(e)=>setQuestionReply(e.target.value)}
                                                                                value={questionReply}
                                                                            />
                                                                            <Button onClick={()=>handle_reply_question(item.id)}>Reply</Button>
                                                                        </div>
                                                                    </AccordionContent>
                                                                    </AccordionItem>
                                                                ))}
                                                                </Accordion>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                            <p>No questions yet for this lesson.</p>
                                                            <p className="text-sm">Be the first to ask a question!</p>
                                                            <Button className="mt-4" size="sm" onClick={()=>setOpenAddQuestionDialog(true)}>
                                                                Ask Question
                                                            </Button>
                                                        </>
                                                    )}

                                                    <Dialog open={openAddQuestionDialog} onOpenChange={()=>setOpenAddQuestionDialog(false)}>
                                                        <DialogContent>
                                                            <DialogTitle>Add new question:</DialogTitle>
                                                            <div className="mt-2">
                                                                <div className="flex items-center justify-center m-2">
                                                                    <Textarea
                                                                        placeholder="Type your question here..." 
                                                                        className="w-full"
                                                                        value={questionContent}
                                                                        onChange={(e)=>setQuestionContent(e.target.value)}
                                                                    />
                                                                </div>
                                                                <Button className="mt-4 w-full" size="sm" onClick={()=>handle_ask_question()} disabled={!questionContent}>
                                                                    Ask Question
                                                                </Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </>
                    ) : currentLesson.type === "quiz" ? (
                        <div className="flex-1 bg-white dark:bg-gray-800 p-8">
                            
                            <div className="w-full mx-auto">
                                <Card>
                                    <CardHeader className="text-center">
                                        <CardTitle className="flex items-center justify-center gap-2">
                                            <FileText className="h-6 w-6" />
                                            {currentLesson.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <InteractiveQuiz />
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white dark:bg-gray-800 p-8">
                            <div className="max-w-4xl mx-auto">
                                <Card>
                                    <CardHeader className="text-center">
                                        <CardTitle>{currentLesson.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center py-12">
                                        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                        <p className="text-muted-foreground">{currentLesson.description || "Content not available"}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    <Button className="mb-4 ml-4 mr-4" onClick={()=>history.back()}>
                        <ArrowLeft/> Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}
