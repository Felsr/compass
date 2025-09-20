"use client"

import React, { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

type Role = "student" | "parent"
type AuthMode = "signin" | "signup"

export function LandingAuth() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<AuthMode>("signin")
  const [selectedRole, setSelectedRole] = useState<Role>("student")
  const router = useRouter()

  // Single submit handler — reads selectedRole from state
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (authMode === "signup" && password !== confirmPassword) {
        toast.error("Passwords do not match!")
        setIsLoading(false)
        return
      }

      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: selectedRole },
          },
        })
        if (error) throw error
        toast.success("Account created! Check your email to confirm.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success(`Welcome back! Redirecting to your ${selectedRole} dashboard...`)
        setTimeout(() => {
          void router.push(`/dashboard?role=${selectedRole}`)
        }, 1200)
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      // Use explicit env var for site URL (set this in Vercel + .env.local)
      const redirectBase = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectBase}/dashboard?role=${selectedRole}`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex justify-center items-center min-h-screen p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {authMode === "signin" ? "Sign In" : "Sign Up"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Role selector */}
          <div className="flex gap-2 justify-center mb-4">
            <Button
              type="button"
              variant={selectedRole === "student" ? "default" : "ghost"}
              onClick={() => setSelectedRole("student")}
            >
              Student
            </Button>
            <Button
              type="button"
              variant={selectedRole === "parent" ? "default" : "ghost"}
              onClick={() => setSelectedRole("parent")}
            >
              Parent
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {authMode === "signup" && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : authMode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="flex items-center justify-center my-4 text-sm">
            <span className="text-muted-foreground">OR</span>
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            className="w-full bg-red-600 text-white"
          >
            Continue with Google
          </Button>

          <div className="text-center mt-4">
            {authMode === "signin" ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
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
                  type="button"
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
