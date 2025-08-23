"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award, Target, TrendingUp, Calendar, CheckCircle, FileText, Brain, Star } from "lucide-react"

interface CourseProgressTrackerProps {
  courseId: string
  progress: {
    overall: number
    completedLessons: number
    totalLessons: number
    timeSpent: number
    estimatedTimeRemaining: number
    currentStreak: number
    lastAccessed: string
    achievements: Array<{
      id: string
      title: string
      description: string
      icon: string
      earnedAt: string
    }>
    weeklyGoal: {
      target: number
      completed: number
    }
    upcomingDeadlines: Array<{
      id: string
      title: string
      type: "quiz" | "assignment" | "exam"
      dueDate: string
      completed: boolean
    }>
  }
}

export function CourseProgressTracker({ courseId, progress }: CourseProgressTrackerProps) {
  const progressPercentage = (progress.completedLessons / progress.totalLessons) * 100
  const weeklyProgress = (progress.weeklyGoal.completed / progress.weeklyGoal.target) * 100

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Course Progress
          </CardTitle>
          <CardDescription>Track your learning journey and achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">
                {progress.completedLessons} of {progress.totalLessons} lessons
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{Math.round(progressPercentage)}% complete</span>
              <span className="font-medium text-green-600">
                {progress.totalLessons - progress.completedLessons} lessons remaining
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{Math.round(progress.timeSpent / 60)}h</div>
              <div className="text-xs text-muted-foreground">Time Spent</div>
            </div>

            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{progress.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>

            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{progress.achievements.length}</div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>

            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold">{Math.round(progress.estimatedTimeRemaining / 60)}h</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Learning Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Week's Progress</span>
              <span className="text-sm text-muted-foreground">
                {progress.weeklyGoal.completed} of {progress.weeklyGoal.target} lessons
              </span>
            </div>
            <Progress value={weeklyProgress} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {weeklyProgress >= 100 ? (
                <span className="text-green-600 font-medium">🎉 Weekly goal achieved!</span>
              ) : (
                <span>
                  {progress.weeklyGoal.target - progress.weeklyGoal.completed} more lessons to reach your goal
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress.achievements.length > 0 ? (
            <div className="space-y-3">
              {progress.achievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">Earned {achievement.earnedAt}</div>
                  </div>
                </div>
              ))}
              {progress.achievements.length > 3 && (
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View All Achievements ({progress.achievements.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No achievements yet</p>
              <p className="text-sm">Complete lessons to earn your first achievement!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {progress.upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {progress.upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        deadline.completed ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {deadline.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : deadline.type === "quiz" ? (
                        <FileText className="h-4 w-4 text-red-600" />
                      ) : deadline.type === "assignment" ? (
                        <BookOpen className="h-4 w-4 text-red-600" />
                      ) : (
                        <Brain className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{deadline.title}</div>
                      <div className="text-sm text-muted-foreground">Due {deadline.dueDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={deadline.completed ? "default" : "destructive"}>
                      {deadline.completed ? "Completed" : "Pending"}
                    </Badge>
                    {!deadline.completed && (
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming deadlines</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span>Last accessed:</span>
              <span className="font-medium">{progress.lastAccessed}</span>
            </div>
            <div className="flex justify-between">
              <span>Average session:</span>
              <span className="font-medium">45 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Completion rate:</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Study streak:</span>
              <span className="font-medium">{progress.currentStreak} days</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
