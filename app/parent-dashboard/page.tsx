"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import { ParentSidebar } from "@/components/parent-sidebar"
import { WelcomeBanner } from "@/components/welcome-banner"
import { DegreeComparison } from "@/components/degree-comparison"
import { ParentSuccessStories } from "@/components/parent-success-stories"
import { CareerOutcomeExplorer } from "@/components/career-outcome-explorer"
import { ParentResources } from "@/components/parent-resources"
import { ParentROIInsights } from "@/components/parent-roi-insights"
import { CareerDashboard } from "@/components/career-dashboard"
import { Button } from "@/components/ui/button"
import { AIGuidanceAgent } from "@/components/ai-guidance-agent"

export default function ParentDashboardPage() {
  const [activeSection, setActiveSection] = useState("home")
  const [simplifiedMode, setSimplifiedMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          toast.error("Please sign in to access the Parent Dashboard")
          setTimeout(() => router.push("/"), 1000)
          return
        }

        const email = user.email || ""
        let role = user.user_metadata?.role || "parent"

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role, email")
          .eq("id", user.id)
          .single()

        if (profileError || !profile) {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email,
            role: "parent",
          })
          if (insertError) {
            console.error("Profile insert error:", insertError.message)
            toast.error("Error creating profile")
          } else {
            toast.success("Welcome! Profile created 🎉")
          }
        }

        setUserEmail(email)
        toast.success("Welcome to your Parent Dashboard!")
      } catch (err: any) {
        console.error("Parent Dashboard init error:", err.message)
        toast.error("Error loading dashboard")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    toast.success("Logged out successfully!")
    router.push("/")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-8">
            <WelcomeBanner simplifiedMode={simplifiedMode} />
            <DegreeComparison simplifiedMode={simplifiedMode} />
            <ParentSuccessStories simplifiedMode={simplifiedMode} />
          </div>
        )
      case "comparison":
        return <DegreeComparison simplifiedMode={simplifiedMode} />
      case "stories":
        return <ParentSuccessStories simplifiedMode={simplifiedMode} />
      case "explorer":
        return <CareerOutcomeExplorer simplifiedMode={simplifiedMode} />
      case "roi":
        return <ParentROIInsights simplifiedMode={simplifiedMode} />
      case "career-roi":
        return <CareerDashboard />
      case "resources":
        return <ParentResources simplifiedMode={simplifiedMode} />
      default:
        return (
          <div className="space-y-8">
            <WelcomeBanner simplifiedMode={simplifiedMode} />
            <DegreeComparison simplifiedMode={simplifiedMode} />
            <ParentSuccessStories simplifiedMode={simplifiedMode} />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Parent Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <ParentSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="flex-1 ml-64">
        <header className="bg-card border-b border-border p-4 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            Parent Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Simplified Mode</span>
              <Button
                variant={simplifiedMode ? "default" : "outline"}
                size="sm"
                onClick={() => setSimplifiedMode(!simplifiedMode)}
                className="h-8"
              >
                {simplifiedMode ? "ON" : "OFF"}
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>

      <AIGuidanceAgent userRole="parent" currentSection={activeSection} />
    </div>
  )
}
