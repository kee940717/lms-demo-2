import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Eye, Trophy, Clock, TrendingUp, Award, Target } from "lucide-react"
import Link from "next/link"

interface ComponentProps {
    userDetails: any;
}

function DashboardContainer({ userDetails }: ComponentProps) {


    return (
        <>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back, Dr. {userDetails.last_name}</h1>
                        <p className="text-muted-foreground">Continue your radiology education journey</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        Level 12 Radiologist
                    </Badge>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cases Reviewed</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,247</div>
                            <p className="text-xs text-muted-foreground">+89 this week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15,420</div>
                            <p className="text-xs text-muted-foreground">Rank #23 globally</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">127h</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Current Courses */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Continue Learning</CardTitle>
                            <CardDescription>Your active courses and progress</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Advanced MRI Interpretation</span>
                                    <span className="text-sm text-muted-foreground">78%</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">CT Chest Imaging</span>
                                    <span className="text-sm text-muted-foreground">45%</span>
                                </div>
                                <Progress value={45} className="h-2" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Mammography Essentials</span>
                                    <span className="text-sm text-muted-foreground">92%</span>
                                </div>
                                <Progress value={92} className="h-2" />
                            </div>

                            <Button className="w-full" asChild>
                                <Link href="/courses">View All Courses</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Recent Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Achievements</CardTitle>
                            <CardDescription>Your latest badges and milestones</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                                    <Award className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">MRI Master</p>
                                    <p className="text-xs text-muted-foreground">Completed 50 MRI cases</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Accuracy Expert</p>
                                    <p className="text-xs text-muted-foreground">95% diagnostic accuracy</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Streak Champion</p>
                                    <p className="text-xs text-muted-foreground">30-day learning streak</p>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/achievements">View All Achievements</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Jump into your learning activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                                <Link href="/cases/viewer">
                                    <Eye className="h-6 w-6" />
                                    <span>Review Cases</span>
                                </Link>
                            </Button>

                            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                                <Link href="/quiz">
                                    <BookOpen className="h-6 w-6" />
                                    <span>Take Quiz</span>
                                </Link>
                            </Button>

                            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
                                <Link href="/leaderboard">
                                    <Trophy className="h-6 w-6" />
                                    <span>Leaderboard</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default DashboardContainer