"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    // 스플래시 화면으로 리다이렉트
    router.push("/splash")
  }, [router])

  return null
}
