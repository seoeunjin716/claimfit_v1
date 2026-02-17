"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const onboardingSlides = [
  {
    title: "손해사정사의 실제 성공 사례를 먼저 보세요",
    description: "다양한 사고 유형별 증액 사례를 확인하고, 나의 케이스와 비교해보세요.",
    icon: "📊",
  },
  {
    title: "간단 상담으로 시작하고 손해사정사와 연결",
    description: "AI 챗봇으로 빠르게 상담받고, 필요시 손해사정사에게 직접 연결됩니다.",
    icon: "💬",
  },
  {
    title: "의뢰 신청 → 빠른 계약 → 보상 증액",
    description: "간편한 의뢰 신청부터 계약, 그리고 보상 증액까지 한 번에 처리하세요.",
    icon: "🚀",
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem("has_seen_onboarding", "true")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 스킵 버튼 */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={handleSkip}>
          건너뛰기
        </Button>
      </div>

      {/* 슬라이드 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center px-6">
        <Card className="w-full max-w-sm">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">{onboardingSlides[currentSlide].icon}</div>
            <h2 className="text-2xl font-bold text-foreground">
              {onboardingSlides[currentSlide].title}
            </h2>
            <p className="text-body text-muted-foreground">
              {onboardingSlides[currentSlide].description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mb-8">
        {onboardingSlides.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-8 bg-primary-500"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* 다음/시작하기 버튼 */}
      <div className="px-6 pb-8">
        <Button onClick={handleNext} className="w-full h-14 text-base">
          {currentSlide === onboardingSlides.length - 1 ? "시작하기" : "다음"}
        </Button>
      </div>
    </div>
  )
}
