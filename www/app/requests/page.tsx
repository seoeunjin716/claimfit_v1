"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"

type TabType = "new" | "progress" | "completed"

const sampleRequests = {
  new: [],
  progress: [
    {
      id: 1,
      type: "자동차 사고",
      status: "상담 중",
      date: "2024-01-15",
      estimatedAmount: "500만원",
    },
    {
      id: 2,
      type: "실손보험",
      status: "계약 완료",
      date: "2024-01-10",
      estimatedAmount: "1,200만원",
    },
  ],
  completed: [
    {
      id: 3,
      type: "화재 보험",
      status: "완료",
      date: "2023-12-20",
      finalAmount: "800만원",
      increaseRate: "150%",
    },
  ],
}

export default function RequestsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("new")

  const handleNewRequest = () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      if (confirm("의뢰를 신청하려면 로그인해주세요.")) {
        router.push("/login")
      }
      return
    }
    router.push("/requests/new")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-title font-bold text-foreground">의뢰</h1>
        </div>
      </header>

      {/* 탭 */}
      <div className="max-w-md mx-auto border-b border-border">
        <div className="flex">
          {[
            { id: "new" as TabType, label: "신청하기" },
            { id: "progress" as TabType, label: "진행 중" },
            { id: "completed" as TabType, label: "완료" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

{/* 컨텐츠 영역 */}
<div className="max-w-md mx-auto px-4 flex flex-col min-h-[calc(100vh-120px)] pt-6"> 
  {/* flex flex-col: 수직 구조 생성
      min-h-[calc(100vh-120px)]: 화면 전체 높이에서 탭 높이를 뺀 만큼 차지하여 중앙 정렬 기반 마련
  */}
  
  {activeTab === "new" && (
    <div className="flex-1 flex flex-col justify-center py-12"> 
      {/* flex-1: 남은 공간을 다 차지함
          justify-center: 세로 방향 중앙 정렬
          py-12: 상하단에 넉넉한 여백(약 48px) 추가
      */}
      <Card className="shadow-sm border-gray-100">
        <CardContent className="p-10 min-h-[220px] flex flex-col justify-start pt-8 text-center">
          <h2 className="text-xl font-semibold mb-4 leading-tight">
            간편한 의뢰 신청으로<br />
            손해사정사에게 직접 연결하세요
          </h2>
          <Button onClick={handleNewRequest} className="w-full h-14 text-lg font-medium mb-4">
            의뢰 신청하기
          </Button>
          <p className="text-sm text-muted-foreground">
            약 5분이면 완료됩니다
          </p>
        </CardContent>
      </Card>
    </div>
  )}


        {activeTab === "progress" && (
          <div className="space-y-6">
            {sampleRequests.progress.length === 0 ? (
              <EmptyState
                title="진행 중인 의뢰가 없습니다"
                description="새로운 의뢰를 신청해보세요"
              />
            ) : (
              sampleRequests.progress.map((request) => (
                <Link key={request.id} href={`/requests/${request.id}`}>
                  <Card>
                    <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">
                            {request.type}
                          </h3>
                          <Badge
                            variant={
                              request.status === "계약 완료" ? "success" : "warning"
                            }
                            className="text-xs"
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {request.date}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        예상 보상액: {request.estimatedAmount}
                      </div>
                      {request.status === "계약 완료" && (
                        <Button variant="outline" className="w-full" size="sm">
                          전자계약서 확인
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-6">
            {sampleRequests.completed.length === 0 ? (
              <EmptyState
                title="완료된 의뢰가 없습니다"
                description="의뢰를 신청하고 진행해보세요"
              />
            ) : (
              sampleRequests.completed.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {request.type}
                        </h3>
                        <Badge variant="success" className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {request.date}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">최종 보상액: </span>
                        <span className="font-bold text-success">
                          {request.finalAmount}
                        </span>
                      </div>
                      <div className="text-xs text-primary-500">
                        증액률: ↑ {request.increaseRate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
