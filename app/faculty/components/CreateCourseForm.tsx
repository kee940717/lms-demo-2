"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import axios from 'axios';
import CourseCategorySelection from "@/components/form-components/course-category-selection"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface ComponentProps {
    userDetails: any;
    reload : any;
    setReload : (value : any) => void;
}

function CreateCourseForm({ userDetails , reload, setReload }: ComponentProps) {

    const [showCreateCourse, setShowCreateCourse] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
        duration: "",
        status: "draft" as "draft" | "published",
        user_id: ""
    })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        formData['user_id'] = userDetails.id
        try {
            const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_PATH +'insert-new-course', formData)
            const newCourse = response.data
            setShowCreateCourse(false)
            setFormData({
                title: "",
                description: "",
                category_id: "",
                level: "Beginner",
                duration: "",
                status: "draft",
                user_id: ""
            })
            setReload(!reload)
            ShowToast('success', "Course Created")
        } catch (error) {
            console.error("Failed to create course:", error)
            alert("Failed to create course. Please try again.")
        }
    }

    return (
        <>  
            <Dialog open={showCreateCourse} onOpenChange={setShowCreateCourse}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Course
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Course</DialogTitle>
                        <DialogDescription>Set up a new course for your students</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <CourseCategorySelection 
                                    setValue={(e)=>setFormData({...formData, 'category_id' : e})} 
                                    value={formData.category_id ? formData.category_id : ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="level">Level</Label>
                                <Select value={formData.level} onValueChange={(value: any) => setFormData({ ...formData, level: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="e.g., 8 hours"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full">
                            Create Course
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateCourseForm;