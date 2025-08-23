import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CourseCard from "./CourseCard"
import axios from "axios"
import { useEffect, useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import CourseFilterDrawer from "./course-filter-drawer"
import { LoadingSkeleton } from "@/components/loading_notification/loading-skeleton"


interface ComponentProps {
    userDetails: any
}
function CoursesContainer({ userDetails }: ComponentProps) {

    const [courses, setCourses] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tabSelected, setTabSelected] = useState<string>('all')
    const [openFilter, setOpenFilter] = useState<boolean>(false);


    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_PATH +'get-all-courses', {
                    user_id: userDetails.id, 
                    feature_course : tabSelected == 'featured',
                    new_release : tabSelected == 'new'
                });
                console.log('Success:', response.data);
                setCourses(response.data.data)
                setIsLoading(false)
            } catch (error: any) {
                console.error('Error:', error.response?.data || error.message);
            }
        }
        if (userDetails && tabSelected) {
            loadData()
        }
    }, [userDetails, tabSelected])


    return (
        <div className="space-y-8">
            {/* Header */}


            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold">Radiology Education Courses</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Advance your radiology expertise with courses designed by leading radiologists from top medical institutions
                </p>
            </div>

            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    className="rounded-full w-14 h-14 shadow-lg"
                    onClick={()=>setOpenFilter(!openFilter)}
                >
                    <Filter/>
                </Button>
            </div>

            <CourseFilterDrawer 
                openDrawer={openFilter}
                setOpenDrawer={setOpenFilter}
                setCourses={setCourses}
                userDetails={userDetails}
                tabSelected={tabSelected}
            />


            {/* Course Sections */}
            <Tabs className="space-y-6" value={tabSelected} onValueChange={(e)=>setTabSelected(e)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Courses</TabsTrigger>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="new">New Releases</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    {isLoading ? <LoadingSkeleton/> : (
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">All Courses ({courses.length})</h2>
                            <div className="text-sm text-muted-foreground">Showing {courses.length} results</div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="featured" className="space-y-6">
                    {isLoading ? <LoadingSkeleton/> : (
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">Featured Courses</h2>
                            <div className="text-sm text-muted-foreground">More courses to come!</div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="new" className="space-y-6">
                    {isLoading ? <LoadingSkeleton/> : (
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold">New Releases</h2>
                            <div className="text-sm text-muted-foreground">Latest courses added this month</div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {isLoading ? <LoadingSkeleton/> : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course : any) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
                
        </div>
    )
}

export default CoursesContainer;
