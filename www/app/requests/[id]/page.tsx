"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, FileText, Image as ImageIcon } from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [showContact, setShowContact] = useState(false)
  const { id } = use(params)
  const { addChat } = useChat()

  // 샘플 데이터 - 실제로는 API에서 가져올 데이터
  // 의뢰 ID에 따라 다른 데이터를 반환하도록 시뮬레이션
  const requestData: Record<string, any> = {
    "1": {
      type: "car",
      typeLabel: "자동차 사고",
      location: "서울시 강남구 테헤란로 123",
      description: "교차로에서 좌회전 중 정면 충돌 사고 발생",
      injury: "경증",
      birthDate: "1990-01-15",
      contact: "010-****-5678",
      estimatedAmount: "500만원",
      clientName: "홍길동",
    },
    "2": {
      type: "medical",
      typeLabel: "실손보험",
      location: "경기도 성남시 분당구",
      description: "병원 입원 치료 중 발생한 사고",
      injury: "중증",
      birthDate: "1985-03-20",
      contact: "010-****-1234",
      estimatedAmount: "1,200만원",
      clientName: "김영희",
    },
    "3": {
      type: "fire",
      typeLabel: "화재 사고",
      location: "인천시 남동구",
      description: "아파트 화재로 인한 재산 피해",
      injury: "경증",
      birthDate: "1992-07-10",
      contact: "010-****-5678",
      estimatedAmount: "800만원",
      clientName: "박민수",
    },
    "4": {
      type: "car",
      typeLabel: "자동차 사고",
      location: "부산시 해운대구",
      description: "고속도로 추돌 사고",
      injury: "사망",
      birthDate: "1978-11-25",
      contact: "010-****-9999",
      estimatedAmount: "3,000만원",
      clientName: "이철수",
    },
  }

  const request = {
    id: id,
    ...requestData[id] || requestData["1"],
    attachments: [
      { id: 1, type: "image", name: "사고현장1.jpg" },
      { id: 2, type: "image", name: "사고현장2.jpg" },
      { id: 3, type: "document", name: "진단서.pdf" },
    ],
  }

  // 의뢰 수락 및 채팅 시작 핸들러
  const handleAcceptAndChat = () => {
    // 채팅 생성
    const chatId = addChat(
      request.id,
      request.clientName,
      request.typeLabel
    )
    
    // 채팅 상세 페이지로 이동
    router.push(`/chat/${chatId}`)
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-title font-bold text-foreground flex-1">
            의뢰 상세
          </h1>
          <Button size="sm" variant="outline">
            수락하기
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="car">{request.typeLabel}</Badge>
                <Badge variant="success">{request.injury}</Badge>
              </div>
              <div className="text-body text-foreground">
                <div className="mb-2">📍 {request.location}</div>
                <div className="mb-2">{request.description}</div>
                <div className="text-sm text-muted-foreground">
                  생년월일: {request.birthDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 의뢰인 연락처 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-5 h-5" />
              의뢰인 연락처
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showContact ? (
              <div className="text-body">{request.contact}</div>
            ) : (
              <div className="space-y-3">
                <div className="text-body text-muted-foreground">
                  {request.contact}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowContact(true)}
                >
                  연락처 공개하기
                </Button>
                <p className="text-caption text-muted-foreground">
                  의뢰를 수락하면 연락처가 공개됩니다
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 첨부 파일 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              첨부 파일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {request.attachments.map((file: { id: number; type: string; name: string }) => (
                <div
                  key={file.id}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                >
                  {file.type === "image" ? (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-caption text-muted-foreground mt-2">
              {request.attachments.length}개의 파일
            </p>
          </CardContent>
        </Card>

        {/* 예상 보상액 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">예상 보상액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-500 mb-2">
              {request.estimatedAmount}
            </div>
            <p className="text-caption text-muted-foreground">
              AI 추정치입니다. 내 판단으로 수정 가능합니다.
            </p>
          </CardContent>
        </Card>

        {/* 하단 버튼 - 모바일/데스크톱 반응형 */}
        <div className={cn(
          "space-y-2 pb-4",
          "sm:space-y-3",
          "lg:max-w-2xl lg:mx-auto"
        )}>
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleAcceptAndChat}
            aria-label="의뢰 수락하고 채팅 시작"
          >
            수락하고 채팅 시작
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={() => router.back()}
            aria-label="의뢰 건너뛰기"
          >
            건너뛰기
          </Button>
        </div>
      </div>
    </main>
  )
}
