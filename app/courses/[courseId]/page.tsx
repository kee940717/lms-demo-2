'use client';
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    BookOpen,
    Clock,
    Users,
    Star,
    Play,
    Award,
    Download,
    Share2,
    Heart,
    CheckCircle,
    PlayCircle,
    FileText,
    Brain,
    Calendar,
    Globe,
    Shield,
    ListStartIcon,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShowToast } from "@/components/loading_notification/ShowToast";



export default function CourseDetailPage() {
    const params = useParams()
    const courseId = params.courseId as string
    const [courseData, setCourseData] = useState<any>('')
    const [loading, setLoading] = useState<boolean>(true);
    const [enrolled, setEnrolled] = useState<boolean>(false);
    const [wishlisted, setWishlisted] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<any>("");

    useEffect(() => {
        const loadCourse = async () => {
            try {
                //TODO: To add UserDetails
                const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_PATH +'get-course-preview', {
                    user_id: "1",
                    course_id: params.courseId,
                });
                console.log('Success:', response.data);
                setCourseData(response.data.data)
                setLoading(false)
            } catch (error: any) {
                console.error('Error:', error.response?.data || error.message);
            }
        }
        if (loading) {
            loadCourse()
        }
    }, [loading])


    const handle_course_enrolled = async () =>{
        setEnrolled(true);
        ShowToast('success', "You have enrolled the course")
    }


    const handle_wishlist_course = async () =>{
        setWishlisted(!wishlisted);
    }

    const handle_share = async () =>{
        const recipient = 'testing@gmail.com';
        const subject = `${courseData.category} - ${courseData.title} (Invitation Link)`;
        const body = encodeURIComponent(
            `Please refer to below for the URL :\n${window.location.href}\n\n`
        )
        const mailToLink = `mailto:${recipient}?subject=${subject}&body=${body}`
        window.open(mailToLink)
    }

    const handle_click_report = async (reviewID : any) =>{
        const reviewSelected = courseData.reviews.find ((item : any) =>(item.id === reviewID))
        reviewSelected['report'] = 1
        setCourseData({
            ...courseData
        })
    }

    const handle_click_helpful = async (reviewID : any) =>{
        const reviewSelected = courseData.reviews.find ((item : any) =>(item.id === reviewID))
        reviewSelected.helpful= reviewSelected.helpful +  1
        setCourseData({
            ...courseData
        })
    }

    return (
        <DashboardLayout setUserDetails={setUserDetails}>
            {courseData && (
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <div className="bg-gray-900 text-white rounded-lg overflow-hidden">
                        <div className="grid lg:grid-cols-3 gap-8 p-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-purple-600">{courseData.category}</Badge>
                                        <Badge variant="outline" className="text-white border-white">
                                            {courseData.level}
                                        </Badge>
                                    </div>

                                    <h1 className="text-4xl font-bold leading-tight">{courseData.title}</h1>

                                    <p className="text-xl text-gray-300">{courseData.subtitle}</p>
                                </div>

                                {/* Course Stats */}
                                <div className="flex flex-wrap items-center gap-6 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-medium">{courseData.rating}</span>
                                        <span className="text-gray-300">({courseData.reviewCount} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{courseData.students.toLocaleString()} students</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{courseData.duration} total</span>
                                    </div>
                                    {/* <div className="flex items-center gap-1">
                                        <Award className="h-4 w-4" />
                                        <span>{courseData.cmeCredits} CME Credits</span>
                                    </div> */}
                                    <div className="flex items-center gap-1">
                                        <Globe className="h-4 w-4" />
                                        <span>{courseData.language}</span>
                                    </div>
                                </div>

                                {/* Instructor */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>SC</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">Created by {courseData.instructor.name}</div>
                                        <div className="text-gray-300 text-sm">{courseData.instructor.title}</div>
                                    </div>
                                </div>

                                {/* Course Features */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Last updated {courseData.lastUpdated}</span>
                                    </div>
                                    {courseData.certificate && (
                                        <div className="flex items-center gap-1">
                                            <Award className="h-4 w-4" />
                                            <span>Certificate of completion</span>
                                        </div>
                                    )}
                                    {courseData.downloadable && (
                                        <div className="flex items-center gap-1">
                                            <Download className="h-4 w-4" />
                                            <span>Downloadable resources</span>
                                        </div>
                                    )}
                                    {courseData.lifetime && (
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4" />
                                            <span>Lifetime access</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="lg:col-span-1">
                                <Card className="bg-white text-gray-900">
                                    <CardContent className="p-6 space-y-6">
                                        {/* Preview Video */}
                                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Play className="h-6 w-6 text-white ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                                                Preview
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        {/* <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-bold">${courseData.price}</span>
                                            <span className="text-xl text-gray-500 line-through">${courseData.originalPrice}</span>
                                            <Badge variant="destructive">{discount}% OFF</Badge>
                                        </div>
                                        <div className="text-sm text-red-600 font-medium">Limited time offer! Sale ends soon.</div>
                                    </div> */}

                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            {enrolled ? (
                                                <Link href={`/courses/${courseData.id}/learn`}>
                                                    <Button size="lg" className="w-full">
                                                        <ListStartIcon/> Start Learning
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button size="lg" className="w-full" onClick={()=>handle_course_enrolled()}>
                                                    Enroll Now
                                                </Button>
                                            )}
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="flex-1 bg-transparent" 
                                                    onClick={()=>handle_wishlist_course()}
                                                >
                                                    
                                                    {wishlisted ? (
                                                        <Heart className="h-4 w-4 mr-2" fill="red" color="red" />
                                                    ) : (
                                                        <Heart className="h-4 w-4 mr-2" /> 
                                                    )}
                                                    Wishlist
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={()=>handle_share()}>
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Share
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Course Includes */}
                                        <div className="space-y-3">
                                            <h4 className="font-medium">This course includes:</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <PlayCircle className="h-4 w-4" />
                                                    <span>{courseData.duration} on-demand video</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    <span>Downloadable resources</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Award className="h-4 w-4" />
                                                    <span>Certificate of completion</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4" />
                                                    <span>Lifetime access</span>
                                                </div>
                                                {/* <div className="flex items-center gap-2">
                                                    <Brain className="h-4 w-4" />
                                                    <span>{courseData.cmeCredits} CME Credits</span>
                                                </div> */}
                                            </div>
                                        </div>

                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Course Content Tabs */}
                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="instructor">Instructor</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8">
                            <div className="grid lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    {/* What You'll Learn */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>What you'll learn</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                {courseData.whatYouWillLearn.map((item : any, index : any) => (
                                                    <div key={index} className="flex items-start gap-2">
                                                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Requirements */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Requirements</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                {courseData.requirements.map((req : any, index : any) => (
                                                    <li key={index} className="flex items-start gap-2 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    {/* Course Description */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Course Description</CardTitle>
                                        </CardHeader>
                                        <CardContent className="prose prose-sm max-w-none">
                                            <p>
                                                This comprehensive course is designed for radiologists, neuroradiologists, and radiology residents
                                                who want to master advanced MRI brain interpretation techniques. Led by Dr. Sarah Chen, a renowned
                                                neuroradiologist from Johns Hopkins, this course covers the latest advances in neuroimaging.
                                            </p>
                                            <p>
                                                You'll learn to interpret complex MRI sequences including diffusion-weighted imaging (DWI),
                                                perfusion-weighted imaging (PWI), and magnetic resonance spectroscopy (MRS). The course combines
                                                theoretical knowledge with practical case studies to ensure you can apply these techniques in your
                                                daily practice.
                                            </p>
                                            <p>
                                                Each module includes high-quality video lectures, interactive case studies, and assessments to
                                                test your understanding. Upon completion, you'll receive 12 CME credits and a certificate of
                                                completion.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="lg:col-span-1">
                                    {/* Course Stats */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Course Statistics</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between">
                                                <span>Total Lessons</span>
                                                <span className="font-medium">{courseData.totalLessons}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Video Content</span>
                                                <span className="font-medium">{courseData.duration}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Skill Level</span>
                                                <span className="font-medium">{courseData.level}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Language</span>
                                                <span className="font-medium">{courseData.language}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>CME Credits</span>
                                                <span className="font-medium">{courseData.cmeCredits}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="curriculum" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">Course Curriculum</h2>
                                <div className="text-sm text-muted-foreground">
                                    {courseData.curriculum.length} modules • {courseData.totalLessons} lessons • {courseData.duration} total
                                </div>
                            </div>

                            <div className="space-y-4">
                                {courseData.curriculum.map((module : any, moduleIndex : any) => (
                                    <Card key={module.id}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg">
                                                    Module {moduleIndex + 1}: {module.title}
                                                </CardTitle>
                                                <div className="text-sm text-muted-foreground">
                                                    {module.lessons.length} lessons • {module.duration}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {module.lessons.map((lesson : any, lessonIndex : any) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-medium">
                                                                {lessonIndex + 1}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{lesson.title}</div>
                                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                                    {lesson.type === "video" && <PlayCircle className="h-4 w-4" />}
                                                                    {lesson.type === "quiz" && <FileText className="h-4 w-4" />}
                                                                    {lesson.type === "case" && <Brain className="h-4 w-4" />}
                                                                    <span className="capitalize">{lesson.type}</span>
                                                                    <span>•</span>
                                                                    <span>{lesson.duration}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {lesson.preview && 
                                                                <Link href={`/courses/${courseData.id}/learn`}>
                                                                    <Badge variant="outline">Preview</Badge>
                                                                </Link>
                                                            }
                                                            <Link href={`/courses/${courseData.id}/learn`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Play className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="instructor" className="space-y-6">
                            <Card>
                                <CardContent className="p-8">
                                    <div className="flex items-start gap-6">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={courseData.instructor.avatar || "/placeholder.svg"} />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-2xl font-bold">{courseData.instructor.name}</h2>
                                                <p className="text-lg text-muted-foreground">{courseData.instructor.title}</p>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">{courseData.instructor.rating} instructor rating</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{courseData.instructor.students.toLocaleString()} students</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-4 w-4" />
                                                    <span>{courseData.instructor.courses} courses</span>
                                                </div>
                                            </div>

                                            <p className="text-muted-foreground leading-relaxed">{courseData.instructor.bio}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reviews" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold">Student Reviews</h2>
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-bold">{courseData.rating}</span>
                                    <span className="text-muted-foreground">({courseData.reviewCount} reviews)</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {courseData.reviews.map((review : any) => (
                                    <Card key={review.id}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {review.user
                                                            .split(" ")
                                                            .map((n : any) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium">{review.user}</div>
                                                            <div className="text-sm text-muted-foreground">{review.title}</div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{review.date}</div>
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>

                                                    <p className="text-muted-foreground">{review.comment}</p>

                                                    <div className="flex items-center gap-4 text-sm">
                                                        <Button variant="ghost" size="sm" onClick={()=>handle_click_helpful(review.id)}>
                                                            Helpful ({review.helpful})
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={()=>handle_click_report(review.id)}>
                                                            Report ({review.report ? review.report : 0})
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}

        </DashboardLayout>
    )
}
