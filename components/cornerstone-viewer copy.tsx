"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import {
  ZoomIn,
  ZoomOut,
  Move,
  Ruler,
  RotateCw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Square,
  Circle,
  MousePointer,
  Maximize,
} from "lucide-react"
import { DicomFallbackViewer } from "./dicom-fallback-viewer"

// Cornerstone.js types and interfaces
interface CornerstoneImage {
  imageId: string
  minPixelValue: number
  maxPixelValue: number
  slope: number
  intercept: number
  windowCenter: number
  windowWidth: number
  rows: number
  columns: number
  color: boolean
  columnPixelSpacing: number
  rowPixelSpacing: number
  sizeInBytes: number
}

interface CornerstoneViewport {
  scale: number
  translation: { x: number; y: number }
  voi: { windowWidth: number; windowCenter: number }
  invert: boolean
  pixelReplication: boolean
  rotation: number
  hflip: boolean
  vflip: boolean
}

interface CornerstoneElement extends HTMLElement {
  cornerstone?: any
}

interface DicomViewerProps {
  imageIds: string[]
  currentImageIndex?: number
  onImageChange?: (index: number) => void
  className?: string
}

// Working sample images - using web-compatible formats first, then DICOM
const SAMPLE_IMAGE_URLS = [
  // Web images that work with cornerstone-web-image-loader
  "https://tools.cornerstonejs.org/examples/assets/image_01.jpg",
  "https://tools.cornerstonejs.org/examples/assets/image_02.jpg",
  "https://tools.cornerstonejs.org/examples/assets/image_03.jpg",
  // Medical sample images
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/assets/image_01.jpg",
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/assets/image_02.jpg",
]

// Alternative DICOM URLs that should work
const DICOM_SAMPLE_URLS = [
  "dicomweb:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.6279.6001.298806137288633453246975630178/series/1.3.6.1.4.1.14519.5.2.1.6279.6001.179049373636438705059720603192/instances/1.3.6.1.4.1.14519.5.2.1.6279.6001.140385619276781208041974844324/frames/1",
  "dicomweb:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.6279.6001.298806137288633453246975630178/series/1.3.6.1.4.1.14519.5.2.1.6279.6001.179049373636438705059720603192/instances/1.3.6.1.4.1.14519.5.2.1.6279.6001.235811649328646362776401703474/frames/1",
]

export function CornerstoneViewer({
  imageIds = SAMPLE_IMAGE_URLS,
  currentImageIndex = 0,
  onImageChange,
  className = "",
}: DicomViewerProps) {
  const elementRef = useRef<CornerstoneElement>(null)
  const [cornerstone, setCornerstone] = useState<any>(null)
  const [cornerstoneTools, setCornerstoneTools] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playInterval, setPlayInterval] = useState<NodeJS.Timeout | null>(null)
  const [viewport, setViewport] = useState<CornerstoneViewport | null>(null)
  const [imageInfo, setImageInfo] = useState<CornerstoneImage | null>(null)
  const [activeTool, setActiveTool] = useState<string>("wwwc")
  const [librariesLoaded, setLibrariesLoaded] = useState(false)
  const [toolsInitialized, setToolsInitialized] = useState(false)

  // Initialize Cornerstone
  useEffect(() => {
    // Keep a reference to the element for cleanup
    const element = elementRef.current;
    let isInitialized = false; // Flag to prevent cleanup if init fails

    const initCornerstone = async () => {
      try {
        // Prevent re-initialization if already done
        if (!element || window.cornerstone?.getEnabledElement(element)?.element) {
          return;
        }

        await loadScript("https://unpkg.com/dicom-parser@1.8.21/dist/dicomParser.min.js");
        await loadScript("https://unpkg.com/cornerstone-core@2.6.1/dist/cornerstone.min.js");
        await loadScript("https://unpkg.com/hammerjs@2.0.8/hammer.min.js");
        await loadScript("https://unpkg.com/cornerstone-tools@6.0.10/dist/cornerstoneTools.min.js");
        await loadScript("https://unpkg.com/cornerstone-web-image-loader@2.1.1/dist/cornerstoneWebImageLoader.min.js");

        try {
          await loadScript("https://unpkg.com/cornerstone-wado-image-loader@4.13.2/dist/cornerstoneWADOImageLoader.bundle.min.js");
        } catch (err) {
          console.warn("WADO Image Loader failed to load, continuing with web images only");
        }
        
        // Use a shorter timeout to ensure libraries are available on the window object
        setTimeout(() => {
          if (window.cornerstone && window.cornerstoneTools && window.cornerstoneWebImageLoader) {
            setCornerstone(window.cornerstone);
            setCornerstoneTools(window.cornerstoneTools);
            setLibrariesLoaded(true);
            isInitialized = true; // Mark as initialized for cleanup
          } else {
            setError("Failed to initialize Cornerstone libraries");
            setIsLoading(false);
          }
        }, 100); // Reduced timeout

      } catch (err) {
        console.error("Error loading Cornerstone libraries:", err);
        setError("Failed to load Cornerstone.js libraries");
        setIsLoading(false);
      }
    };

    initCornerstone();

    // --- THIS IS THE CRITICAL CLEANUP FUNCTION ---
    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
      // Only run cleanup if the element was successfully initialized
      if (isInitialized && element && window.cornerstone) {
        try {
          // Disable the element to remove all event listeners and canvases
          console.log("Disabling cornerstone element for cleanup");
          window.cornerstone.disable(element);
        } catch (err) {
            console.error("Error during cornerstone cleanup:", err);
        }
      }
    };
  }, []); // <-- The dependency array should be empty to run only on mount/unmount

  // Initialize viewer when libraries are loaded
  useEffect(() => {
    if (librariesLoaded && !toolsInitialized) {
      initializeViewer()
    }
  }, [librariesLoaded, toolsInitialized])

  // Helper function to load scripts
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })
  }

  const initializeViewer = useCallback(async () => {
    if (!cornerstone || !cornerstoneTools || !elementRef.current) {
      console.log("Missing dependencies for viewer initialization")
      return
    }

    try {
      const element = elementRef.current

      // Configure Web Image Loader (always available)
      if (window.cornerstoneWebImageLoader) {
        window.cornerstoneWebImageLoader.external.cornerstone = cornerstone

        // Register the web image loader
        cornerstone.registerImageLoader("http", window.cornerstoneWebImageLoader.loadImage)
        cornerstone.registerImageLoader("https", window.cornerstoneWebImageLoader.loadImage)
      }

      // Configure WADO Image Loader if available
      if (window.cornerstoneWADOImageLoader && window.dicomParser) {
        window.cornerstoneWADOImageLoader.external.cornerstone = cornerstone
        window.cornerstoneWADOImageLoader.external.dicomParser = window.dicomParser

        // Register DICOM loaders
        cornerstone.registerImageLoader("wadouri", window.cornerstoneWADOImageLoader.wadouri.loadImage)
        cornerstone.registerImageLoader("dicomweb", window.cornerstoneWADOImageLoader.wadors.loadImage)

        // Configure web workers for better performance
        const config = {
          maxWebWorkers: navigator.hardwareConcurrency || 1,
          startWebWorkersOnDemand: true,
          taskConfiguration: {
            decodeTask: {
              initializeCodecsOnStartup: false,
              usePDFJS: false,
              strict: false,
            },
          },
        }

        // Initialize web worker manager if available
        if (window.cornerstoneWADOImageLoader.webWorkerManager) {
          window.cornerstoneWADOImageLoader.webWorkerManager.initialize(config)
        }
      }

      // Enable the element for Cornerstone
      cornerstone.enable(element)

      // Initialize Cornerstone Tools with proper configuration
      cornerstoneTools.external.cornerstone = cornerstone
      cornerstoneTools.external.cornerstoneMath = cornerstoneTools.external.cornerstoneMath || cornerstone
      cornerstoneTools.external.Hammer = cornerstoneTools.external.Hammer || window.Hammer

      // Initialize tools
      cornerstoneTools.init()

      // Add tools with proper configuration
      const toolsToAdd = [
        { name: 'Wwwc', tool: cornerstoneTools.WwwcTool },
        { name: 'Pan', tool: cornerstoneTools.PanTool },
        { name: 'Zoom', tool: cornerstoneTools.ZoomTool },
        { name: 'Length', tool: cornerstoneTools.LengthTool },
        { name: 'RectangleRoi', tool: cornerstoneTools.RectangleRoiTool },
        { name: 'EllipticalRoi', tool: cornerstoneTools.EllipticalRoiTool },
        { name: 'ZoomMouseWheel', tool: cornerstoneTools.ZoomMouseWheelTool },
        { name: 'StackScrollMouseWheel', tool: cornerstoneTools.StackScrollMouseWheelTool }
      ]

      // Add each tool
      toolsToAdd.forEach(({ name, tool }) => {
        if (tool) {
          cornerstoneTools.addTool(tool)
          console.log(`Added tool: ${name}`)
        } else {
          console.warn(`Tool ${name} not found in cornerstoneTools`)
        }
      })

      // Set initial tool states - use correct method names
      cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 }) // Left mouse button for Pan
      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 }) // Right mouse button for Zoom
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 }) // Middle mouse button for Window/Level
      cornerstoneTools.setToolActive('ZoomMouseWheel', {}) // Activate wheel zoom
      cornerstoneTools.setToolActive('StackScrollMouseWheel', {}) // Activate stack scroll

      // Set up event listeners for viewport updates
      element.addEventListener('cornerstoneimagerendered', () => {
        const currentViewport = cornerstone.getViewport(element)
        setViewport(currentViewport)
      })
      element.addEventListener("cornerstoneviewportchanged", handleViewportChanged)

      element.addEventListener('cornerstonetoolsmeasurementadded', (e) => {
        console.log('Measurement added:', e.detail)
      })

      element.addEventListener('cornerstonetoolsmeasurementmodified', (e) => {
        console.log('Measurement modified:', e.detail)
      })

      setToolsInitialized(true)

      // Load the first image
      await loadImage(currentIndex)

      setIsLoading(false)
    } catch (err) {
      console.error("Error initializing viewer:", err)
      setError(`Failed to initialize DICOM viewer: ${err.message}`)
      setIsLoading(false)
    }
  }, [cornerstone, cornerstoneTools, currentIndex])

  const handleViewportChanged = useCallback((event: Event) => {
    const customEvent = event as CustomEvent
    console.log(event)
    setViewport(customEvent.detail.viewport)
  }, [])

  const loadImage = useCallback(
    async (index: number) => {
      if (!cornerstone || !elementRef.current || !imageIds[index]) return

      try {
        setIsLoading(true)
        const element = elementRef.current
        let imageId = imageIds[index]

        // If the imageId doesn't have a scheme, assume it's a web image
        if (!imageId.includes(":")) {
          imageId = `https:${imageId}`
        }

        console.log("Loading image:", imageId)

        // Load and display the image
        const image = await cornerstone.loadImage(imageId)
        cornerstone.displayImage(element, image)

        // Get viewport and image info
        const viewport = cornerstone.getViewport(element)
        setViewport(viewport)
        setImageInfo(image)
        setCurrentIndex(index)

        if (onImageChange) {
          onImageChange(index)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error loading image:", err)

        // Try to load a fallback image if the original fails
        if (index === 0 && imageIds.length > 1) {
          console.log("Trying next image...")
          await loadImage(1)
        } else {
          setError(`Failed to load image ${index + 1}: ${err.message}`)
          setIsLoading(false)
        }
      }
    },
    [cornerstone, imageIds, onImageChange],
  )

  // Tool handlers with better error handling
  const setTool = useCallback(
    (toolName: string) => {
      if (!cornerstoneTools || !toolsInitialized) {
        console.warn('Tools not initialized yet');
        return;
      }

      try {
        // Define the tools that should be active on the LEFT mouse button.
        const primaryMouseTools = [
          'Pan',
          'Length',
          'RectangleRoi',
          'EllipticalRoi',
          'Wwwc',
        ];

        // Deactivate all primary tools. This ensures only one is active on the left mouse button.
        primaryMouseTools.forEach(tool => {
          cornerstoneTools.setToolPassive(tool);
        });

        // Activate the desired tool on the left mouse button.
        cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });

        // IMPORTANT: This logic does NOT touch tools on other buttons like 'Zoom' (right-click)
        // or 'ZoomMouseWheel', so they remain active.

        setActiveTool(toolName.toLowerCase());
        console.log(`Activated tool: ${toolName}`);

      } catch (err) {
        console.error("Error setting tool:", err);
        setError(`Failed to activate tool: ${toolName}`);
      }
    },
    [cornerstoneTools, toolsInitialized],
  );

  // Fixed zoom functions with proper error handling and state updates
  const zoomIn = useCallback(() => {
    if (!cornerstone || !elementRef.current) {
      console.warn('Cornerstone not initialized')
      return
    }

    try {
      const element = elementRef.current
      const currentViewport = cornerstone.getViewport(element)

      if (!currentViewport) {
        console.warn('No viewport available')
        return
      }

      const newViewport = {
        ...currentViewport,
        scale: Math.min(currentViewport.scale * 1.25, 10) // Limit max zoom to 10x
      }

      cornerstone.setViewport(element, newViewport)
      setViewport(newViewport)
      console.log('Zoomed in to:', newViewport.scale)
    } catch (err) {
      console.error("Error zooming in:", err)
      setError('Failed to zoom in')
    }
  }, [cornerstone])

  const zoomOut = useCallback(() => {
    if (!cornerstone || !elementRef.current) {
      console.warn('Cornerstone not initialized')
      return
    }

    try {
      const element = elementRef.current
      const currentViewport = cornerstone.getViewport(element)

      if (!currentViewport) {
        console.warn('No viewport available')
        return
      }

      const newViewport = {
        ...currentViewport,
        scale: Math.max(currentViewport.scale / 1.25, 0.1) // Limit min zoom to 0.1x
      }

      cornerstone.setViewport(element, newViewport)
      setViewport(newViewport)
      console.log('Zoomed out to:', newViewport.scale)
    } catch (err) {
      console.error("Error zooming out:", err)
      setError('Failed to zoom out')
    }
  }, [cornerstone])

  const fitToWindow = useCallback(() => {
    if (!cornerstone || !elementRef.current) {
      console.warn('Cornerstone not initialized')
      return
    }

    try {
      const element = elementRef.current

      // Use cornerstone's built-in fit to window function
      cornerstone.fitToWindow(element)

      // Get the updated viewport
      const newViewport = cornerstone.getViewport(element)
      setViewport(newViewport)
      console.log('Fitted to window, new scale:', newViewport.scale)
    } catch (err) {
      console.error("Error fitting to window:", err)
      setError('Failed to fit to window')
    }
  }, [cornerstone])

  const rotateImage = useCallback(() => {
    if (!cornerstone || !elementRef.current) {
      console.warn('Cornerstone not initialized')
      return
    }

    try {
      const element = elementRef.current
      const currentViewport = cornerstone.getViewport(element)

      if (!currentViewport) {
        console.warn('No viewport available')
        return
      }

      const newViewport = {
        ...currentViewport,
        rotation: (currentViewport.rotation + 90) % 360
      }

      cornerstone.setViewport(element, newViewport)
      setViewport(newViewport)
      console.log('Rotated to:', newViewport.rotation, 'degrees')
    } catch (err) {
      console.error("Error rotating image:", err)
      setError('Failed to rotate image')
    }
  }, [cornerstone])

  const resetView = useCallback(() => {
    if (!cornerstone || !elementRef.current) {
      console.warn('Cornerstone not initialized')
      return
    }

    try {
      const element = elementRef.current

      // Reset the viewport to default values
      cornerstone.reset(element)

      // Get the updated viewport
      const newViewport = cornerstone.getViewport(element)
      setViewport(newViewport)
      console.log('View reset')
    } catch (err) {
      console.error("Error resetting view:", err)
      setError('Failed to reset view')
    }
  }, [cornerstone])

  const adjustWindowLevel = useCallback(
    (windowCenter: number, windowWidth: number) => {
      if (!cornerstone || !elementRef.current) {
        console.warn('Cornerstone not initialized')
        return
      }

      try {
        const element = elementRef.current
        const currentViewport = cornerstone.getViewport(element)

        if (!currentViewport) {
          console.warn('No viewport available')
          return
        }

        const newViewport = {
          ...currentViewport,
          voi: { windowCenter, windowWidth },
        }

        cornerstone.setViewport(element, newViewport)
        setViewport(newViewport)
      } catch (err) {
        console.error("Error adjusting window/level:", err)
        setError('Failed to adjust window/level')
      }
    },
    [cornerstone],
  )

  // Playback controls
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      if (playInterval) {
        clearInterval(playInterval)
        setPlayInterval(null)
      }
      setIsPlaying(false)
    } else {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % imageIds.length
          loadImage(nextIndex)
          return nextIndex
        })
      }, 500) // Slower playback for demo
      setPlayInterval(interval)
      setIsPlaying(true)
    }
  }, [isPlaying, playInterval, imageIds.length, loadImage])

  const goToImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < imageIds.length) {
        loadImage(index)
      }
    },
    [imageIds.length, loadImage],
  )

  // Preset window/level settings
  const presets = {
    lung: { center: -600, width: 1600 },
    bone: { center: 300, width: 1500 },
    brain: { center: 40, width: 80 },
    abdomen: { center: 50, width: 350 },
  }

  const applyPreset = useCallback(
    (preset: keyof typeof presets) => {
      const { center, width } = presets[preset]
      adjustWindowLevel(center, width)
    },
    [adjustWindowLevel],
  )

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card className="medical-card border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">DICOM Viewer Error</p>
                <p className="text-sm">{error}</p>
                <p className="text-xs mt-1">Using fallback viewer mode</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <DicomFallbackViewer
          imageIds={imageIds}
          currentImageIndex={currentImageIndex}
          onImageChange={onImageChange}
          className={className}
        />
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Viewer Container */}
      <Card className="medical-card">
        <CardContent className="p-4 space-y-4">
          {/* DICOM Display Area */}
          <div className="relative">
            <div
              ref={elementRef}
              className="dicom-viewer w-full h-96 bg-black flex items-center justify-center"
              style={{ minHeight: "400px" }}
            >
              {isLoading && (
                <div className="text-white text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading medical image...</p>
                  <p className="text-xs opacity-75 mt-1">
                    {toolsInitialized ? "Loading image data..." : "Initializing viewer..."}
                  </p>
                </div>
              )}
            </div>

            {/* Image Overlay Info */}
            {imageInfo && viewport && (
              <div className="absolute top-4 left-4 text-white text-xs space-y-1 bg-black/50 p-2 rounded">
                <div>
                  Image: {currentIndex + 1}/{imageIds.length}
                </div>
                <div>
                  WC: {Math.round(viewport.voi.windowCenter)} WW: {Math.round(viewport.voi.windowWidth)}
                </div>
                <div>Zoom: {Math.round(viewport.scale * 100)}%</div>
                <div>
                  Size: {imageInfo.columns}x{imageInfo.rows}
                </div>
              </div>
            )}

            {/* Active Tool Indicator */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                {activeTool.toUpperCase()} {!toolsInitialized && "(Loading...)"}
              </Badge>
            </div>
          </div>

          {/* Tool Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={activeTool === "wwwc" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("Wwwc")}
                disabled={!toolsInitialized}
                title="Window/Level"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "pan" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("Pan")}
                disabled={!toolsInitialized}
                title="Pan"
              >
                <Move className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "zoom" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("Zoom")}
                disabled={!toolsInitialized}
                title="Zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "length" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("Length")}
                disabled={!toolsInitialized}
                title="Measure"
              >
                <Ruler className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "rectangleroi" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("RectangleRoi")}
                disabled={!toolsInitialized}
                title="Rectangle ROI"
              >
                <Square className="h-4 w-4" />
              </Button>
              <Button
                variant={activeTool === "ellipticalroi" ? "default" : "outline"}
                size="sm"
                onClick={() => setTool("EllipticalRoi")}
                disabled={!toolsInitialized}
                title="Elliptical ROI"
              >
                <Circle className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={!cornerstone || !elementRef.current}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={!cornerstone || !elementRef.current}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fitToWindow}
                disabled={!cornerstone || !elementRef.current}
                title="Fit to Window"
              >
                <Maximize className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rotateImage}
                disabled={!cornerstone || !elementRef.current}
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetView}
                disabled={!cornerstone || !elementRef.current}
                title="Reset"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToImage(currentIndex - 1)}
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
              onClick={() => goToImage(currentIndex + 1)}
              disabled={currentIndex === imageIds.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Slice Navigation */}
          <div className="space-y-2">
            <Label className="text-sm">Image Navigation</Label>
            <Slider
              value={[currentIndex]}
              onValueChange={(value) => goToImage(value[0])}
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
          {viewport && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <Label className="text-xs">Window Center: {Math.round(viewport.voi.windowCenter)}</Label>
                <Slider
                  value={[viewport.voi.windowCenter]}
                  onValueChange={(value) => adjustWindowLevel(value[0], viewport.voi.windowWidth)}
                  max={2000}
                  min={-1000}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Window Width: {Math.round(viewport.voi.windowWidth)}</Label>
                <Slider
                  value={[viewport.voi.windowWidth]}
                  onValueChange={(value) => adjustWindowLevel(viewport.voi.windowCenter, value[0])}
                  max={4000}
                  min={1}
                  step={1}
                />
              </div>
            </div>
          )}

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

// Global type declarations for Cornerstone
declare global {
  interface Window {
    cornerstone: any
    cornerstoneTools: any
    cornerstoneWebImageLoader: any
    cornerstoneWADOImageLoader: any
    dicomParser: any
    Hammer: any
  }
}