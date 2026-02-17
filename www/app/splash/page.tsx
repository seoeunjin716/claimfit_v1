"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    // 1~2초 후 로그인 화면으로 이동
    const timer = setTimeout(() => {
      // 자동 로그인 체크 (토큰 있으면 홈으로, 없으면 로그인으로)
      const token = localStorage.getItem("auth_token")
      if (token) {
        router.push("/")
      } else {
        router.push("/login")
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-500">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center mb-4">
          <span className="text-4xl">⚖️</span>
        </div>
        <h1 className="text-3xl font-bold text-white">모두의 사정 - Claimfit 손해사정</h1>
        <p className="text-white/80 text-sm">모두의 사정을 말해주세요. 각각 사정에 맞는 손해사정 서비스를 제공합니다.</p>
        <div className="mt-8">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
