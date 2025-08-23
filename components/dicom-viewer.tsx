"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ZoomIn,
  ZoomOut,
  Move,
  Ruler,
  MessageSquare,
  Save,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Eye,
  Contrast,
} from "lucide-react"
import { CornerstoneViewer } from "./cornerstone-viewer"

interface DicomViewerProps {
  imageIds?: string[]
  className?: string
}

export function DicomViewer({ imageIds, className }: DicomViewerProps) {
  const [currentSlice, setCurrentSlice] = useState([45])
  const [windowLevel, setWindowLevel] = useState([400])
  const [windowWidth, setWindowWidth] = useState([1000])
  const [isPlaying, setIsPlaying] = useState(false)
  const [diagnosis, setDiagnosis] = useState("")
  const [annotations, setAnnotations] = useState<string[]>([])

  const caseInfo = {
    patientId: "PAT-2024-001",
    studyDate: "2024-01-15",
    modality: "CT",
    bodyPart: "Chest",
    slices: 89,
    description: "Chest CT with contrast for evaluation of pulmonary nodules",
  }

  const teachingPoints = [
    "Look for ground-glass opacities in the peripheral lung zones",
    "Assess mediastinal lymph nodes for enlargement",
    "Evaluate pleural surfaces for effusion or thickening",
    "Check for pulmonary embolism in contrast-enhanced studies",
  ]

  return (
    <div className={`h-full space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">DICOM Viewer</h1>
          <p className="text-muted-foreground">Interactive medical image viewer with real DICOM support</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{caseInfo.modality}</Badge>
          <Badge variant="outline">{caseInfo.bodyPart}</Badge>
        </div>
      </div>

      {/* Cornerstone Viewer */}
      <CornerstoneViewer imageIds={imageIds} className={className} />

      <div className="flex-1 grid lg:grid-cols-4 gap-4">
        {/* Main Viewer */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Case Viewer</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Move className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Ruler className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* DICOM Image Placeholder */}
              <div className="aspect-square bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-white text-center">
                  <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">DICOM Image Viewer</p>
                  <p className="text-sm opacity-75">
                    Slice {currentSlice[0]} of {caseInfo.slices}
                  </p>
                </div>

                {/* Overlay Controls */}
                <div className="absolute top-4 left-4 text-white text-sm space-y-1">
                  <div>Patient: {caseInfo.patientId}</div>
                  <div>Study: {caseInfo.studyDate}</div>
                  <div>
                    WL: {windowLevel[0]} WW: {windowWidth[0]}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button variant="outline" size="sm">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Slice Navigation */}
              <div className="mt-4 space-y-2">
                <Label>Slice Navigation</Label>
                <Slider
                  value={currentSlice}
                  onValueChange={setCurrentSlice}
                  max={caseInfo.slices}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Window/Level Controls */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Contrast className="h-5 w-5 mr-2" />
                Window/Level Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Window Level: {windowLevel[0]}</Label>
                  <Slider value={windowLevel} onValueChange={setWindowLevel} max={2000} min={-1000} step={10} />
                </div>
                <div className="space-y-2">
                  <Label>Window Width: {windowWidth[0]}</Label>
                  <Slider value={windowWidth} onValueChange={setWindowWidth} max={4000} min={1} step={10} />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Lung
                </Button>
                <Button variant="outline" size="sm">
                  Bone
                </Button>
                <Button variant="outline" size="sm">
                  Soft Tissue
                </Button>
                <Button variant="outline" size="sm">
                  Brain
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Case Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <strong>Patient ID:</strong> {caseInfo.patientId}
              </div>
              <div>
                <strong>Study Date:</strong> {caseInfo.studyDate}
              </div>
              <div>
                <strong>Modality:</strong> {caseInfo.modality}
              </div>
              <div>
                <strong>Body Part:</strong> {caseInfo.bodyPart}
              </div>
              <div>
                <strong>Slices:</strong> {caseInfo.slices}
              </div>
              <div className="pt-2">
                <strong>Description:</strong>
                <p className="text-muted-foreground mt-1">{caseInfo.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Points */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Teaching Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32">
                <ul className="space-y-2 text-sm">
                  {teachingPoints.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Diagnosis Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Diagnosis</CardTitle>
              <CardDescription>Enter your diagnostic impression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your diagnostic findings and impression..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Submit
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuss
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Case Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Previous Case
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Next Case
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Random Case
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
