import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Search,
    Brain,
    CircleDot,
    Bone,
    Stethoscope,
    AirVent,
    Circle,
    HeartPulse,
    Baby,
    User,
    HeadingIcon,
    Loader2,
    XCircle,
} from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useEffect, useState } from "react"
import axios from "axios"
import CourseCategorySelection from "@/components/form-components/course-category-selection"


const radiologyCategories = [
  {
    id: 1,
    name: "Head and Neck",
    icon: HeadingIcon,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 2,
    name: "Brain",
    icon: Brain,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Chest and Thorax",
    icon: AirVent,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 4,
    name: "Abdomen",
    icon: Stethoscope,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 5,
    name: "Musculoskeletal System",
    icon: Bone,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 6,
    name: "Pelvis",
    icon: CircleDot,
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: 7,
    name: "Breast",
    icon: Circle,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: 8,
    name: "Vascular System",
    icon: HeartPulse,
    color: "bg-red-200 text-red-800",
  },
  {
    id: 9,
    name: "Pediatric-Specific Imaging",
    icon: Baby,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 10,
    name: "Whole-Body Imaging",
    icon: User,
    color: "bg-gray-100 text-gray-700",
  },
];


interface CourseFilterDrawerProps {
    openDrawer : boolean;
    setOpenDrawer : (value : boolean) => void;
    setCourses : (value : any) => void;
    userDetails : any;
    tabSelected : any;   
}
function CourseFilterDrawer({setOpenDrawer, openDrawer, setCourses, userDetails, tabSelected} : CourseFilterDrawerProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isClearFilterLoading, setIsClearFilterLoading] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<any>({});

    const handle_show_search_result = async ( value : any)=>{
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_PATH +'get-all-courses', {
                user_id: userDetails.id, 
                feature_course : tabSelected == 'featured',
                new_release : tabSelected == 'new',
                filter : value
            });
            console.log('Success:', response.data);
            setCourses(response.data.data)
            const timer = setTimeout (()=>{
                setIsLoading(false)
                setIsClearFilterLoading(false)
                setOpenDrawer(false)
            }, 500)
            return (()=>clearTimeout(timer))
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
        }
    }

    return (
        <>  
            <Drawer open={openDrawer} onClose={()=>setOpenDrawer(false)}>
                <DrawerContent className="w-full">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>
                                Search and Filters
                            </DrawerTitle>
                        </DrawerHeader>

        
                        <div className="flex relative w-full m-2">
                            <Input
                                type="text"
                                placeholder="Search courses, instructors, or topics..."
                                className="pl-3"
                                onChange={(e)=>setFilterValue((prev : any)=>({...prev, 'keywords': e.target.value}))}
                                // defaultValue={filterValue.keywords}
                                value={filterValue.keywords ? filterValue.keywords : ''}
                            />
                            {filterValue.keywords ? (
                                <button
                                    type="button"
                                    onClick={(e)=>setFilterValue((prev : any)=>({...prev, 'keywords': ''}))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    aria-label="Clear input"
                                >
                                <XCircle className="h-4 w-4" />
                                </button>
                            ) : (
                                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            )}
                        </div>

                        <div className="w-full m-2">
                            <CourseCategorySelection
                                setValue={(e)=>setFilterValue((prev : any)=>({...prev, 'category_id': e}))}
                                value={filterValue.category_id ? filterValue.category_id : ''}
                            />
                            {/* <Select 
                                onValueChange={(e)=>setFilterValue((prev : any)=>({...prev, 'category_id': e}))}
                                defaultValue={filterValue.category_id ? filterValue.category_id : ''}
                            >   
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {radiologyCategories.map((category : any) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select> */}
                        </div>
                        
                        <div className="w-full m-2"> 
                            <Select 
                                onValueChange={(e)=>setFilterValue((prev : any)=>({...prev, 'level': e}))}
                                defaultValue={filterValue.level ? filterValue.level : ''}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Levels</SelectItem>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <DrawerFooter>
                            <Button 
                                onClick={()=>{
                                    setIsLoading(true)
                                    handle_show_search_result(filterValue)
                                }} 
                                disabled={isLoading}
                            >
                                {isLoading && <Loader2 className="animate-spin"/>} Show Result
                            </Button>
                            <Button 
                                onClick={()=>{
                                    setIsClearFilterLoading(true)
                                    setFilterValue({}) // clear the filter value
                                    handle_show_search_result({})
                                }}
                                type="reset"
                            >   
                                {isClearFilterLoading && <Loader2 className="animate-spin"/>}
                                Clear All Filter
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}
export default CourseFilterDrawer


