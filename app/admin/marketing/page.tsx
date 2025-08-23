"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Mail, Users, TrendingUp, Calendar, Edit, Copy, Trash2, Send, Eye, BarChart3 } from "lucide-react"
import { EmailBuilder } from "@/components/marketing/email-builder"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { User } from "@/lib/auth"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  targetUsers: string[]
  status: "draft" | "scheduled" | "sent" | "sending"
  sentAt?: Date
  scheduledAt?: Date
  openRate?: number
  clickRate?: number
  createdAt: Date
}

// Mock data
const mockUsers: User[] = [
  { id: "1", name: "Dr. Sarah Johnson", email: "sarah.johnson@hospital.com", role: "faculty", status: "approved" },
  { id: "2", name: "Dr. Michael Chen", email: "michael.chen@clinic.com", role: "student", status: "approved" },
  { id: "3", name: "Dr. Emily Rodriguez", email: "emily.rodriguez@medical.com", role: "student", status: "approved" },
  { id: "4", name: "Dr. James Wilson", email: "james.wilson@hospital.com", role: "faculty", status: "approved" },
  { id: "5", name: "Dr. Lisa Thompson", email: "lisa.thompson@clinic.com", role: "student", status: "pending" },
  { id: "6", name: "Admin User", email: "admin@radiologylms.com", role: "admin", status: "approved" },
]

const mockCampaigns: EmailCampaign[] = [
  {
    id: "1",
    name: "Welcome New Students",
    subject: "Welcome to RadiologyLMS - Your Learning Journey Begins!",
    content: "<p>Welcome to our platform...</p>",
    targetUsers: ["2", "3", "5"],
    status: "sent",
    sentAt: new Date("2024-01-15"),
    openRate: 85,
    clickRate: 42,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "2",
    name: "New Course Announcement",
    subject: "New Advanced MRI Course Available",
    content: "<p>We're excited to announce...</p>",
    targetUsers: ["1", "2", "3", "4"],
    status: "scheduled",
    scheduledAt: new Date("2024-01-20"),
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    name: "Monthly Newsletter",
    subject: "RadiologyLMS Monthly Update - January 2024",
    content: "<p>Here's what's new this month...</p>",
    targetUsers: ["1", "2", "3", "4", "5"],
    status: "draft",
    createdAt: new Date("2024-01-17"),
  },
]

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateCampaign = () => {
    const newCampaign: EmailCampaign = {
      id: Date.now().toString(),
      name: "New Campaign",
      subject: "",
      content: "",
      targetUsers: [],
      status: "draft",
      createdAt: new Date(),
    }
    setSelectedCampaign(newCampaign)
    setIsBuilderOpen(true)
  }

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign)
    setIsBuilderOpen(true)
  }

  const handleSaveCampaign = (campaign: EmailCampaign) => {
    if (campaigns.find((c) => c.id === campaign.id)) {
      setCampaigns(campaigns.map((c) => (c.id === campaign.id ? campaign : c)))
    } else {
      setCampaigns([...campaigns, campaign])
    }
    setIsBuilderOpen(false)
    setSelectedCampaign(null)
  }

  const handleDuplicateCampaign = (campaign: EmailCampaign) => {
    const duplicated: EmailCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: "draft",
      createdAt: new Date(),
      sentAt: undefined,
      scheduledAt: undefined,
      openRate: undefined,
      clickRate: undefined,
    }
    setCampaigns([...campaigns, duplicated])
  }

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter((c) => c.id !== campaignId))
  }

  const getStatusColor = (status: EmailCampaign["status"]) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "sending":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalSent = campaigns.filter((c) => c.status === "sent").length
  const totalScheduled = campaigns.filter((c) => c.status === "scheduled").length
  const avgOpenRate =
    campaigns.filter((c) => c.openRate).reduce((acc, c) => acc + (c.openRate || 0), 0) /
      campaigns.filter((c) => c.openRate).length || 0

  if (isBuilderOpen && selectedCampaign) {
    return (
      <DashboardLayout>
        <EmailBuilder
          campaign={selectedCampaign}
          users={mockUsers}
          onSave={handleSaveCampaign}
          onCancel={() => {
            setIsBuilderOpen(false)
            setSelectedCampaign(null)
          }}
        />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Email Marketing</h1>
            <p className="text-muted-foreground">Create and manage email campaigns for your users</p>
          </div>
          <Button onClick={handleCreateCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                {campaigns.filter((c) => c.status === "draft").length} drafts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaigns Sent</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSent}</div>
              <p className="text-xs text-muted-foreground">{totalScheduled} scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockUsers.length}</div>
              <p className="text-xs text-muted-foreground">Active users</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Campaigns List */}
            <div className="grid gap-4">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                        </div>
                        <p className="text-muted-foreground">{campaign.subject}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {campaign.targetUsers.length} recipients
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {campaign.sentAt
                              ? `Sent ${campaign.sentAt.toLocaleDateString()}`
                              : campaign.scheduledAt
                                ? `Scheduled ${campaign.scheduledAt.toLocaleDateString()}`
                                : `Created ${campaign.createdAt.toLocaleDateString()}`}
                          </span>
                          {campaign.openRate && (
                            <span className="flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {campaign.openRate}% open rate
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCampaign(campaign)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDuplicateCampaign(campaign)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCampaign(campaign.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Email Analytics
                </CardTitle>
                <CardDescription>Track the performance of your email campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Detailed analytics and reporting will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Pre-built templates for common email scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "Welcome Email", description: "Welcome new users to the platform" },
                    { name: "Course Update", description: "Announce new courses and updates" },
                    { name: "Reminder", description: "Remind users about pending activities" },
                    { name: "Newsletter", description: "Monthly newsletter template" },
                    { name: "Event Invitation", description: "Invite users to webinars and events" },
                    { name: "Achievement", description: "Congratulate users on achievements" },
                  ].map((template) => (
                    <Card key={template.name} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={()=>ShowToast("Coming soon", "This feature is under development")}>
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
