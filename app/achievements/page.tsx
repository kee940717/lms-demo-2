import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Trophy, Target, Zap, Medal, Crown, Flame, BookOpen, Eye, Clock } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first course",
    icon: BookOpen,
    earned: true,
    earnedDate: "2024-01-15",
    points: 100,
    rarity: "Common",
  },
  {
    id: 2,
    title: "Case Master",
    description: "Review 100 DICOM cases",
    icon: Eye,
    earned: true,
    earnedDate: "2024-02-20",
    points: 500,
    rarity: "Uncommon",
  },
  {
    id: 3,
    title: "Speed Reader",
    description: "Complete a course in under 24 hours",
    icon: Zap,
    earned: true,
    earnedDate: "2024-03-10",
    points: 300,
    rarity: "Rare",
  },
  {
    id: 4,
    title: "Perfectionist",
    description: "Achieve 100% accuracy on 10 consecutive quizzes",
    icon: Target,
    earned: false,
    progress: 7,
    total: 10,
    points: 1000,
    rarity: "Epic",
  },
  {
    id: 5,
    title: "Marathon Learner",
    description: "Study for 50 hours in a month",
    icon: Clock,
    earned: false,
    progress: 32,
    total: 50,
    points: 750,
    rarity: "Rare",
  },
  {
    id: 6,
    title: "Legendary Scholar",
    description: "Complete all courses in a specialty",
    icon: Crown,
    earned: false,
    progress: 8,
    total: 12,
    points: 2000,
    rarity: "Legendary",
  },
]

const badges = [
  { name: "MRI Master", icon: Award, color: "bg-blue-500" },
  { name: "CT Expert", icon: Medal, color: "bg-green-500" },
  { name: "Accuracy Champion", icon: Target, color: "bg-yellow-500" },
  { name: "Speed Demon", icon: Zap, color: "bg-red-500" },
  { name: "Knowledge Seeker", icon: BookOpen, color: "bg-purple-500" },
  { name: "Case Crusher", icon: Eye, color: "bg-indigo-500" },
]

const streaks = [
  { name: "Daily Login", current: 15, best: 45, icon: Flame },
  { name: "Weekly Quiz", current: 8, best: 12, icon: Trophy },
  { name: "Case Review", current: 23, best: 30, icon: Eye },
]

export default function AchievementsPage() {
  const earnedAchievements = achievements.filter((a) => a.earned)
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Achievements</h1>
            <p className="text-muted-foreground">Track your learning milestones and progress</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements Earned</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnedAchievements.length}</div>
              <p className="text-xs text-muted-foreground">of {achievements.length} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Collected</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{badges.length}</div>
              <p className="text-xs text-muted-foreground">Specialty badges</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Days active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((earnedAchievements.length / achievements.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Achievement progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="achievements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map((achievement) => {
                const IconComponent = achievement.icon
                const rarityColors = {
                  Common: "border-gray-300 bg-gray-50 dark:bg-gray-900",
                  Uncommon: "border-green-300 bg-green-50 dark:bg-green-900",
                  Rare: "border-blue-300 bg-blue-50 dark:bg-blue-900",
                  Epic: "border-purple-300 bg-purple-50 dark:bg-purple-900",
                  Legendary: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900",
                }

                return (
                  <Card
                    key={achievement.id}
                    className={`${rarityColors[achievement.rarity as keyof typeof rarityColors]} ${
                      achievement.earned ? "border-2" : "opacity-60"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              achievement.earned
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{achievement.title}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={achievement.earned ? "default" : "secondary"}>{achievement.rarity}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">{achievement.points} points</span>
                          {achievement.earned && achievement.earnedDate && (
                            <div className="text-muted-foreground">
                              Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {!achievement.earned && achievement.progress !== undefined && (
                          <div className="flex-1 ml-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>
                                {achievement.progress}/{achievement.total}
                              </span>
                            </div>
                            <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Specialty Badges</CardTitle>
                <CardDescription>Badges earned for expertise in different radiology specialties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                  {badges.map((badge, index) => {
                    const IconComponent = badge.icon
                    return (
                      <div key={index} className="text-center space-y-2">
                        <div
                          className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-sm font-medium">{badge.name}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streaks" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {streaks.map((streak, index) => {
                const IconComponent = streak.icon
                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-orange-500" />
                        <CardTitle className="text-lg">{streak.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500">{streak.current}</div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                      </div>

                      <div className="text-center">
                        <div className="text-lg font-semibold">{streak.best}</div>
                        <div className="text-sm text-muted-foreground">Best Streak</div>
                      </div>

                      <Progress value={(streak.current / streak.best) * 100} className="h-2" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
