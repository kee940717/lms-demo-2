import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Users, Eye, MousePointer, Send, Target, BarChart3, Plus } from "lucide-react"

const campaigns = [
  {
    id: 1,
    name: "New User Onboarding",
    status: "Active",
    type: "Drip Campaign",
    recipients: 1247,
    openRate: 68.5,
    clickRate: 12.3,
    sent: 5,
    total: 7,
  },
  {
    id: 2,
    name: "Course Completion Reminder",
    status: "Active",
    type: "Behavioral",
    recipients: 892,
    openRate: 45.2,
    clickRate: 8.7,
    sent: 3,
    total: 5,
  },
  {
    id: 3,
    name: "Monthly Newsletter",
    status: "Scheduled",
    type: "Newsletter",
    recipients: 3456,
    openRate: 52.1,
    clickRate: 15.6,
    sent: 0,
    total: 1,
  },
]

const segments = [
  { name: "New Users (0-30 days)", count: 1247, growth: "+15%" },
  { name: "Active Learners", count: 3456, growth: "+8%" },
  { name: "Inactive (30+ days)", count: 892, growth: "-12%" },
  { name: "Course Completers", count: 2134, growth: "+22%" },
  { name: "Premium Subscribers", count: 567, growth: "+18%" },
]

export default function MarketingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketing Automation</h1>
            <p className="text-muted-foreground">Manage campaigns, segments, and analytics</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,642</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.7%</div>
              <p className="text-xs text-muted-foreground">+0.8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.4%</div>
              <p className="text-xs text-muted-foreground">+0.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Active Campaigns
                </CardTitle>
                <CardDescription>Manage your email marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline">{campaign.type}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Recipients</p>
                          <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Open Rate</p>
                          <p className="font-medium">{campaign.openRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Click Rate</p>
                          <p className="font-medium">{campaign.clickRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={(campaign.sent / campaign.total) * 100} className="flex-1" />
                            <span className="text-xs">
                              {campaign.sent}/{campaign.total}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  User Segments
                </CardTitle>
                <CardDescription>Organize users for targeted campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{segment.name}</h3>
                        <p className="text-sm text-muted-foreground">{segment.count.toLocaleString()} users</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={segment.growth.startsWith("+") ? "default" : "destructive"}>
                          {segment.growth}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Campaign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Campaign analytics chart would be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>User journey tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Sent</span>
                      <span className="font-medium">10,000</span>
                    </div>
                    <Progress value={100} />

                    <div className="flex items-center justify-between">
                      <span>Email Opened</span>
                      <span className="font-medium">5,830</span>
                    </div>
                    <Progress value={58} />

                    <div className="flex items-center justify-between">
                      <span>Clicked Link</span>
                      <span className="font-medium">1,270</span>
                    </div>
                    <Progress value={13} />

                    <div className="flex items-center justify-between">
                      <span>Converted</span>
                      <span className="font-medium">340</span>
                    </div>
                    <Progress value={3} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Templates
                </CardTitle>
                <CardDescription>Pre-built templates for common campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Welcome Series</h3>
                    <p className="text-sm text-muted-foreground">5-email onboarding sequence</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Course Reminder</h3>
                    <p className="text-sm text-muted-foreground">Re-engagement for inactive users</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <h3 className="font-medium">Achievement Alert</h3>
                    <p className="text-sm text-muted-foreground">Celebrate user milestones</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
