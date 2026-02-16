"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { RefreshCw, Filter } from "lucide-react"
import Link from "next/link"

// 샘플 데이터
const sampleRequests = [
  {
    id: 1,
    type: "car",
    typeLabel: "자동차",
    location: "서울시 강남구",
    injury: "경증",
    timeAgo: "5분 전",
    estimatedAmount: "500만원",
  },
  {
    id: 2,
    type: "medical",
    typeLabel: "실손",
    location: "경기도 성남시",
    injury: "중증",
    timeAgo: "12분 전",
    estimatedAmount: "1,200만원",
  },
  {
    id: 3,
    type: "fire",
    typeLabel: "화재",
    location: "인천시 남동구",
    injury: "경증",
    timeAgo: "23분 전",
    estimatedAmount: "800만원",
  },
  {
    id: 4,
    type: "car",
    typeLabel: "자동차",
    location: "부산시 해운대구",
    injury: "사망",
    timeAgo: "1시간 전",
    estimatedAmount: "3,000만원",
  },
]

const injuryColors: Record<string, string> = {
  경증: "success",
  중증: "warning",
  사망: "destructive",
}

export default function Home() {
  const [requests] = useState(sampleRequests)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-title font-bold text-foreground">새 의뢰</h1>
        </div>
      </header>

      {/* 필터 */}
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0"
          >
            <Filter className="w-4 h-4 mr-1" />
            필터
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            전체 지역
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            전체 유형
          </Button>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            긴급도
          </Button>
        </div>
      </div>

      {/* 의뢰 목록 */}
      <div className="max-w-md mx-auto px-4 space-y-3 pb-4">
        {requests.length === 0 ? (
          <EmptyState
            title="새 의뢰가 없습니다"
            description="새로운 의뢰가 등록되면 여기에 표시됩니다"
          />
        ) : (
          requests.map((request) => (
            <Link key={request.id} href={`/requests/${request.id}`} className="block"> {/* ← className="block" 추가 */}
              <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5"> {/* 패딩을 4에서 5 정도로 살짝 늘려보세요 */}
                <div className="flex items-start justify-between mb-4 mt-1"> {/* mt-1 추가로 천장에서 살짝 떼기 */}
                  <div className="flex items-center gap-2">
                      <Badge variant={request.type as any}>
                        {request.typeLabel}
                      </Badge>
                      <Badge variant={injuryColors[request.injury] as any}>
                        {request.injury}
                      </Badge>
                    </div>
                    <span className="text-caption text-muted-foreground">
                      {request.timeAgo}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-body text-foreground">
                        📍 {request.location}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      예상 보상액: {request.estimatedAmount}
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    수락하기
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 active:bg-primary-700 transition-colors z-40"
        aria-label="의뢰 새로고침"
      >
        <RefreshCw className="w-6 h-6" />
      </button>
    </main>
  )
}
