"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react"

const materialTemplates = [
  { id: "medical_record", label: "진료기록부", description: "병원에서 발급받은 진료기록부" },
  { id: "accident_photo", label: "현장 사진", description: "사고 현장 사진" },
  { id: "visit_record", label: "통원 내역", description: "통원 치료 내역서" },
  { id: "receipt", label: "영수증", description: "치료비 영수증" },
  { id: "other", label: "기타", description: "기타 필요한 자료" },
]

// 샘플 의뢰 목록
const sampleRequests = [
  { id: 1, type: "자동차 사고", status: "상담 중", date: "2024-01-15" },
  { id: 2, type: "실손보험", status: "계약 완료", date: "2024-01-10" },
]

export default function RequestMaterialPage() {
  const router = useRouter()
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [customMessage, setCustomMessage] = useState("")

  const handleSend = () => {
    if (!selectedRequest || !selectedTemplate) {
      alert("의뢰와 자료 유형을 선택해주세요.")
      return
    }

    const template = materialTemplates.find((t) => t.id === selectedTemplate)
    const request = sampleRequests.find((r) => r.id === selectedRequest)

    if (confirm(`"${request?.type}" 의뢰에 "${template?.label}" 자료 요청을 보내시겠습니까?`)) {
      alert("자료 요청이 사용자에게 전송되었습니다. 푸시 알림이 발송됩니다.")
      router.back()
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <h1 className="text-lg font-bold text-foreground flex-1">자료 요청</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 의뢰 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">의뢰 선택</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sampleRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => setSelectedRequest(request.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedRequest === request.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-border hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">{request.type}</div>
                      <div className="text-sm text-muted-foreground">{request.date}</div>
                    </div>
                    <Badge
                      variant={request.status === "계약 완료" ? "success" : "warning"}
                      className="text-xs"
                    >
                      {request.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 자료 유형 선택 */}
        {selectedRequest && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">자료 유형 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {materialTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedTemplate === template.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-border hover:border-primary-300"
                    }`}
                  >
                    <div className="font-medium text-foreground">{template.label}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 추가 메시지 */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">추가 메시지 (선택)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="추가로 전달할 메시지를 입력하세요..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                기본 메시지: "손해사정사가 추가 자료({자료 유형})를 요청했습니다. 업로드 부탁드려요."
              </p>
            </CardContent>
          </Card>
        )}

        {/* 전송 버튼 */}
        {selectedRequest && selectedTemplate && (
          <Button
            onClick={handleSend}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            자료 요청 전송
          </Button>
        )}
      </div>
    </div>
  )
}
