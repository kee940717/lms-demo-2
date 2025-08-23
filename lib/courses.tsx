export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  category: string
  category_id: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  thumbnail?: string
  status: "draft" | "published" | "archived"
  modules: CourseModule[]
  createdAt: Date
  updatedAt: Date
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description: string
  type: "video" | "pdf" | "text" | "quiz" | "case"
  content: string // URL for video/pdf, HTML for text
  duration?: number
  order: number
  isRequired: boolean
}

export interface UserProgress {
  id: string
  userId: string
  courseId: string
  moduleId?: string
  lessonId?: string
  status: "not_started" | "in_progress" | "completed"
  progress: number // 0-100
  lastAccessed: Date
  completedAt?: Date
  quizScores?: QuizScore[]
}

export interface QuizScore {
  id: string
  userId: string
  lessonId: string
  score: number
  totalQuestions: number
  completedAt: Date
  timeSpent: number
}

export interface CaseInteraction {
  id: string
  userId: string
  caseId: string
  viewedAt: Date
  timeSpent: number
  interactions: number
  completed: boolean
}

// Mock data - replace with real database
const courses: Course[] = [
  {
    id: "1",
    title: "Advanced MRI Interpretation",
    description: "Comprehensive course on MRI interpretation techniques",
    instructorId: "2",
    instructorName: "Dr. Sarah Chen",
    category: "Neuroradiology",
    category_id : '2',
    level: "Advanced",
    duration: "12 hours",
    status: "published",
    modules: [
      {
        id: "1",
        courseId: "1",
        title: "Introduction to MRI Physics",
        description: "Basic principles of MRI imaging",
        order: 1,
        lessons: [
          {
            id: "1",
            moduleId: "1",
            title: "MRI Basics",
            description: "Introduction to MRI principles",
            type: "video",
            content: "https://example.com/video1.mp4",
            duration: 30,
            order: 1,
            isRequired: true,
          },
          {
            id: "2",
            moduleId: "1",
            title: "MRI Physics Quiz",
            description: "Test your knowledge of MRI physics",
            type: "quiz",
            content: "quiz-1",
            order: 2,
            isRequired: true,
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const userProgress: UserProgress[] = []
const quizScores: QuizScore[] = []
const caseInteractions: CaseInteraction[] = []

// Course management functions
export async function createCourse(courseData: Omit<Course, "id" | "createdAt" | "updatedAt">) {
  const newCourse: Course = {
    ...courseData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  courses.push(newCourse)
  return newCourse
}

export async function getCourseById(id: string) {
  return courses.find((c) => c.id === id)
}

export async function getCoursesByInstructor(instructorId: string) {
  return courses.filter((c) => c.instructorId === instructorId)
}

export async function getAllCourses() {
  return courses.filter((c) => c.status === "published")
}

export async function updateCourse(id: string, updates: Partial<Course>) {
  const courseIndex = courses.findIndex((c) => c.id === id)
  if (courseIndex !== -1) {
    courses[courseIndex] = { ...courses[courseIndex], ...updates, updatedAt: new Date() }
    return courses[courseIndex]
  }
  return null
}

// Progress tracking functions
export async function getUserProgress(userId: string, courseId?: string) {
  if (courseId) {
    return userProgress.filter((p) => p.userId === userId && p.courseId === courseId)
  }
  return userProgress.filter((p) => p.userId === userId)
}

export async function updateProgress(progressData: Omit<UserProgress, "id">) {
  const existingProgress = userProgress.find(
    (p) =>
      p.userId === progressData.userId && p.courseId === progressData.courseId && p.lessonId === progressData.lessonId,
  )

  if (existingProgress) {
    Object.assign(existingProgress, progressData)
    return existingProgress
  } else {
    const newProgress: UserProgress = {
      ...progressData,
      id: Date.now().toString(),
    }
    userProgress.push(newProgress)
    return newProgress
  }
}

export async function recordQuizScore(scoreData: Omit<QuizScore, "id">) {
  const newScore: QuizScore = {
    ...scoreData,
    id: Date.now().toString(),
  }
  quizScores.push(newScore)
  return newScore
}

export async function getQuizScores(userId: string) {
  return quizScores.filter((s) => s.userId === userId)
}

export async function recordCaseInteraction(interactionData: Omit<CaseInteraction, "id">) {
  const newInteraction: CaseInteraction = {
    ...interactionData,
    id: Date.now().toString(),
  }
  caseInteractions.push(newInteraction)
  return newInteraction
}

export async function getCaseInteractions(userId: string) {
  return caseInteractions.filter((i) => i.userId === userId)
}
