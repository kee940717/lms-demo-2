"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  ZoomIn,
  Move,
  Ruler,
  RotateCw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Eye,
  MousePointer,
  Square,
  Circle,
} from "lucide-react"

interface DicomFallbackViewerProps {
  imageIds: string[]
  currentImageIndex?: number
  onImageChange?: (index: number) => void
  className?: string
}

export function DicomFallbackViewer({
  imageIds,
  currentImageIndex = 0,
  onImageChange,
  className = "",
}: DicomFallbackViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [windowLevel, setWindowLevel] = useState([400])
  const [windowWidth, setWindowWidth] = useState([1000])
  const [activeTool, setActiveTool] = useState("wwwc")

  const handleImageChange = (index: number) => {
    setCurrentIndex(index)
    if (onImageChange) {
      onImageChange(index)
    }
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // Implement playback logic here
  }

  const applyPreset = (preset: string) => {
    const presets = {
      lung: { center: -600, width: 1600 },
      bone: { center: 300, width: 1500 },
      brain: { center: 40, width: 80 },
      abdomen: { center: 50, width: 350 },
    }

    if (preset in presets) {
      const { center, width } = presets[preset as keyof typeof presets]
      setWindowLevel([center])
      setWindowWidth([width])
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="medical-card">
        <CardContent className="p-4 space-y-4">
          {/* DICOM Display Area */}
          <div className="relative">
            <div className="dicom-viewer w-full h-96 bg-black flex items-center justify-center relative overflow-hidden">
              <div className="text-white text-center space-y-4">
                <Eye className="h-16 w-16 mx-auto opacity-50" />
                <div>
                  <p className="text-lg font-medium">DICOM Viewer (Fallback Mode)</p>
                  <p className="text-sm opacity-75">
                    Image {currentIndex + 1} of {imageIds.length}
                  </p>
                  <p className="text-xs opacity-60 mt-2">Zoom: {zoom}%</p>
                </div>
              </div>

              {/* Sample medical image overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-20"></div>
              <div className="absolute inset-4 border border-gray-600 rounded opacity-30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-700 rounded-full opacity-40"></div>
            </div>

            {/* Image Overlay Info */}
            <div className="absolute top-4 left-4 text-white text-xs space-y-1 bg-black/50 p-2 rounded">
              <div>
                Image: {currentIndex + 1}/{imageIds.length}
              </div>
              <div>
                WC: {windowLevel[0]} WW: {windowWidth[0]}
              </div>
              <div>Zoom: {zoom}%</div>
              <div>Sample DICOM Data</div>
            </div>

            {/* Active Tool Indicator */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {activeTool.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Tool Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={activeTool === "wwwc" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("wwwc")}
                title="Window/Level"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "pan" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("pan")}
                title="Pan"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "zoom" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("zoom")}
                title="Zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "measure" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("measure")}
                title="Measure"
              >
                <Ruler className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "rectangle" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("rectangle")}
                title="Rectangle ROI"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "ellipse" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("ellipse")}
                title="Elliptical ROI"
              >
                <Circle className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" title="Rotate">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" title="Reset">
                Reset
              </Button>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleImageChange(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={togglePlayback}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleImageChange(Math.min(imageIds.length - 1, currentIndex + 1))}
              disabled={currentIndex === imageIds.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Navigation */}
          <div className="space-y-2">
            <Label className="text-sm">Image Navigation</Label>
            <Slider
              value={[currentIndex]}
              onValueChange={(value) => handleImageChange(value[0])}
              max={imageIds.length - 1}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground text-center">
              Image {currentIndex + 1} of {imageIds.length}
            </div>
          </div>

          {/* Window/Level Controls */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="space-y-2">
              <Label className="text-xs">Window Level: {windowLevel[0]}</Label>
              <Slider value={windowLevel} onValueChange={setWindowLevel} max={2000} min={-1000} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Window Width: {windowWidth[0]}</Label>
              <Slider value={windowWidth} onValueChange={setWindowWidth} max={4000} min={1} step={1} />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset("lung")}>
              Lung
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("bone")}>
              Bone
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("brain")}>
              Brain
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("abdomen")}>
              Abdomen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
