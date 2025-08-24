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
            <div style={{ width: '100%', height: '100vh' }}>
                <iframe
                    src="http://35.240.246.47/"
                    title="OHIF Viewer"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    allowFullScreen
                />
            </div>
        </DashboardLayout>
    )
}
