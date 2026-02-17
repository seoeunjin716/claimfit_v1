"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (provider: "kakao" | "naver" | "google") => {
    setIsLoading(true)
    // TODO: 실제 소셜 로그인 연동
    // 임시로 토큰 저장 후 홈으로 이동
    setTimeout(() => {
      localStorage.setItem("auth_token", `mock_token_${provider}`)
      localStorage.setItem("has_seen_onboarding", "false")
      router.push("/onboarding")
    }, 500)
  }

  const handleGuestMode = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 상단: 로고 + 슬로건 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">⚖️</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">모두의 사정 - Claimfit 손해사정</h1>
          <p className="text-body text-muted-foreground">
            모두의 사정을 말해주세요. 각각 사정에 맞는 손해사정 서비스를 제공합니다.
          </p>
        </div>

        {/* 중앙: 소셜 로그인 버튼 */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {/* 카카오 로그인 (1위, 가장 크게) */}
          <Button
            onClick={() => handleSocialLogin("kakao")}
            disabled={isLoading}
            className="w-full h-14 bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 text-base font-medium"
          >
            {isLoading ? "손해사정사가 기다리고 있어요..." : "카카오로 로그인"}
          </Button>

          {/* 네이버 로그인 */}
          <Button
            onClick={() => handleSocialLogin("naver")}
            disabled={isLoading}
            className="w-full h-12 bg-[#03C75A] text-white hover:bg-[#03C75A]/90"
          >
            네이버로 로그인
          </Button>

          {/* Google 로그인 */}
          <Button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12"
          >
            Google로 로그인
          </Button>
        </div>

        {/* 하단: 비회원 둘러보기 */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            onClick={handleGuestMode}
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            로그인 없이 둘러보기
          </Button>

          <div className="text-center text-xs text-muted-foreground space-y-2">
            <p>
              로그인 시{" "}
              <Link href="/terms" className="underline">
                이용약관
              </Link>
              과{" "}
              <Link href="/privacy" className="underline">
                개인정보 처리방침
              </Link>
              에 동의하게 됩니다.
            </p>
            <p className="text-[10px]">
              본 앱은 [손해사정사 이름] 손해사정사의 개인 서비스 제공 도구로,<br />
              어떠한 중개 수수료도 받지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
