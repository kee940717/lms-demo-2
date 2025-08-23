"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon } from "lucide-react"
import type { Course } from "@/lib/courses"
import CourseCategorySelection from "@/components/form-components/course-category-selection"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface CourseBasicsTabProps {
  course: Course
  onUpdate: (updates: Partial<Course>) => void
}

const categories = [
  "Neuroradiology",
  "Chest Imaging",
  "Abdominal Imaging",
  "Musculoskeletal",
  "Breast Imaging",
  "Cardiac Imaging",
  "Pediatric Radiology",
  "Emergency Radiology",
  "Interventional Radiology",
  "Nuclear Medicine",
]

const levels = ["Beginner", "Intermediate", "Advanced"]

export function CourseBasicsTab({ course, onUpdate }: CourseBasicsTabProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleInputChange = (field: keyof Course, value: any) => {
    onUpdate({ [field]: value })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    // Mock file upload - replace with actual upload logic
    const mockUrl = `/placeholder.svg?height=300&width=500&text=${encodeURIComponent(file.name)}`
    handleInputChange("thumbnail", mockUrl)
  }

  return (
    <div className="space-y-6">
      {/* Course Title & Description */}
      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Basic information about your course that will be displayed to students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={course.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Advanced MRI Interpretation"
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground">
              Your title should be a mix of attention-grabbing, informative, and optimized for search
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Course Description *</Label>
            <Textarea
              id="description"
              value={course.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what students will learn in this course..."
              rows={4}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Description should be at least 200 characters. A good description includes learning outcomes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Course Image */}
      <Card>
        <CardHeader>
          <CardTitle>Course Image</CardTitle>
          <CardDescription>
            Upload an eye-catching course image. Students will see this image in search results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {course.thumbnail ? (
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt="Course thumbnail"
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleInputChange("thumbnail", "")}
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Drop an image here, or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">Recommended: 750x422 pixels (16:9 ratio)</p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload">
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Image Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Minimum resolution: 750x422 pixels</li>
                  <li>• Aspect ratio: 16:9 (recommended)</li>
                  <li>• File format: JPG, PNG, or GIF</li>
                  <li>• Maximum file size: 1MB</li>
                  <li>• Avoid text overlay on images</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tips for Great Images</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use high-quality medical imagery</li>
                  <li>• Ensure good contrast and clarity</li>
                  <li>• Consider your target audience</li>
                  <li>• Test how it looks on mobile devices</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>Additional information to help students understand your course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <CourseCategorySelection
                value={course.category_id} 
                setValue={(value) => handleInputChange("category_id", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={course.level}
                onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => handleInputChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration</Label>
            <Input
              id="duration"
              value={course.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="e.g., 8 hours, 2 weeks"
            />
            <p className="text-sm text-muted-foreground">
              Provide an estimate of how long it will take to complete this course
            </p>
          </div>

          <div className="space-y-2">
            <Label>Course Status</Label>
            <div className="flex items-center space-x-2">
              <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
              <span className="text-sm text-muted-foreground">
                {course.status === "published"
                  ? "Your course is live and visible to students"
                  : "Your course is in draft mode and not visible to students"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>What will students learn?</CardTitle>
          <CardDescription>
            List the key learning outcomes and skills students will gain from this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Learning Objectives</Label>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((index) => (
                  <Input key={index} placeholder={`Learning objective ${index}`} className="w-full" />
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent"  onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                Add More Objectives
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Students will see these learning objectives on your course landing page. Make them specific and
              actionable.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>
            What knowledge or experience should students have before taking this course?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Requirements</Label>
              <div className="space-y-2">
                {[1, 2, 3].map((index) => (
                  <Input key={index} placeholder={`Requirement ${index}`} className="w-full" />
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                Add More Requirements
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              List any prerequisites, required knowledge, or tools students need before starting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
