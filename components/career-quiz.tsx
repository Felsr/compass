"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Brain,
  Target,
  Lightbulb,
} from "lucide-react"
import { QuizQuestion } from "./quiz-question"
import { QuizResults } from "./quiz-results"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

/** Strong types so TS doesn't complain later */
type QuizOption = { id: string; text: string; value: string }
type QuizItem = {
  id: number
  category: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  question: string
  options: QuizOption[]
}

const quizQuestions: QuizItem[] = [
  {
    id: 1,
    category: "Interests",
    icon: Brain,
    question: "What type of activities do you enjoy most?",
    options: [
      { id: "a", text: "Solving complex problems and puzzles", value: "analytical" },
      { id: "b", text: "Creating art, music, or writing", value: "creative" },
      { id: "c", text: "Helping and supporting others", value: "social" },
      { id: "d", text: "Leading teams and making decisions", value: "leadership" },
    ],
  },
  {
    id: 2,
    category: "Skills",
    icon: Target,
    question: "Which skill comes most naturally to you?",
    options: [
      { id: "a", text: "Mathematical and logical thinking", value: "analytical" },
      { id: "b", text: "Communication and presentation", value: "social" },
      { id: "c", text: "Innovation and creative thinking", value: "creative" },
      { id: "d", text: "Organization and planning", value: "leadership" },
    ],
  },
  {
    id: 3,
    category: "Work Environment",
    icon: Lightbulb,
    question: "What work environment appeals to you most?",
    options: [
      { id: "a", text: "Quiet office with focus on research", value: "analytical" },
      { id: "b", text: "Creative studio or flexible workspace", value: "creative" },
      { id: "c", text: "Community center or healthcare facility", value: "social" },
      { id: "d", text: "Corporate office or boardroom", value: "leadership" },
    ],
  },
  {
    id: 4,
    category: "Goals",
    icon: Target,
    question: "What motivates you the most?",
    options: [
      { id: "a", text: "Solving big challenges", value: "analytical" },
      { id: "b", text: "Expressing creativity", value: "creative" },
      { id: "c", text: "Making a difference in people’s lives", value: "social" },
      { id: "d", text: "Leading projects to success", value: "leadership" },
    ],
  },
]

export function CareerQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((s) => s + 1)
    } else {
      setIsCompleted(true)
      void saveResults() // fire-and-forget (we show results immediately)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((s) => s - 1)
  }

  const saveResults = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please log in to save quiz results")
        void router.push("/")
        return
      }

      const score = Object.values(answers).length
      const { error } = await supabase.from("quiz_results").insert([
        {
          user_id: user?.id,
          quiz_id: "career-quiz-1",
          score,
          answers: answers as any,
        },
      ])

      if (error) throw error
      toast.success("Quiz results saved successfully!")
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save results")
    } finally {
      setSaving(false)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsCompleted(false)
  }

  if (isCompleted) {
    return <QuizResults answers={answers} onRestart={handleRestart} />
  }

  const question = quizQuestions[currentQuestion]
  const Icon = question.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => router.back()}>
              Back
            </Button>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Career Quiz</h2>
                <Badge>{quizQuestions.length} Questions</Badge>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* Icon typed as React component so TS is happy */}
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                <CardTitle className="font-heading text-2xl sm:text-3xl text-foreground text-balance">
                  {question.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <QuizQuestion
                  question={{
                    id: question.id,
                    question: question.question,
                    options: question.options,
                  }}
                  selectedAnswer={answers[question.id] ?? undefined}
                  onAnswer={(value: string) => handleAnswer(question.id, value)}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6">
                  <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">
                      {Object.keys(answers).length}/{quizQuestions.length} answered
                    </div>

                    <Button onClick={handleNext} disabled={!answers[question.id]}>
                      {currentQuestion === quizQuestions.length - 1 ? (
                        <>
                          Finish <CheckCircle className="ml-2 w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Next <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {saving && <p className="text-center text-sm text-muted-foreground">Saving results…</p>}
      </div>
    </div>
  )
}
