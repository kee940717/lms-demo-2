import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    BookOpen,
    Clock,
    Users,
    Star,
    Search,
    Play,
    Award,
    Eye,
    Brain,
    CircleDot,
    Bone,
    Stethoscope,
    Activity,
    Zap,
    AirVent,
    Circle,
    HeartPulse,
    Baby,
    User,
    HeadingIcon,
} from "lucide-react"
import Link from "next/link"


const allCourses = [
    {
        id: "1",
        title: "Advanced MRI Brain Interpretation",
        instructor: "Dr. Sarah Chen, MD",
        instructorTitle: "Neuroradiologist, Johns Hopkins",
        duration: "12 hours",
        students: 1247,
        rating: 4.8,
        reviewCount: 342,
        price: 299,
        originalPrice: 399,
        category_name: "neuroradiology",
        category: "neuroradiology",
        level: "Advanced",
        thumbnail: "/placeholder.svg?height=200&width=300",
        description:
            "Master advanced MRI brain interpretation techniques including diffusion, perfusion, and spectroscopy.",
        learningObjectives: [
            "Interpret complex brain MRI sequences",
            "Recognize pathological patterns in neuroimaging",
            "Apply advanced MRI techniques in clinical practice",
        ],
        cmeCredits: 12,
        featured: true,
        bestseller: true,
    },
]

const radiologyCategories = [
    {
        id: "head-and-neck",
        name: "Head and Neck",
        icon: HeadingIcon,
        color: "bg-purple-100 text-purple-700",
    },
    {
        id: "brain-and-cns",
        name: "Brain",
        icon: Brain,
        color: "bg-blue-100 text-blue-700",
    },
    {
        id: "chest-and-thorax",
        name: "Chest and Thorax",
        icon: AirVent,
        color: "bg-red-100 text-red-700",
    },
    {
        id: "abdomen",
        name: "Abdomen",
        icon: Stethoscope,
        color: "bg-green-100 text-green-700",
    },
    {
        id: "musculoskeletal-system",
        name: "Musculoskeletal System",
        icon: Bone,
        color: "bg-orange-100 text-orange-700",
    },
    {
        id: "pelvis",
        name: "Pelvis",
        icon: CircleDot,
        color: "bg-teal-100 text-teal-700",
    },
    {
        id: "breast",
        name: "Breast",
        icon: Circle,
        color: "bg-pink-100 text-pink-700",
    },
    {
        id: "vascular-system",
        name: "Vascular System",
        icon: HeartPulse,
        color: "bg-red-200 text-red-800",
    },
    {
        id: "pediatric-specific-imaging",
        name: "Pediatric-Specific Imaging",
        icon: Baby,
        color: "bg-yellow-100 text-yellow-700",
    },
    {
        id: "whole-body-imaging",
        name: "Whole-Body Imaging",
        icon: User,
        color: "bg-gray-100 text-gray-700",
    },
];

function CourseCard({ course }: { course: (typeof allCourses)[0] }) {
    const categoryInfo = radiologyCategories.find((cat) => cat.id === course.category)
    const Icon = categoryInfo?.icon || BookOpen

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                    <Icon className="h-16 w-16 text-blue-600 opacity-60" />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {course.featured && <Badge className="bg-purple-600 hover:bg-purple-700">Featured</Badge>}
                    {course.bestseller && <Badge className="bg-orange-600 hover:bg-orange-700">Bestseller</Badge>}
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Play className="h-6 w-6 text-gray-900 ml-1" />
                        </div>
                    </div>
                </div>
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className={radiologyCategories.find((cat) => cat.name === course.category_name)!.color}>
                        {course.category_name}
                    </Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                </div>

                <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                </CardTitle>

                <CardDescription className="line-clamp-2">{course.description}</CardDescription>

                <div className="text-sm text-muted-foreground">by {course.instructor}</div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Rating and Stats */}
                <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {/* <span className="font-medium">{course.rating}</span>
                        <span className="text-muted-foreground">({course.reviewCount})</span> */}
                        <span>Coming Soon!</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {course.students.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Link href={`/courses/${course.id}`}>
                    <Button className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Course
                    </Button>
                </Link>
            </CardContent>
        </Card>
    )
}


export default CourseCard;