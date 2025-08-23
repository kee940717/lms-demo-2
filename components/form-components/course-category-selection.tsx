import { HeadingIcon, Brain, User, AirVent, Circle, HeartPulse, Baby, Stethoscope, Bone, CircleDot } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "../ui/select";

const radiologyCategories = [
  {
    id: '1',
    name: "Head and Neck",
    icon: HeadingIcon,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: '2',
    name: "Brain",
    icon: Brain,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: '3',
    name: "Chest and Thorax",
    icon: AirVent,
    color: "bg-red-100 text-red-700",
  },
  {
    id: '4',
    name: "Abdomen",
    icon: Stethoscope,
    color: "bg-green-100 text-green-700",
  },
  {
    id: '5',
    name: "Musculoskeletal System",
    icon: Bone,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: '6',
    name: "Pelvis",
    icon: CircleDot,
    color: "bg-teal-100 text-teal-700",
  },
  {
    id: '7',
    name: "Breast",
    icon: Circle,
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: '8',
    name: "Vascular System",
    icon: HeartPulse,
    color: "bg-red-200 text-red-800",
  },
  {
    id: '9',
    name: "Pediatric-Specific Imaging",
    icon: Baby,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: '10',
    name: "Whole-Body Imaging",
    icon: User,
    color: "bg-gray-100 text-gray-700",
  },
];

interface ComponentsProps {
    value : any;
    setValue : (value : any) => void;
}

function CourseCategorySelection ({setValue, value} : ComponentsProps) {
    return (
        <>
            <Select
                onValueChange={setValue}
                // defaultValue={value}
                value={typeof(value) =='number' ? String(value) : value }
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
            </Select>
        </>
    )
}
export default CourseCategorySelection;