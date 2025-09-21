"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { UnifiedSidebar } from "@/components/unified-sidebar"
import { StudentDashboard } from "@/components/student-dashboard"
import { ParentDashboard } from "@/components/parent-dashboard-unified"
import { GovernmentDashboard } from "@/components/government-dashboard-unified"
import { DashboardHeader } from "@/components/dashboard-header"
import { toast } from "sonner"
import { AIGuidanceAgent } from "@/components/ai-guidance-agent"
import { supabase } from "@/lib/supabaseClient"

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState("student")
  const [language, setLanguage] = useState("en")
  const [userEmail, setUserEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const initDashboard = async () => {
      try {
        // 1. Check Supabase session
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          toast.error("Please sign in to access the dashboard")
          setTimeout(() => router.push("/"), 1000)
          return
        }

        const email = user.email || ""
        let role = user.user_metadata?.role || "student"

        // 2. Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role, email")
          .eq("id", user.id)
          .single()

        if (profileError || !profile) {
          // Insert profile if not found (first-time login, e.g. Google)
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email,
            role,
          })
          if (insertError) {
            console.error("Profile insert error:", insertError.message)
            toast.error("Error creating profile")
          } else {
            toast.success("Welcome! Your profile has been created 🎉")
          }
        } else {
          role = profile.role
        }

        // Map admin to government
        const mappedRole = role === "admin" ? "government" : role

        // Save locally
        localStorage.setItem("userRole", mappedRole)
        localStorage.setItem("userEmail", email)

        setActiveTab(mappedRole)
        setUserEmail(email)

        const roleLabel =
          mappedRole === "government"
            ? "Government Admin"
            : mappedRole.charAt(0).toUpperCase() + mappedRole.slice(1)

        toast.success(`Welcome to your ${roleLabel} Dashboard!`)
      } catch (err: any) {
        console.error("Dashboard init error:", err.message)
        toast.error("Error loading dashboard")
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    initDashboard()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    toast.success("Logged out successfully!")
    router.push("/")
  }

  const handleGoHome = () => {
    router.back()
  }

  const renderDashboard = () => {
    switch (activeTab) {
      case "student":
        return <StudentDashboard />
      case "parent":
        return <ParentDashboard />
      case "government":
        return <GovernmentDashboard />
      default:
        return <StudentDashboard />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <UnifiedSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDarkMode={theme === "dark"}
          setIsDarkMode={(mode) => setTheme(mode ? "dark" : "light")}
          language={language}
          setLanguage={setLanguage}
          userEmail={userEmail}
          onLogout={handleLogout}
          onGoHome={handleGoHome}
        />

        <div className="flex-1 flex flex-col">
          <DashboardHeader
            activeTab={activeTab}
            isDarkMode={theme === "dark"}
            setIsDarkMode={(mode) => setTheme(mode ? "dark" : "light")}
            language={language}
            setLanguage={setLanguage}
          />

          <main className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderDashboard()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AIGuidanceAgent
        userRole={activeTab as "student" | "parent" | "government"}
        currentSection={activeTab}
      />
    </div>
  )
}
