"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { EnrollmentInsights } from "@/components/enrollment-insights"
import { StudentInterestsHeatmap } from "@/components/student-interests-heatmap"
import { SupplyDemandAnalysis } from "@/components/supply-demand-analysis"
import { AdminAlerts } from "@/components/admin-alerts"
import { QuickMetrics } from "@/components/quick-metrics"
import { Button } from "@/components/ui/button"
import { AIGuidanceAgent } from "@/components/ai-guidance-agent"

export default function AdminDashboard() {
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
          toast.error("Please sign in to access the Admin Dashboard")
          setTimeout(() => router.push("/"), 1000)
          return
        }

        const email = user.email || ""
        let role = user.user_metadata?.role || "admin"

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, role, email")
          .eq("id", user.id)
          .single()

        if (profileError || !profile) {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email,
            role: "admin",
          })
          if (insertError) {
            console.error("Profile insert error:", insertError.message)
            toast.error("Error creating profile")
          } else {
            toast.success("Welcome! Profile created 🎉")
          }
        }

        setUserEmail(email)
        toast.success("Welcome to your Admin Dashboard!")
      } catch (err: any) {
        console.error("Admin Dashboard init error:", err.message)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border bg-card">
          <AdminHeader />
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                Government Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor enrollment trends, student interests, and educational supply-demand
                analytics
              </p>
            </div>

            <QuickMetrics />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EnrollmentInsights />
              <StudentInterestsHeatmap />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SupplyDemandAnalysis />
              </div>
              <AdminAlerts />
            </div>
          </div>
        </main>
      </div>
      <AIGuidanceAgent userRole="government" currentSection="analytics" />
    </div>
  )
}
