"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Eye, Send } from "lucide-react"

type DocumentFormData = {
  accidentDate: string
  accidentLocation: string
  treatmentCost: string
  consolationMoney: string
  businessLoss: string
  injuryLevel: string
  increaseItems: string[]
}

const increaseItemOptions = [
  "치료비 전액 청구",
  "후유장해 인정",
  "휴업손해 인정",
  "정신적 손해",
  "간병비",
  "치료비 상승분",
]

export default function DocumentCreatePage() {
  const router = useRouter()
  const params = useParams()
  const [formData, setFormData] = useState<DocumentFormData>({
    accidentDate: "",
    accidentLocation: "",
    treatmentCost: "",
    consolationMoney: "",
    businessLoss: "",
    injuryLevel: "",
    increaseItems: [],
  })
  const [previewMode, setPreviewMode] = useState(false)

  const toggleIncreaseItem = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      increaseItems: prev.increaseItems.includes(item)
        ? prev.increaseItems.filter((i) => i !== item)
        : [...prev.increaseItems, item],
    }))
  }

  const handleGenerate = () => {
    // TODO: 실제 PDF 생성 로직
    setPreviewMode(true)
  }

  const handleSend = () => {
    if (confirm("손해사정사에게 사정서 초안을 전송하시겠습니까?")) {
      // TODO: 실제 전송 로직
      alert("사정서 초안이 손해사정사에게 전송되었습니다.")
      router.push(`/requests/${params.id}`)
    }
  }

  const isFormValid = () => {
    return (
      formData.accidentDate &&
      formData.accidentLocation &&
      formData.treatmentCost &&
      formData.injuryLevel
    )
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* 헤더 */}
        <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(false)}
              className="p-2 -ml-2"
              aria-label="뒤로가기"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-foreground flex-1">사정서 미리보기</h1>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
          {/* PDF 미리보기 영역 */}
          <Card>
            <CardContent className="p-5">
              <div className="aspect-[210/297] bg-white border-2 border-border rounded-lg p-6 space-y-4 overflow-y-auto">
                {/* 워터마크 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-muted-foreground">초안</p>
                    <p className="text-sm text-muted-foreground">법적 효력 없음</p>
                  </div>
                </div>

                {/* 사정서 내용 */}
                <div className="relative space-y-4">
                  <div className="text-center border-b border-border pb-4">
                    <h2 className="text-xl font-bold">손해사정서</h2>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">사고 일시: </span>
                      <span>{formData.accidentDate || "입력 필요"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">사고 장소: </span>
                      <span>{formData.accidentLocation || "입력 필요"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">부상 정도: </span>
                      <span>{formData.injuryLevel || "입력 필요"}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-2">피해 금액</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>치료비:</span>
                        <span>{formData.treatmentCost || "0"}원</span>
                      </div>
                      {formData.consolationMoney && (
                        <div className="flex justify-between">
                          <span>위자료:</span>
                          <span>{formData.consolationMoney}원</span>
                        </div>
                      )}
                      {formData.businessLoss && (
                        <div className="flex justify-between">
                          <span>휴업손해:</span>
                          <span>{formData.businessLoss}원</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {formData.increaseItems.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h3 className="font-semibold mb-2">증액 희망 항목</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {formData.increaseItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-8">
                    <p className="text-xs text-muted-foreground text-center">
                      본 문서는 초안이며 법적 효력이 없습니다. 손해사정사의 최종 검토 및 서명이 필요합니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 하단 버튼 */}
          <div className="space-y-3">
            <Button
              onClick={() => setPreviewMode(false)}
              variant="outline"
              className="w-full h-12"
            >
              수정하기
            </Button>
            <Button
              onClick={handleSend}
              className="w-full h-12 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              손해사정사에게 전송
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-40">
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
          <h1 className="text-lg font-bold text-foreground flex-1">사정서 초안 생성</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-6">
              핵심 정보를 입력하면 사정서 초안이 자동으로 생성됩니다.
            </p>

            <div className="space-y-5">
              {/* 사고 일시 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  사고 일시
                </label>
                <input
                  type="datetime-local"
                  value={formData.accidentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, accidentDate: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* 사고 장소 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  사고 장소
                </label>
                <input
                  type="text"
                  value={formData.accidentLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, accidentLocation: e.target.value })
                  }
                  placeholder="예: 서울시 강남구 테헤란로 123"
                  className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* 피해 금액 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  치료비
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.treatmentCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        treatmentCost: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="금액 입력"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    원
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  위자료 (선택)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.consolationMoney}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consolationMoney: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="금액 입력"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    원
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  휴업손해 (선택)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.businessLoss}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessLoss: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                    placeholder="금액 입력"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    원
                  </span>
                </div>
              </div>

              {/* 부상 정도 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  부상 정도
                </label>
                <select
                  value={formData.injuryLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, injuryLevel: e.target.value })
                  }
                  className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">선택해주세요</option>
                  <option value="경상">경상</option>
                  <option value="중상">중상</option>
                  <option value="후유장해">후유장해</option>
                  <option value="사망">사망</option>
                </select>
              </div>

              {/* 증액 희망 항목 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  증액 희망 항목 (다중 선택)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {increaseItemOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleIncreaseItem(item)}
                      className={`p-3 rounded-lg border-2 text-left text-sm transition-colors ${
                        formData.increaseItems.includes(item)
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-border hover:border-primary-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-[60] shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid()}
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            사정서 초안 생성
          </Button>
        </div>
      </div>
    </div>
  )
}
