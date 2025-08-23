import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Users, Target } from "lucide-react"

const globalLeaderboard = [
  {
    rank: 1,
    name: "Dr. Sarah Chen",
    specialty: "Neuroradiology",
    points: 24580,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 2,
    name: "Dr. Michael Rodriguez",
    specialty: "Chest Imaging",
    points: 23120,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 3,
    name: "Dr. Emily Johnson",
    specialty: "Musculoskeletal",
    points: 22890,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 4,
    name: "Dr. David Kim",
    specialty: "Abdominal Imaging",
    points: 21450,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 5,
    name: "Dr. Lisa Wang",
    specialty: "Bweast Imaging",
    points: 20980,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 6,
    name: "Dr. James Wilson",
    specialty: "Cardiac Imaging",
    points: 19750,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 7,
    name: "Dr. Maria Garcia",
    specialty: "Pediatric Radiology",
    points: 18920,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 8,
    name: "Dr. Robert Taylor",
    specialty: "Emergency Radiology",
    points: 17680,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const weeklyLeaderboard = [
  { rank: 1, name: "Dr. Alex Thompson", specialty: "Interventional", points: 1250, change: "+15" },
  { rank: 2, name: "Dr. Jennifer Lee", specialty: "Nuclear Medicine", points: 1180, change: "+8" },
  { rank: 3, name: "Dr. Mark Davis", specialty: "Neuroradiology", points: 1120, change: "-2" },
  { rank: 4, name: "Dr. Rachel Brown", specialty: "Chest Imaging", points: 1050, change: "+12" },
  { rank: 5, name: "Dr. Kevin Martinez", specialty: "Abdominal", points: 980, change: "+5" },
]

export default function LeaderboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">Compete with radiologists worldwide</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Your Rank: #23
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,847</div>
              <p className="text-xs text-muted-foreground">Active learners</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,420</div>
              <p className="text-xs text-muted-foreground">+340 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">Diagnostic accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+5</div>
              <p className="text-xs text-muted-foreground">From last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Tabs */}
        <Tabs defaultValue="global" className="space-y-4">
          <TabsList>
            <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Leaders</TabsTrigger>
            <TabsTrigger value="specialty">By Specialty</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>Top performers across all specialties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {globalLeaderboard.map((user, index) => (
                    <div
                      key={user.rank}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {user.rank <= 3 ? (
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              user.rank === 1 ? "bg-yellow-500" : user.rank === 2 ? "bg-gray-400" : "bg-amber-600"
                            }`}
                          >
                            {user.rank === 1 ? (
                              <Trophy className="h-3 w-3 text-white" />
                            ) : user.rank === 2 ? (
                              <Medal className="h-3 w-3 text-white" />
                            ) : (
                              <Award className="h-3 w-3 text-white" />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">#{user.rank}</span>
                        )}
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.specialty}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">{user.points.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Weekly Leaders
                </CardTitle>
                <CardDescription>Top performers this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyLeaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        <span className="text-sm font-medium text-muted-foreground">#{user.rank}</span>
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.specialty}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">{user.points}</p>
                        <p className={`text-sm ${user.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                          {user.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specialty" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Neuroradiology</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Dr. Sarah Chen</span>
                      <span className="text-sm">24,580 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dr. Mark Davis</span>
                      <span className="text-sm">18,920 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dr. Lisa Park</span>
                      <span className="text-sm">16,450 pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chest Imaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Dr. Michael Rodriguez</span>
                      <span className="text-sm">23,120 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dr. Rachel Brown</span>
                      <span className="text-sm">19,680 pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dr. Tom Wilson</span>
                      <span className="text-sm">17,230 pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
