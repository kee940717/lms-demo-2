import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Eye, Mail, Trophy } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Next-Generation Medical Education
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent h-[60px]">
            RadiologyLMS
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Advanced Learning Management System for radiology education with integrated DICOM viewer, marketing
            automation, and gamification features.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Upload videos, PDFs, create quizzes and manage live sessions</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Eye className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>DICOM Viewer</CardTitle>
              <CardDescription>Integrated radiology viewer supporting MG, MRI, CT, and US images</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Mail className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Marketing Automation</CardTitle>
              <CardDescription>Email campaigns, user segmentation, and analytics tracking</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Gamification</CardTitle>
              <CardDescription>Points, badges, leaderboards, and challenges to boost engagement</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-muted-foreground">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
              <div className="text-muted-foreground">DICOM Cases</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Medical Education?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of medical professionals advancing their radiology skills with our comprehensive platform.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </section>
    </div>
  )
}
