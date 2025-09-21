"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export type Profile = {
  id: string
  email: string
  role: "student" | "parent"
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setProfile(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Profile fetch error:", error.message)
        setProfile(null)
      } else {
        setProfile(data as Profile)
      }
      setLoading(false)
    }

    getProfile()

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      getProfile()
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  return { profile, loading }
}
