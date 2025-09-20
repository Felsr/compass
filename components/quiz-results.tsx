"use client"

import { RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

type QuizResultsProps = {
  answers: { [key: number]: string }
  onRestart: () => void
}

const careerProfiles = {
  analytical: {
    title: "The Analytical Thinker",
    description: "You excel at problem-solving, research, and logical thinking.",
    color: "text-blue-600",
  },
  creative: {
    title: "The Creative Innovator",
    description: "You thrive on creativity, innovation, and artistic expression.",
    color: "text-purple-600",
  },
  social: {
    title: "The People Helper",
    description: "You are passionate about helping others and making a difference.",
    color: "text-green-600",
  },
  leadership: {
    title: "The Natural Leader",
    description: "You excel at leading teams, making decisions, and driving results.",
    color: "text-orange-600",
  },
}

export function QuizResults({ answers, onRestart }: QuizResultsProps) {
  const counts: Record<keyof typeof careerProfiles, number> = {
    analytical: 0,
    creative: 0,
    social: 0,
    leadership: 0,
  }

  Object.values(answers).forEach((ans) => {
    if (ans in counts) {
      counts[ans as keyof typeof counts]++
    }
  })

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  const percentages: Record<keyof typeof careerProfiles, number> = {
    analytical: total ? Math.round((counts.analytical / total) * 100) : 0,
    creative: total ? Math.round((counts.creative / total) * 100) : 0,
    social: total ? Math.round((counts.social / total) * 100) : 0,
    leadership: total ? Math.round((counts.leadership / total) * 100) : 0,
  }

  const best = (Object.entries(percentages).sort((a, b) => b[1] - a[1])[0][0] ??
    "analytical") as keyof typeof careerProfiles

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg border">
            <h2 className={`text-xl font-semibold ${careerProfiles[best].color}`}>
              {careerProfiles[best].title}
            </h2>
            <p className="mt-2 text-gray-600">{careerProfiles[best].description}</p>
          </div>

          <div className="space-y-4">
            {Object.entries(careerProfiles).map(([key, profile]) => {
              const pct = percentages[key as keyof typeof careerProfiles]
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={profile.color}>{profile.title}</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              )
            })}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={onRestart} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Restart Quiz
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" /> Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
