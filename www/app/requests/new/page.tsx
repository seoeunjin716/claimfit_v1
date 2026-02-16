"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Upload, X } from "lucide-react"

const steps = [
  "사고 유형",
  "사고 장소",
  "사고 경위",
  "부상 정도",
  "피해자 정보",
  "첨부 파일",
]

const accidentTypes = [
  { id: "car", label: "자동차", icon: "🚗" },
  { id: "medical", label: "실손", icon: "🏥" },
  { id: "fire", label: "화재", icon: "🔥" },
  { id: "other", label: "기타", icon: "📋" },
]

const injuryLevels = [
  { id: "mild", label: "경증" },
  { id: "moderate", label: "중증" },
  { id: "severe", label: "사망" },
]

export default function NewRequestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: "",
    injury: "",
    birthDate: "",
    contact: "",
    files: [] as File[],
  })

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // 제출 로직
      router.push("/")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (formData.files.length + files.length <= 10) {
      setFormData({ ...formData, files: [...formData.files, ...files] })
    }
  }

  const removeFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-3">
            <p className="text-body text-muted-foreground mb-4">
              사고 유형을 선택해주세요
            </p>
            <div className="grid grid-cols-2 gap-3">
              {accidentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() =>
                    setFormData({ ...formData, type: type.id })
                  }
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === type.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-border hover:border-primary-300"
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-3">
            <p className="text-body text-muted-foreground mb-4">
              사고 장소를 입력해주세요
            </p>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="예: 서울시 강남구 테헤란로 123"
              className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">지도 영역</span>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-3">
            <p className="text-body text-muted-foreground mb-4">
              사고 경위를 간단히 설명해주세요
            </p>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="사고가 발생한 경위를 입력해주세요"
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-3">
            <p className="text-body text-muted-foreground mb-4">
              부상 정도를 선택해주세요
            </p>
            <div className="space-y-2">
              {injuryLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() =>
                    setFormData({ ...formData, injury: level.label })
                  }
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    formData.injury === level.label
                      ? "border-primary-500 bg-primary-50"
                      : "border-border hover:border-primary-300"
                  }`}
                >
                  <div className="font-medium">{level.label}</div>
                </button>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-body text-muted-foreground mb-4">
              피해자 정보를 입력해주세요
            </p>
            <div>
              <label className="block text-sm font-medium mb-2">
                생년월일
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) =>
                  setFormData({ ...formData, birthDate: e.target.value })
                }
                className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                연락처
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="010-1234-5678"
                className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-3">
            <p className="text-body text-muted-foreground mb-4">
              사진이나 서류를 첨부해주세요 (최대 10장)
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {formData.files.map((file, index) => (
                <div key={index} className="relative aspect-square">
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-caption text-muted-foreground">
                      {file.name.substring(0, 10)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.files.length < 10 && (
                <label className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-caption text-muted-foreground">
                    추가
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                </label>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-title font-bold text-foreground flex-1">
            의뢰 등록
          </h1>
        </div>
      </header>

      {/* 진행률 */}
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </span>
          <span className="text-foreground font-medium">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-body font-medium mt-2">{steps[currentStep]}</p>
      </div>

      {/* 폼 내용 */}
      <div className="max-w-md mx-auto px-4 py-4">
        <Card>
          <CardContent className="p-6">{renderStepContent()}</CardContent>
        </Card>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border safe-area-bottom">
        <div className="max-w-md mx-auto px-4 py-3">
          <Button
            className="w-full"
            size="lg"
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !formData.type) ||
              (currentStep === 1 && !formData.location) ||
              (currentStep === 2 && !formData.description) ||
              (currentStep === 3 && !formData.injury) ||
              (currentStep === 4 && (!formData.birthDate || !formData.contact))
            }
          >
            {currentStep === steps.length - 1
              ? "고수 사정사에게 연결하기"
              : "다음"}
          </Button>
        </div>
      </div>
    </main>
  )
}
