"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Bell, Users, Plus, Search, Filter } from "lucide-react"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface CourseMessagesTabProps {
  courseId: string
}

// Mock messages data
const mockMessages = [
  {
    id: "1",
    student: {
      name: "Dr. Emily Johnson",
      email: "emily.johnson@hospital.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Question about MRI sequences",
    message:
      "Hi, I'm having trouble understanding the difference between T1 and T2 weighted sequences. Could you provide more clarification?",
    timestamp: "2024-01-20T10:30:00Z",
    status: "unread",
    type: "question",
  },
  {
    id: "2",
    student: {
      name: "Dr. Michael Chen",
      email: "m.chen@medcenter.org",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Technical issue with video",
    message: "The video in Module 3, Lesson 2 won't load properly. I've tried refreshing but it still doesn't work.",
    timestamp: "2024-01-19T15:45:00Z",
    status: "replied",
    type: "technical",
  },
  {
    id: "3",
    student: {
      name: "Dr. Sarah Williams",
      email: "sarah.w@clinic.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subject: "Great course!",
    message:
      "Just wanted to say thank you for this excellent course. The explanations are very clear and the case studies are particularly helpful.",
    timestamp: "2024-01-18T09:15:00Z",
    status: "read",
    type: "feedback",
  },
]

const mockAnnouncements = [
  {
    id: "1",
    title: "New Case Studies Added",
    content: "I've added 5 new chest CT cases to Module 4. These cases focus on pulmonary nodule evaluation.",
    timestamp: "2024-01-15T14:00:00Z",
    recipients: 89,
  },
  {
    id: "2",
    title: "Live Q&A Session Scheduled",
    content: "Join me for a live Q&A session this Friday at 2 PM EST. We'll discuss common questions from the course.",
    timestamp: "2024-01-10T11:30:00Z",
    recipients: 89,
  },
]

export function CourseMessagesTab({ courseId }: CourseMessagesTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  })

  const filteredMessages = mockMessages.filter((message) => {
    const matchesSearch =
      message.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === "all" || message.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  const unreadCount = mockMessages.filter((m) => m.status === "unread").length

  return (
    <div className="space-y-6">
      {/* Messages Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMessages.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnnouncements.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Course Communications</CardTitle>
          <CardDescription>Manage student messages and course announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages" className="space-y-4">
            <TabsList>
              <TabsTrigger value="messages">
                Student Messages
                {unreadCount > 0 && (
                  <span className="ml-2">
                    <Badge variant="destructive" className="h-5 p-2 text-xs text-center">
                    {/* <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs"> */}
                      {unreadCount}
                    </Badge>
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="compose">Compose</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Filter Badges */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Filter by:</span>
                {["all", "unread", "replied", "read"].map((filter) => (
                  <Badge
                    key={filter}
                    variant={selectedFilter === filter ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Badge>
                ))}
              </div>

              {/* Messages List */}
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer ${
                      message.status === "unread" ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.student.avatar || "/placeholder.svg"} alt={message.student.name} />
                        <AvatarFallback>
                          {message.student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{message.student.name}</h4>
                            <p className="text-sm text-muted-foreground">{message.student.email}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                message.status === "unread"
                                  ? "destructive"
                                  : message.status === "replied"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {message.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm">{message.subject}</h5>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{message.message}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {message.type}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="announcements" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Course Announcements</h3>
                <Button size="sm" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </div>

              <div className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                          <span>{new Date(announcement.timestamp).toLocaleDateString()}</span>
                          <span>Sent to {announcement.recipients} students</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compose" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Send Announcement</CardTitle>
                  <CardDescription>Send a message to all enrolled students</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="announcement-title" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="announcement-title"
                      value={newAnnouncement.title}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter announcement subject..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="announcement-content" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="announcement-content"
                      value={newAnnouncement.content}
                      onChange={(e) =>
                        setNewAnnouncement({
                          ...newAnnouncement,
                          content: e.target.value,
                        })
                      }
                      placeholder="Write your announcement..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">This will be sent to all 89 enrolled students</p>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Send Announcement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
