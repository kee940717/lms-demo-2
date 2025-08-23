"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CornerstoneViewer } from "./cornerstone-viewer"
import { CheckCircle, XCircle, Clock, BookOpen, ArrowRight, ArrowLeft, Target } from "lucide-react"
import MinimalViewer from "./MinimalViewer"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  imageInfo: {
    modality: string
    bodyPart: string
    studyDate: string
    findings: string[]
    imageIds: string[]
  }
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  timeLimit: number
}

// Working sample images for the quiz
const CHEST_IMAGES = [
  "dicomweb:https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs/studies/1.3.6.1.4.1.14519.5.2.1.6279.6001.298806137288633453246975630178/series/1.3.6.1.4.1.14519.5.2.1.6279.6001.179049373636438705059720603192/instances/1.3.6.1.4.1.14519.5.2.1.6279.6001.140385619276781208041974844324/frames/1",
  // "https://tools.cornerstonejs.org/examples/assets/image_02.jpg",
  // "https://tools.cornerstonejs.org/examples/assets/image_03.jpg",
]

const BRAIN_IMAGES = [
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/assets/image_01.jpg",
  "https://raw.githubusercontent.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/assets/image_02.jpg",
]

const ABDOMINAL_IMAGES = [
  "https://tools.cornerstonejs.org/examples/assets/image_02.jpg",
  "https://tools.cornerstonejs.org/examples/assets/image_03.jpg",
]

const LOCAL_DICOM_IMAGE = ["wadouri:/test.DCM", "wadouri:/test3.DCM", "wadouri:/test2.DCM"]; // Adjust the path as needed


const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Based on the medical images shown, what is the most likely pathological finding?",
    options: ["Normal anatomy", "Inflammatory changes", "Mass lesion", "Vascular abnormality"],
    correctAnswer: 2,
    explanation:
      "The images demonstrate a space-occupying lesion with characteristic imaging features. The heterogeneous appearance and mass effect are consistent with a pathological mass rather than normal anatomy or simple inflammatory changes.",
    imageInfo: {
      modality: "CT",
      bodyPart: "Chest",
      studyDate: "2024-01-15",
      findings: ["Space-occupying lesion", "Heterogeneous enhancement", "Mass effect present"],
      imageIds: LOCAL_DICOM_IMAGE,
    },
    difficulty: "Medium",
    category: "Chest Imaging",
    timeLimit: 120,
  },
  {
    id: 2,
    question: "What imaging characteristic is most concerning in this case?",
    options: ["Symmetrical appearance", "Homogeneous density", "Irregular borders", "Uniform enhancement"],
    correctAnswer: 2,
    explanation:
      "Irregular borders are a concerning feature that often indicates malignant potential. Unlike benign lesions which typically have smooth, well-defined borders, malignant lesions frequently demonstrate irregular, spiculated, or ill-defined margins.",
    imageInfo: {
      modality: "MRI",
      bodyPart: "Brain",
      studyDate: "2024-01-20",
      findings: ["Irregular lesion borders", "Heterogeneous signal", "Surrounding edema"],
      imageIds: BRAIN_IMAGES,
    },
    difficulty: "Hard",
    category: "Neuroradiology",
    timeLimit: 180,
  },
  {
    id: 3,
    question: "What is the most appropriate next imaging study for this patient?",
    options: [
      "Follow-up in 6 months",
      "Contrast-enhanced study",
      "Different imaging plane",
      "No further imaging needed",
    ],
    correctAnswer: 1,
    explanation:
      "A contrast-enhanced study would provide additional information about the lesion's vascularity and enhancement pattern, which is crucial for characterization and differential diagnosis. This helps distinguish between different pathological processes.",
    imageInfo: {
      modality: "CT",
      bodyPart: "Abdomen",
      studyDate: "2024-01-18",
      findings: ["Hypodense lesion", "Well-defined borders", "No obvious enhancement"],
      imageIds: ABDOMINAL_IMAGES,
    },
    difficulty: "Easy",
    category: "Abdominal Imaging",
    timeLimit: 90,
  },
]

export function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(quizQuestions[0].timeLimit)
  const [isActive, setIsActive] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeLeft > 0 && !showAnswer) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleSubmitAnswer()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, showAnswer])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(question.timeLimit)
    setIsActive(true)
    setCurrentImageIndex(0)
  }, [currentQuestion, question.timeLimit])

  const handleSubmitAnswer = () => {
    if (!selectedAnswer && timeLeft > 0) return

    setShowAnswer(true)
    setIsActive(false)

    if (Number.parseInt(selectedAnswer) === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
      setShowAnswer(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer("")
      setShowAnswer(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  if (currentQuestion >= quizQuestions.length) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="medical-card text-center p-8">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>You've completed all questions in this quiz session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-primary">
              {score}/{quizQuestions.length}
            </div>
            <div className="text-lg text-muted-foreground">
              Score: {Math.round((score / quizQuestions.length) * 100)}%
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => {
                  setCurrentQuestion(0)
                  setScore(0)
                  setSelectedAnswer("")
                  setShowAnswer(false)
                }}
              >
                Retake Quiz
              </Button>
              <Button variant="outline">Review Answers</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interactive Medical Image Quiz</h1>
          <p className="text-muted-foreground">Analyze medical images and answer diagnostic questions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Badge>
          <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
        </div>
      </div>

      {/* Progress and Timer */}
      <Card className="medical-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`text-sm font-mono ${timeLeft <= 30 ? "text-red-600" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Score: {score}/{currentQuestion + (showAnswer ? 1 : 0)}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Medical Image Viewer */}
        <div className="space-y-4">
          <CornerstoneViewer
            imageIds={question.imageInfo.imageIds}
            currentImageIndex={currentImageIndex}
            onImageChange={setCurrentImageIndex}
          />


          {/* Case Information */}
          <Card className="medical-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Case Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Modality:</span> {question.imageInfo.modality}
                </div>
                <div>
                  <span className="font-medium">Body Part:</span> {question.imageInfo.bodyPart}
                </div>
                <div>
                  <span className="font-medium">Study Date:</span> {question.imageInfo.studyDate}
                </div>
                <div>
                  <span className="font-medium">Images:</span> {question.imageInfo.imageIds.length}
                </div>
              </div>
              <div>
                <span className="font-medium">Key Findings:</span>
                <ul className="mt-1 space-y-1">
                  {question.imageInfo.findings.map((finding, index) => (
                    <li key={index} className="text-muted-foreground">
                      • {finding}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Panel */}
        <div className="space-y-6">
          {/* Question */}
          <Card className="medical-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Question
                </CardTitle>
                <Badge variant="outline">{question.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base font-medium leading-relaxed">{question.question}</p>

              {/* Answer Options */}
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    let optionClass = "quiz-option"
                    if (showAnswer) {
                      if (index === question.correctAnswer) {
                        optionClass += " correct"
                      } else if (Number.parseInt(selectedAnswer) === index) {
                        optionClass += " incorrect"
                      }
                    } else if (selectedAnswer === index.toString()) {
                      optionClass += " selected"
                    }

                    return (
                      <div key={index} className={optionClass}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                            {option}
                          </label>
                          {showAnswer && index === question.correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {showAnswer &&
                            Number.parseInt(selectedAnswer) === index &&
                            index !== question.correctAnswer && <XCircle className="h-5 w-5 text-red-600" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </RadioGroup>

              {/* Submit Button */}
              {!showAnswer && (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full medical-button">
                  Submit Answer
                </Button>
              )}

              {/* Explanation */}
              {showAnswer && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-blue-900 dark:text-blue-100">Explanation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{question.explanation}</p>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              {showAnswer && (
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button onClick={handleNextQuestion} className="medical-button">
                    {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
