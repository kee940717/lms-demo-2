"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Globe, Users, Calendar, Shield, AlertTriangle, Trash2, Archive } from "lucide-react"
import type { Course } from "@/lib/courses"
import { ShowToast } from "@/components/loading_notification/ShowToast"

interface CourseSettingsTabProps {
  course: Course
  onUpdate: (updates: Partial<Course>) => void
}

export function CourseSettingsTab({ course, onUpdate }: CourseSettingsTabProps) {
  const handleInputChange = (field: keyof Course, value: any) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Pricing
          </CardTitle>
          <CardDescription>Set the price for your course or make it free</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Course Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input id="price" type="number" placeholder="0.00" className="pl-8" step="0.01" />
              </div>
              <p className="text-sm text-muted-foreground">Set to $0 to make your course free</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="SGD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="discounts">Enable Discounts</Label>
                <p className="text-sm text-muted-foreground">Allow promotional pricing and coupons</p>
              </div>
              <Switch id="discounts" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bulk-pricing">Bulk Pricing</Label>
                <p className="text-sm text-muted-foreground">Offer discounts for institutional purchases</p>
              </div>
              <Switch id="bulk-pricing" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Access & Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Access & Enrollment
          </CardTitle>
          <CardDescription>Control who can access your course and how</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enrollment-type">Enrollment Type</Label>
            <Select defaultValue="open">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open Enrollment</SelectItem>
                <SelectItem value="approval">Requires Approval</SelectItem>
                <SelectItem value="invitation">Invitation Only</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-students">Maximum Students</Label>
            <Input id="max-students" type="number" placeholder="Unlimited" />
            <p className="text-sm text-muted-foreground">Leave empty for unlimited enrollment</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="certificate">Issue Certificates</Label>
                <p className="text-sm text-muted-foreground">Provide completion certificates to students</p>
              </div>
              <Switch id="certificate" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="prerequisites">Enforce Prerequisites</Label>
                <p className="text-sm text-muted-foreground">Students must complete required courses first</p>
              </div>
              <Switch id="prerequisites" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Course Schedule
          </CardTitle>
          <CardDescription>Set availability dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Course Start Date</Label>
              <Input id="start-date" type="datetime-local" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Course End Date</Label>
              <Input id="end-date" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollment-deadline">Enrollment Deadline</Label>
            <Input id="enrollment-deadline" type="datetime-local" />
            <p className="text-sm text-muted-foreground">Last date students can enroll in this course</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="self-paced">Self-Paced Learning</Label>
              <p className="text-sm text-muted-foreground">Students can complete at their own pace</p>
            </div>
            <Switch id="self-paced" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Privacy & Visibility
          </CardTitle>
          <CardDescription>Control course visibility and search settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility">Course Visibility</Label>
            <Select defaultValue="public">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Visible to everyone</SelectItem>
                <SelectItem value="unlisted">Unlisted - Only via direct link</SelectItem>
                <SelectItem value="private">Private - Invitation only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="searchable">Include in Search</Label>
                <p className="text-sm text-muted-foreground">Allow course to appear in search results</p>
              </div>
              <Switch id="searchable" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="preview">Allow Preview</Label>
                <p className="text-sm text-muted-foreground">Let students preview some content before enrolling</p>
              </div>
              <Switch id="preview" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reviews">Enable Reviews</Label>
                <p className="text-sm text-muted-foreground">Allow students to rate and review your course</p>
              </div>
              <Switch id="reviews" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Settings</CardTitle>
          <CardDescription>Configure how you communicate with students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="announcements">Course Announcements</Label>
                <p className="text-sm text-muted-foreground">Send updates and announcements to enrolled students</p>
              </div>
              <Switch id="announcements" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="discussions">Discussion Forums</Label>
                <p className="text-sm text-muted-foreground">Enable student discussions and Q&A</p>
              </div>
              <Switch id="discussions" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="direct-messages">Direct Messages</Label>
                <p className="text-sm text-muted-foreground">Allow students to message you directly</p>
              </div>
              <Switch id="direct-messages" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response-time">Expected Response Time</Label>
            <Select defaultValue="24h">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Within 1 hour</SelectItem>
                <SelectItem value="24h">Within 24 hours</SelectItem>
                <SelectItem value="48h">Within 48 hours</SelectItem>
                <SelectItem value="week">Within 1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Advanced Settings
          </CardTitle>
          <CardDescription>Additional course configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="download">Allow Content Download</Label>
                <p className="text-sm text-muted-foreground">Let students download course materials</p>
              </div>
              <Switch id="download" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mobile-app">Mobile App Access</Label>
                <p className="text-sm text-muted-foreground">Make course available in mobile apps</p>
              </div>
              <Switch id="mobile-app" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="offline">Offline Viewing</Label>
                <p className="text-sm text-muted-foreground">Allow students to download for offline viewing</p>
              </div>
              <Switch id="offline" />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="language">Primary Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="captions">Closed Captions</Label>
            <Select defaultValue="auto">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-generated</SelectItem>
                <SelectItem value="manual">Manually uploaded</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800 dark:text-red-200">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            Irreversible actions that will affect your course
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>These actions cannot be undone. Please proceed with caution.</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Archive Course</h4>
                <p className="text-sm text-red-700 dark:text-red-300">Hide course from students but keep all data</p>
              </div>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"  onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Delete Course</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Permanently delete this course and all its data
                </p>
              </div>
              <Button variant="destructive"  onClick={()=>ShowToast("Coming Soon", "This feature is under development")}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
