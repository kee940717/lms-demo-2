"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Send, Eye, ArrowLeft, Users, Calendar, Clock, Code, Edit } from "lucide-react"
import { UserSelector } from "./user-selector"
import { RichTextEditor } from "./rich-text-editor"
import type { User } from "@/lib/auth"

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

interface EmailBuilderProps {
  campaign: EmailCampaign
  users: User[]
  onSave: (campaign: EmailCampaign) => void
  onCancel: () => void
}

export function EmailBuilder({ campaign, users, onSave, onCancel }: EmailBuilderProps) {
  const [editedCampaign, setEditedCampaign] = useState<EmailCampaign>(campaign)
  const [previewMode, setPreviewMode] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [editorMode, setEditorMode] = useState<"rich" | "html">("rich")

  const handleSave = () => {
    onSave(editedCampaign)
  }

  const handleSend = () => {
    const updatedCampaign = {
      ...editedCampaign,
      status: "sending" as const,
      sentAt: new Date(),
    }
    onSave(updatedCampaign)
  }

  const handleSchedule = () => {
    if (scheduleDate && scheduleTime) {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`)
      const updatedCampaign = {
        ...editedCampaign,
        status: "scheduled" as const,
        scheduledAt,
      }
      onSave(updatedCampaign)
    }
  }

  const insertTemplate = (template: string) => {
    const templates = {
      welcome: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Welcome to RadiologyLMS! 🏥</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Radiology Education Platform</p>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear {{firstName}},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Welcome to our comprehensive radiology learning platform. We're excited to have you join our community of medical professionals.</p>
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 30px 0; border-radius: 0 6px 6px 0;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li style="margin-bottom: 8px;">Complete your profile setup</li>
                <li style="margin-bottom: 8px;">Browse our comprehensive course catalog</li>
                <li style="margin-bottom: 8px;">Join your first radiology course</li>
                <li>Connect with fellow medical professionals</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{dashboardUrl}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">Get Started</a>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Best regards,<br><strong>The RadiologyLMS Team</strong></p>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              © 2024 RadiologyLMS. All rights reserved.<br>
              <a href="{{unsubscribeUrl}}" style="color: #2563eb;">Unsubscribe</a> | <a href="#" style="color: #2563eb;">Update Preferences</a>
            </p>
          </div>
        </div>
      `,
      courseUpdate: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">New Course Available! 📚</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Expand Your Radiology Knowledge</p>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">We're excited to announce a new course that matches your interests and learning path:</p>
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; margin: 30px 0; background: #fafafa;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">{{courseName}}</h3>
              <p style="margin: 0 0 20px 0; color: #4b5563; line-height: 1.6;">{{courseDescription}}</p>
              <div style="display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;">
                <span style="background: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">Duration: {{courseDuration}}</span>
                <span style="background: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">Level: {{courseLevel}}</span>
                <span style="background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 500;">CME Credits Available</span>
              </div>
              <div style="text-align: center;">
                <a href="{{courseUrl}}" style="background: #16a34a; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">Enroll Now</a>
              </div>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Don't miss this opportunity to advance your radiology expertise!</p>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              © 2024 RadiologyLMS. All rights reserved.<br>
              <a href="{{unsubscribeUrl}}" style="color: #2563eb;">Unsubscribe</a> | <a href="#" style="color: #2563eb;">Update Preferences</a>
            </p>
          </div>
        </div>
      `,
      reminder: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
          <div style="background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Don't Miss Out! ⏰</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Learning Journey Awaits</p>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi {{firstName}},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">You have pending activities in your RadiologyLMS account that need your attention:</p>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 25px; margin: 30px 0; border-radius: 0 6px 6px 0;">
              <h3 style="margin: 0 0 15px 0; color: #92400e;">Pending Activities:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li style="margin-bottom: 8px;"><strong>{{pendingAssignments}}</strong> assignments due soon</li>
                <li style="margin-bottom: 8px;"><strong>{{upcomingClasses}}</strong> live classes this week</li>
                <li style="margin-bottom: 8px;"><strong>{{unreadMessages}}</strong> unread messages from instructors</li>
                <li>New course materials available for download</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 40px 0;">
              <a href="{{dashboardUrl}}" style="background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">Continue Learning</a>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Keep up the great work on your radiology education journey!</p>
          </div>
          <div style="background: #f8fafc; padding: 30px 20px; text-align: center;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              © 2024 RadiologyLMS. All rights reserved.<br>
              <a href="{{unsubscribeUrl}}" style="color: #2563eb;">Unsubscribe</a> | <a href="#" style="color: #2563eb;">Update Preferences</a>
            </p>
          </div>
        </div>
      `,
    }

    setEditedCampaign({
      ...editedCampaign,
      content: templates[template as keyof typeof templates],
    })
  }

  const selectedUsers = users.filter((user) => editedCampaign.targetUsers.includes(user.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Email Campaign Builder</h1>
            <p className="text-muted-foreground">Create and customize your email campaign</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {previewMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>This is how your email will appear to recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white max-w-2xl mx-auto">
                  <div className="border-b pb-4 mb-4">
                    <p className="text-sm text-muted-foreground">Subject:</p>
                    <p className="font-medium text-lg">{editedCampaign.subject}</p>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: editedCampaign.content }}
                    className="prose max-w-none"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      value={editedCampaign.name}
                      onChange={(e) =>
                        setEditedCampaign({
                          ...editedCampaign,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={editedCampaign.subject}
                      onChange={(e) =>
                        setEditedCampaign({
                          ...editedCampaign,
                          subject: e.target.value,
                        })
                      }
                      placeholder="Enter email subject"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Email Content Editor */}
              <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as "rich" | "html")}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="rich" className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Rich Editor
                    </TabsTrigger>
                    <TabsTrigger value="html" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      HTML Editor
                    </TabsTrigger>
                  </TabsList>

                  {editorMode === "html" && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => insertTemplate("welcome")}>
                        Welcome Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertTemplate("courseUpdate")}>
                        Course Update
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => insertTemplate("reminder")}>
                        Reminder
                      </Button>
                    </div>
                  )}
                </div>

                <TabsContent value="rich">
                  <RichTextEditor
                    content={editedCampaign.content}
                    onChange={(content) =>
                      setEditedCampaign({
                        ...editedCampaign,
                        content,
                      })
                    }
                    placeholder="Start creating your email content..."
                  />
                </TabsContent>

                <TabsContent value="html">
                  <Card>
                    <CardHeader>
                      <CardTitle>HTML Editor</CardTitle>
                      <CardDescription>
                        Edit the raw HTML code. Use variables like {"{"}firstName{"}"}, {"{"}lastName{"}"}, {"{"}
                        dashboardUrl{"}"} for personalization.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={editedCampaign.content}
                        onChange={(e) =>
                          setEditedCampaign({
                            ...editedCampaign,
                            content: e.target.value,
                          })
                        }
                        placeholder="Enter your email content (HTML supported)"
                        className="min-h-[500px] font-mono text-sm"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Recipients ({editedCampaign.targetUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserSelector
                users={users}
                selectedUsers={editedCampaign.targetUsers}
                onSelectionChange={(userIds) =>
                  setEditedCampaign({
                    ...editedCampaign,
                    targetUsers: userIds,
                  })
                }
              />

              {selectedUsers.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Selected Users:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedUsers.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 text-sm">
                        <Badge variant="outline">{user.role}</Badge>
                        <span>{user.name}</span>
                      </div>
                    ))}
                    {selectedUsers.length > 5 && (
                      <p className="text-xs text-muted-foreground">+{selectedUsers.length - 5} more users</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="schedule-email" />
                <Label htmlFor="schedule-email">Schedule for later</Label>
              </div>

              <div>
                <Label htmlFor="schedule-date">Date</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="schedule-time">Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>

              {scheduleDate && scheduleTime && (
                <Button className="w-full bg-transparent" variant="outline" onClick={handleSchedule}>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Campaign
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Campaign Stats */}
          {campaign.status === "sent" && (
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Open Rate:</span>
                  <span className="font-medium">{campaign.openRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Click Rate:</span>
                  <span className="font-medium">{campaign.clickRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sent:</span>
                  <span className="font-medium">{campaign.targetUsers.length}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
