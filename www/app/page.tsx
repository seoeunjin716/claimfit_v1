"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, FileText, Scale, Upload, MessageSquare, FileCheck, Search } from "lucide-react"
import Link from "next/link"

// 샘플 데이터
const expertProfile = {
  name: "김고수",
  photo: "👨‍💼",
  increaseRate: "180%",
  successCases: 247,
  rating: 4.9,
}

const quickActions = [
  {
    id: 1,
    title: "의뢰 신청하기",
    description: "사고 정보 입력",
    icon: FileText,
    href: "/requests",
    color: "text-primary-500",
  },
  {
    id: 2,
    title: "판례 검색",
    description: "법률 자문 확인",
    icon: Scale,
    href: "/cases",
    color: "text-[#16A34A]",
  },
  {
    id: 3,
    title: "증권 제출 확인",
    description: "자료 관리",
    icon: Upload,
    href: "/requests",
    color: "text-primary-500",
  },
  {
    id: 4,
    title: "AI 상담 먼저",
    description: "빠른 상담 시작",
    icon: MessageSquare,
    href: "/consult",
    color: "text-[#16A34A]",
  },
]

export default function Home() {
  const router = useRouter()
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true)

  useEffect(() => {
    // 로그인 체크
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/login")
      return
    }

    // 온보딩 체크
    const seen = localStorage.getItem("has_seen_onboarding")
    if (seen !== "true") {
      router.push("/onboarding")
    }
    setHasSeenOnboarding(seen === "true")
  }, [router])

  const handleQuickConsult = () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      if (confirm("손해사정사와 상담하려면 로그인해주세요.")) {
        router.push("/login")
      }
      return
    }
    router.push("/consult")
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20">
      <div className="max-w-md mx-auto px-5">
        {/* 상단 40% 영역 - 손해사정사 브랜딩 집중 */}
        <div className="pt-10 pb-8">
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-8 text-center">
              {/* 원형 프로필 사진 */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-[#F9FAFB] rounded-full flex items-center justify-center text-5xl border-2 border-[#E5E7EB]">
                  {expertProfile.photo}
                </div>
              </div>

              {/* 이름 */}
              <h2 className="text-[28px] font-bold text-[#1F2937] mb-3 leading-[1.2]">
                {expertProfile.name}
              </h2>

              {/* 뱃지 */}
              <div className="mb-6">
                <Badge className="bg-[#F3F4F6] text-[#4B5563] text-xs font-normal px-3 py-1 border-0">
                  직접 수임 · 개인 운영
                </Badge>
              </div>

              {/* 주요 지표 (가로 2열) */}
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#16A34A] mb-1">
                    {expertProfile.increaseRate}
                  </div>
                  <div className="text-sm text-[#6B7280]">평균 증액률</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1F2937] mb-1">
                    {expertProfile.successCases}건
                  </div>
                  <div className="text-sm text-[#6B7280]">성공 케이스</div>
                </div>
              </div>

              {/* 슬로건 */}
              <p className="text-base text-[#4B5563] leading-[1.5] mt-6">
                모두의 사정을 말해주세요.<br />
                각각 사정에 맞는 손해사정 서비스를 제공합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 중앙 30% 영역 - 즉시 행동 유도 */}
        <div className="mb-8">
          {/* 빠른 상담 시작 버튼 */}
          <Button
            onClick={handleQuickConsult}
            className="w-full h-14 text-base font-semibold rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white mb-2"
          >
            빠른 상담 시작
          </Button>
          <p className="text-center text-sm text-[#6B7280] mb-8">
            AI로 먼저 상담받고 손해사정사와 연결
          </p>

          {/* 기능 바로가기 카드 그룹 (2열 그리드) */}
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.id} href={action.href}>
                  <Card className="rounded-lg bg-white shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6 text-center flex flex-col justify-start pt-6">
                      <div className={`flex justify-center mb-3 ${action.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-medium text-[#1F2937] mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-[1.4]">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 하단 30% 영역 - 신뢰 지표 & 보조 콘텐츠 */}
        <div className="mb-6">
          {/* 통계 한 줄 카드 (가로 3열) */}
          <Card className="rounded-lg bg-white shadow-sm border-0 mb-6">
            <CardContent className="p-6 flex flex-col justify-start pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#1F2937] mb-1">
                    {expertProfile.successCases}건
                  </div>
                  <div className="text-xs text-[#6B7280]">성공 케이스</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#16A34A] mb-1">
                    {expertProfile.increaseRate}
                  </div>
                  <div className="text-xs text-[#6B7280]">평균 증액률</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#1F2937] mb-1 flex items-center justify-center gap-1">
                    {expertProfile.rating}
                    <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  </div>
                  <div className="text-xs text-[#6B7280]">평균 평점</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* "손해사정사가 책임집니다" 문구 카드 */}
          <Card className="rounded-lg bg-[#EFF6FF] border-0">
            <CardContent className="p-6 text-center flex flex-col justify-start pt-6">
              <p className="text-base text-[#1F2937] leading-[1.5]">
                전문가가 직접 상담하고 보상을 책임집니다
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 하단 여백 */}
        <div className="h-6" />
      </div>
    </main>
  )
}
