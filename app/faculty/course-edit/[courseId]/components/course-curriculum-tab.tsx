"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Eye,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import type { Course, CourseModule, Lesson } from "@/lib/courses"

interface CourseCurriculumTabProps {
  course: Course
  onUpdate: (updates: Partial<Course>) => void
}

export function CourseCurriculumTab({ course, onUpdate }: CourseCurriculumTabProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const addModule = (moduleData: Omit<CourseModule, "id" | "courseId" | "lessons">) => {
    const newModule: CourseModule = {
      ...moduleData,
      id: Date.now().toString(),
      courseId: course.id,
      lessons: [],
    }

    const updatedModules = [...(course.modules || []), newModule]
    onUpdate({ modules: updatedModules })
    setShowAddModule(false)
  }

  const updateModule = (moduleId: string, updates: Partial<CourseModule>) => {
    const updatedModules =
      course.modules?.map((module) => (module.id === moduleId ? { ...module, ...updates } : module)) || []
    onUpdate({ modules: updatedModules })
    setEditingModule(null)
  }

  const deleteModule = (moduleId: string) => {
    const updatedModules = course.modules?.filter((module) => module.id !== moduleId) || []
    onUpdate({ modules: updatedModules })
  }

  const addLesson = (moduleId: string, lessonData: Omit<Lesson, "id" | "moduleId">) => {
    const newLesson: Lesson = {
      ...lessonData,
      id: Date.now().toString(),
      moduleId,
    }

    const updatedModules =
      course.modules?.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: [...module.lessons, newLesson],
          }
        }
        return module
      }) || []

    onUpdate({ modules: updatedModules })
    setShowAddLesson(null)
  }

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    const updatedModules =
      course.modules?.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...updates } : lesson)),
          }
        }
        return module
      }) || []

    onUpdate({ modules: updatedModules })
    setEditingLesson(null)
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules =
      course.modules?.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
          }
        }
        return module
      }) || []

    onUpdate({ modules: updatedModules })
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      case "case":
        return <Eye className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTotalDuration = () => {
    let total = 0
    course.modules?.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (lesson.duration) total += lesson.duration
      })
    })
    return total
  }

  const getTotalLessons = () => {
    return course.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0
  }

  return (
    <div className="space-y-6">
      {/* Curriculum Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Overview</CardTitle>
          <CardDescription>Organize your course content into modules and lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{course.modules?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Modules</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{getTotalLessons()}</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{Math.round(getTotalDuration() / 60)}h</div>
              <div className="text-sm text-muted-foreground">Total Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Curriculum</CardTitle>
              <CardDescription>Add modules and lessons to structure your course content</CardDescription>
            </div>
            <Dialog open={showAddModule} onOpenChange={setShowAddModule}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Module</DialogTitle>
                  <DialogDescription>Create a new module to organize your lessons</DialogDescription>
                </DialogHeader>
                <AddModuleForm onSubmit={addModule} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!course.modules || course.modules.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No modules yet</h3>
                  <p className="text-muted-foreground">Start building your course by adding your first module</p>
                </div>
                <Button onClick={() => setShowAddModule(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Module
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="border rounded-lg">
                  {/* Module Header */}
                  <div className="p-4 border-b bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleModule(module.id)}
                          className="p-0 h-auto"
                        >
                          {expandedModules.has(module.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <div>
                          <h3 className="font-medium">
                            Module {moduleIndex + 1}: {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{module.lessons.length} lessons</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingModule(module)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteModule(module.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Module Content */}
                  {expandedModules.has(module.id) && (
                    <div className="p-4">
                      {module.description && <p className="text-sm text-muted-foreground mb-4">{module.description}</p>}

                      {/* Lessons */}
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                          >
                            <div className="flex items-center space-x-3">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                              {getLessonIcon(lesson.type)}
                              <div>
                                <h4 className="font-medium">
                                  {lessonIndex + 1}. {lesson.title}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                  {lesson.duration && (
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {lesson.duration}m
                                    </span>
                                  )}
                                  {lesson.isRequired && (
                                    <Badge variant="secondary" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingLesson(lesson)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteLesson(module.id, lesson.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        {/* Add Lesson Button */}
                        <Dialog
                          open={showAddLesson === module.id}
                          onOpenChange={(open) => setShowAddLesson(open ? module.id : null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full mt-2 border-dashed bg-transparent">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Lesson
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Lesson</DialogTitle>
                              <DialogDescription>Add a lesson to {module.title}</DialogDescription>
                            </DialogHeader>
                            <AddLessonForm onSubmit={(lessonData) => addLesson(module.id, lessonData)} />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Module Dialog */}
      {editingModule && (
        <Dialog open={!!editingModule} onOpenChange={() => setEditingModule(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Module</DialogTitle>
              <DialogDescription>Update module information</DialogDescription>
            </DialogHeader>
            <EditModuleForm module={editingModule} onSubmit={(updates) => updateModule(editingModule.id, updates)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Lesson Dialog */}
      {editingLesson && (
        <Dialog open={!!editingLesson} onOpenChange={() => setEditingLesson(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Lesson</DialogTitle>
              <DialogDescription>Update lesson information</DialogDescription>
            </DialogHeader>
            <EditLessonForm
              lesson={editingLesson}
              onSubmit={(updates) => {
                const moduleId = course.modules?.find((m) => m.lessons.some((l) => l.id === editingLesson.id))?.id
                if (moduleId) {
                  updateLesson(moduleId, editingLesson.id, updates)
                }
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Add Module Form Component
function AddModuleForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ title: "", description: "", order: 1 })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="moduleTitle">Module Title</Label>
        <Input
          id="moduleTitle"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Introduction to MRI Physics"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="moduleDescription">Description (Optional)</Label>
        <Textarea
          id="moduleDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of what this module covers..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Module
      </Button>
    </form>
  )
}

// Edit Module Form Component
function EditModuleForm({ module, onSubmit }: { module: CourseModule; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: module.title,
    description: module.description || "",
    order: module.order,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="moduleTitle">Module Title</Label>
        <Input
          id="moduleTitle"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="moduleDescription">Description</Label>
        <Textarea
          id="moduleDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Update Module
      </Button>
    </form>
  )
}

// Add Lesson Form Component
function AddLessonForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video" as "video" | "pdf" | "text" | "quiz" | "case",
    content: "",
    duration: 0,
    order: 1,
    isRequired: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      description: "",
      type: "video",
      content: "",
      duration: 0,
      order: 1,
      isRequired: true,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lessonTitle">Lesson Title</Label>
        <Input
          id="lessonTitle"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Basic MRI Sequences"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessonType">Lesson Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="pdf">PDF Document</SelectItem>
            <SelectItem value="text">Text Content</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="case">DICOM Case</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessonDescription">Description</Label>
        <Textarea
          id="lessonDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the lesson content..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessonDuration">Duration (minutes)</Label>
        <Input
          id="lessonDuration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      <Button type="submit" className="w-full">
        Add Lesson
      </Button>
    </form>
  )
}

// Edit Lesson Form Component
function EditLessonForm({ lesson, onSubmit }: { lesson: Lesson; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description || "",
    type: lesson.type,
    content: lesson.content,
    duration: lesson.duration || 0,
    order: lesson.order,
    isRequired: lesson.isRequired,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lessonTitle">Lesson Title</Label>
        <Input
          id="lessonTitle"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessonType">Lesson Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="pdf">PDF Document</SelectItem>
            <SelectItem value="text">Text Content</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="case">DICOM Case</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessonDescription">Description</Label>
        <Textarea
          id="lessonDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lessonDuration">Duration (minutes)</Label>
        <Input
          id="lessonDuration"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 0 })}
        />
      </div>

      <Button type="submit" className="w-full">
        Update Lesson
      </Button>
    </form>
  )
}
