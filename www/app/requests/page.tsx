"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import Link from "next/link"

const statusTabs = ["전체", "진행중", "완료", "보류"]

const requests = [
  {
    id: 1,
    type: "car",
    typeLabel: "자동차",
    location: "서울시 강남구",
    status: "진행중",
    progress: 60,
  },
  {
    id: 2,
    type: "medical",
    typeLabel: "실손",
    location: "경기도 성남시",
    status: "진행중",
    progress: 30,
  },
  {
    id: 3,
    type: "fire",
    typeLabel: "화재",
    location: "인천시 남동구",
    status: "완료",
    progress: 100,
  },
]

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState("전체")

  const filteredRequests =
    activeTab === "전체"
      ? requests
      : requests.filter((req) => req.status === activeTab)

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-title font-bold text-foreground">의뢰 관리</h1>
        </div>
      </header>

      {/* 상태 탭 */}
      <div className="sticky top-[57px] z-30 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-primary-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 의뢰 목록 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {filteredRequests.length === 0 ? (
          <EmptyState
            title="의뢰가 없습니다"
            description="새로운 의뢰를 수락하면 여기에 표시됩니다"
          />
        ) : (
          filteredRequests.map((request) => (
            <Link key={request.id} href={`/requests/${request.id}`} className="block"> {/* ← className="block" 추가 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={request.type as any}>
                        {request.typeLabel}
                      </Badge>
                      <Badge
                        variant={
                          request.status === "완료"
                            ? "success"
                            : request.status === "보류"
                            ? "warning"
                            : "default"
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="text-body text-foreground">
                      📍 {request.location}
                    </div>
                    {request.status === "진행중" && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">진행률</span>
                          <span className="text-foreground font-medium">
                            {request.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${request.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full">
                    상세보기
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  )
}
