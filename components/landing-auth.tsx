"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

export function LandingAuth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const router = useRouter()

  // Handle email/password auth
  const handleSubmit = async (e: React.FormEvent, userType: string) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (authMode === "signup" && password !== confirmPassword) {
        toast.error("Passwords do not match!")
        setIsLoading(false)
        return
      }

      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role: userType } },
        })

        if (error) {
          console.error("Signup error:", error)
          throw error
        }

        if (data.user && !data.session) {
          toast.success("Account created! Check your email to confirm before logging in.")
        } else {
          toast.success("Account created! Redirecting...")
          setTimeout(() => {
            router.push(`/dashboard?role=${userType}`)
          }, 1500)
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.error("Signin error:", error)

          // If user not found, offer sign-up
          if (error.message.includes("Invalid login credentials")) {
            const shouldSignUp = window.confirm(
              "No account found with these credentials. Do you want to sign up instead?"
            )
            if (shouldSignUp) {
              setAuthMode("signup")
            }
          }

          throw error
        }

        toast.success(`Welcome back! Redirecting to your ${userType} dashboard...`)
        setTimeout(() => {
          router.push(`/dashboard?role=${userType}`)
        }, 1500)
      }
    } catch (error: any) {
      if (!error.message.includes("Invalid login credentials")) {
        toast.error(error.message || "Authentication failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google OAuth
  const handleGoogle = async (userType: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard?role=${userType}`,
        },
      })
      if (error) {
        console.error("Google sign-in error:", error)
        throw error
      }
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen"
    >
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">
            {authMode === "signin" ? "Sign In" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="parent">Parent</TabsTrigger>
            </TabsList>

            {["student", "parent"].map((role) => (
              <TabsContent key={role} value={role}>
                <form
                  onSubmit={(e) => handleSubmit(e, role)}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <Label htmlFor={`email-${role}`}>Email</Label>
                    <Input
                      id={`email-${role}`}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`password-${role}`}>Password</Label>
                    <Input
                      id={`password-${role}`}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {authMode === "signup" && (
                    <div>
                      <Label htmlFor={`confirm-${role}`}>Confirm Password</Label>
                      <Input
                        id={`confirm-${role}`}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Loading..."
                      : authMode === "signin"
                      ? "Sign In"
                      : "Sign Up"}
                  </Button>
                </form>

                <div className="flex items-center justify-center my-4">
                  <span className="text-sm text-muted-foreground">OR</span>
                </div>

                <Button
                  onClick={() => handleGoogle(role)}
                  className="w-full bg-red-500 text-white"
                >
                  Continue with Google
                </Button>
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center mt-4">
            {authMode === "signin" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setAuthMode("signup")}
                  className="text-blue-600"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setAuthMode("signin")}
                  className="text-blue-600"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
