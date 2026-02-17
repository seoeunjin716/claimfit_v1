"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight, Camera, Image as ImageIcon, X, FileText, Info } from "lucide-react"

// 보험상품 유형
type InsuranceType = "실손" | "배상책임/재물" | "교통사고" | "후유장해" | "진단/수술비/기타" | ""

// 1단계: 사고 정보 데이터 구조
type Step1Data = {
  insuranceType: InsuranceType
  treatmentTypes: string[]
  hospitalName: string
  claimStatus: string
  personType: string
  region: string
}

// 2단계: 보험사 정보 데이터 구조
type Step2Data = {
  insuranceAmount: string
  insuranceAmountUnknown: boolean
  insuranceCategory: "손해보험" | "생명보험" | ""
  insuranceCompanies: string[]
  // 보험 증권 정보
  insuranceCompany: string
  policyNumber: string
  policyFiles: File[]
  policyUnknown: boolean
}

// 3단계: 상세 상담 신청 데이터 구조
type Step3Data = {
  name: string
  contact: string
  consultationContent: string
  availableTime: string
}

type FormData = {
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
}

// 보험상품 유형별 치료 구분 옵션
const treatmentOptions: Record<string, string[]> = {
  실손: ["백내장", "신경성형술", "도수/체외충격파", "남성질환", "여성질환", "어린이", "무릎치료", "고지의무", "기타"],
  "배상책임/재물": ["대인배상", "대물배상", "누수", "화재/기타"],
  교통사고: ["교통사고"],
  후유장해: ["질병후유장해", "상해후유장해"],
  "진단/수술비/기타": ["암진단", "사망진단", "뇌혈관 진단", "심장질환", "수술비/기타"],
}

// 청구 상황 옵션
const claimStatusOptions = [
  "보험금 청구 전",
  "보험금 접수",
  "현장조사 안내",
  "심사 중",
  "보험금 거절",
]

// 본인 구분 옵션
const personTypeOptions = ["피해자", "피보험자(보험 가입자)"]

// 보험사 리스트
const insuranceCompanies = {
  손해보험: ["현대해상", "흥국화재", "삼성화재", "DB손해보험", "롯데손해보험", "메리츠화재", "KB손해보험", "한화손해보험", "기타"],
  생명보험: ["교보생명", "한화생명", "삼성생명", "NH농협생명", "흥국생명", "ABL생명", "기타"],
}

// 보험 증권용 보험사 리스트 (통합)
const allInsuranceCompanies = [
  "삼성생명", "한화생명", "DB손해보험", "현대해상", "KB손해보험", "삼성화재",
  "교보생명", "NH농협생명", "흥국화재", "메리츠화재", "롯데손해보험", "한화손해보험",
  "흥국생명", "ABL생명", "기타"
]

export default function NewRequestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    step1: {
      insuranceType: "",
      treatmentTypes: [],
      hospitalName: "",
      claimStatus: "",
      personType: "",
      region: "",
    },
    step2: {
      insuranceAmount: "",
      insuranceAmountUnknown: false,
      insuranceCategory: "",
      insuranceCompanies: [],
      insuranceCompany: "",
      policyNumber: "",
      policyFiles: [],
      policyUnknown: false,
    },
    step3: {
      name: "",
      contact: "",
      consultationContent: "",
      availableTime: "",
    },
  })

  const steps = ["사고", "보험사", "상황"]

  // 유효성 검사
  const isStep1Valid = () => {
    if (!formData.step1.insuranceType) return false
    const step1 = formData.step1

    if (step1.insuranceType === "실손") {
      return step1.treatmentTypes.length > 0 && step1.hospitalName && step1.claimStatus
    }
    if (step1.insuranceType === "배상책임/재물") {
      return step1.treatmentTypes.length > 0 && step1.personType && step1.region
    }
    if (step1.insuranceType === "교통사고") {
      return step1.treatmentTypes.length > 0 && step1.hospitalName
    }
    if (step1.insuranceType === "후유장해") {
      return step1.treatmentTypes.length > 0 && step1.hospitalName
    }
    if (step1.insuranceType === "진단/수술비/기타") {
      return step1.treatmentTypes.length > 0 && step1.hospitalName && step1.claimStatus
    }
    return false
  }

  const isStep2Valid = () => {
    const step2 = formData.step2
    const basicValid = (
      step2.insuranceCategory !== "" &&
      step2.insuranceCompanies.length > 0 &&
      (step2.insuranceAmountUnknown || step2.insuranceAmount !== "")
    )

    // 보험 증권 검증 (실손 또는 교통사고인 경우 필수)
    const insuranceType = formData.step1.insuranceType
    const needsPolicy = insuranceType === "실손" || insuranceType === "교통사고"
    
    if (needsPolicy && !step2.policyUnknown) {
      return basicValid && (step2.policyFiles.length > 0 || (step2.insuranceCompany && step2.policyNumber))
    }

    return basicValid
  }

  const isStep3Valid = () => {
    return formData.step3.name && formData.step3.contact && formData.step3.consultationContent
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  const handlePolicyFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하여야 합니다.")
      return
    }
    if (formData.step2.policyFiles.length >= 3) {
      alert("최대 3장까지 업로드 가능합니다.")
      return
    }
    setFormData({
      ...formData,
      step2: {
        ...formData.step2,
        policyFiles: [...formData.step2.policyFiles, file],
      },
    })
  }

  const handleSubmit = () => {
    // 전체 데이터를 JSON으로 취합
    const submissionData = {
      ...formData.step1,
      ...formData.step2,
      ...formData.step3,
    }
    console.log("제출 데이터:", JSON.stringify(submissionData, null, 2))
    
    // TODO: 실제 API 호출
    alert("의뢰 신청이 완료되었습니다.")
    router.push("/requests")
  }

  const toggleTreatmentType = (type: string) => {
    const current = formData.step1.treatmentTypes
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    setFormData({
      ...formData,
      step1: { ...formData.step1, treatmentTypes: updated },
    })
  }

  const toggleInsuranceCompany = (company: string) => {
    const current = formData.step2.insuranceCompanies
    const updated = current.includes(company)
      ? current.filter((c) => c !== company)
      : [...current, company]
    setFormData({
      ...formData,
      step2: { ...formData.step2, insuranceCompanies: updated },
    })
  }

  // 1단계 렌더링
  const renderStep1 = () => {
    const step1 = formData.step1
    const treatmentTypes = treatmentOptions[step1.insuranceType] || []

    return (
      <div className="space-y-6">
        {/* 보험상품 유형 선택 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            보험상품 유형
          </label>
          <select
            value={step1.insuranceType}
            onChange={(e) =>
              setFormData({
                ...formData,
                step1: {
                  ...formData.step1,
                  insuranceType: e.target.value as InsuranceType,
                  treatmentTypes: [],
                },
              })
            }
            className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
          >
            <option value="">선택해주세요</option>
            <option value="실손">실손</option>
            <option value="배상책임/재물">배상책임/재물</option>
            <option value="교통사고">교통사고</option>
            <option value="후유장해">후유장해</option>
            <option value="진단/수술비/기타">진단/수술비/기타</option>
          </select>
        </div>

        {/* 유형별 동적 필드 */}
        {step1.insuranceType && (
          <>
            {/* 치료 구분 */}
            <div>
              <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                치료 구분 {step1.insuranceType === "교통사고" ? "" : "(다중 선택 가능)"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {treatmentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleTreatmentType(type)}
                    className={`p-3 rounded-md border-2 text-left text-sm transition-all ${
                      step1.treatmentTypes.includes(type)
                        ? "border-[#2563EB] bg-[#2563EB] text-white scale-105 shadow-sm"
                        : "border-border hover:border-[#2563EB]/30"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 병원 명 또는 지역 명 */}
            {(step1.insuranceType === "실손" ||
              step1.insuranceType === "교통사고" ||
              step1.insuranceType === "후유장해" ||
              step1.insuranceType === "진단/수술비/기타") && (
              <div>
                <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                  병원 명
                </label>
                <input
                  type="text"
                  value={step1.hospitalName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      step1: { ...formData.step1, hospitalName: e.target.value },
                    })
                  }
                  placeholder="병원 지역/명 입력"
                  className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground placeholder:text-[#9CA3AF] placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
                />
              </div>
            )}

            {step1.insuranceType === "배상책임/재물" && (
              <div>
                <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                  지역 명
                </label>
                <input
                  type="text"
                  value={step1.region}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      step1: { ...formData.step1, region: e.target.value },
                    })
                  }
                  placeholder="사고 지역 입력"
                  className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground placeholder:text-[#9CA3AF] placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
                />
              </div>
            )}

            {/* 청구 상황 */}
            {(step1.insuranceType === "실손" ||
              step1.insuranceType === "진단/수술비/기타") && (
              <div>
                <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                  청구 상황
                </label>
                <div className="flex flex-wrap gap-2">
                  {claimStatusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          step1: { ...formData.step1, claimStatus: status },
                        })
                      }
                      className={`px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
                        step1.claimStatus === status
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-border hover:border-primary-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 본인 구분 */}
            {step1.insuranceType === "배상책임/재물" && (
              <div>
                <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                  본인 구분
                </label>
                <div className="flex gap-2">
                  {personTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          step1: { ...formData.step1, personType: type },
                        })
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm transition-colors ${
                        step1.personType === type
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-border hover:border-primary-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // 2단계 렌더링
  const renderStep2 = () => {
    const step2 = formData.step2
    const companies =
      step2.insuranceCategory === "손해보험"
        ? insuranceCompanies.손해보험
        : step2.insuranceCategory === "생명보험"
        ? insuranceCompanies.생명보험
        : []

    return (
      <div className="space-y-6">
        {/* 보험 금액 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            보험 금액
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={step2.insuranceAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    step2: {
                      ...formData.step2,
                      insuranceAmount: e.target.value,
                    },
                  })
                }
                placeholder="금액 입력"
                disabled={step2.insuranceAmountUnknown}
                className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                원
              </span>
            </div>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                checked={step2.insuranceAmountUnknown}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    step2: {
                      ...formData.step2,
                      insuranceAmountUnknown: e.target.checked,
                      insuranceAmount: e.target.checked ? "" : formData.step2.insuranceAmount,
                    },
                  })
                }
                className="w-5 h-5 rounded border-border"
              />
              <span className="text-sm text-foreground">모름</span>
            </label>
          </div>
        </div>

        {/* 보험 종류 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            보험 종류
          </label>
          <select
            value={step2.insuranceCategory}
            onChange={(e) =>
              setFormData({
                ...formData,
                step2: {
                  ...formData.step2,
                  insuranceCategory: e.target.value as "손해보험" | "생명보험" | "",
                  insuranceCompanies: [],
                },
              })
            }
            className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
          >
            <option value="">선택해주세요</option>
            <option value="손해보험">손해보험</option>
            <option value="생명보험">생명보험</option>
          </select>
        </div>

        {/* 보험사 리스트 */}
        {step2.insuranceCategory && (
          <div>
            <label className="block text-[15px] font-medium mb-4 text-[#374151]">
              보험사 선택 (다중 선택 가능)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {companies.map((company) => (
                <button
                  key={company}
                  type="button"
                  onClick={() => toggleInsuranceCompany(company)}
                  className={`p-3 rounded-lg border-2 text-xs transition-colors ${
                    step2.insuranceCompanies.includes(company)
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-border hover:border-primary-300"
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 보험 증권 제출 섹션 */}
        {(formData.step1.insuranceType === "실손" || formData.step1.insuranceType === "교통사고") && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-bold text-foreground">보험 증권 제출</h3>
              <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded">필수</span>
            </div>

            {/* 업로드 가이드 */}
            <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-primary-700">
                  <p className="font-medium mb-1">업로드 가이드</p>
                  <p>보험증권 앞면, 뒷면, 특약 페이지를 촬영해주세요. (최대 3장)</p>
                  <p className="mt-1 text-primary-600">개인정보는 암호화 저장되며 제3자에게 공유되지 않습니다.</p>
                </div>
              </div>
            </div>

            {/* 보험사 선택 */}
            <div className="mb-4">
              <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                보험사
              </label>
              <select
                value={step2.insuranceCompany}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    step2: { ...formData.step2, insuranceCompany: e.target.value },
                  })
                }
                disabled={step2.policyUnknown}
                className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <option value="">선택해주세요</option>
                {allInsuranceCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* 증권번호 */}
            <div className="mb-4">
              <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                증권번호
              </label>
              <input
                type="text"
                value={step2.policyNumber}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9-]/g, "")
                  // 하이픈 자동 포맷팅 (예: 123-456-789)
                  if (value.length > 3 && !value.includes("-")) {
                    value = value.slice(0, 3) + "-" + value.slice(3)
                  }
                  if (value.length > 7 && value.split("-").length === 2) {
                    value = value.slice(0, 7) + "-" + value.slice(7)
                  }
                  setFormData({
                    ...formData,
                    step2: { ...formData.step2, policyNumber: value },
                  })
                }}
                placeholder="증권번호 입력 (하이픈 포함 가능)"
                disabled={step2.policyUnknown}
                className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              />
            </div>

            {/* 파일 업로드 */}
            {!step2.policyUnknown && (
              <div className="mb-4">
                <label className="block text-[15px] font-medium mb-4 text-[#374151]">
                  보험증권 사진/사본 (최대 3장)
                </label>
                <div className="space-y-3">
                  {step2.policyFiles.map((file, index) => (
                    <div
                      key={index}
                      className="p-3 border border-border rounded-lg flex items-center gap-3"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`보험증권 ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = [...step2.policyFiles]
                          newFiles.splice(index, 1)
                          setFormData({
                            ...formData,
                            step2: { ...formData.step2, policyFiles: newFiles },
                          })
                        }}
                        className="p-2 hover:bg-muted rounded text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {step2.policyFiles.length < 3 && (
                    <div className="relative">
                      <input
                        type="file"
                        id="policy-file-camera"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handlePolicyFileUpload(file)
                          }
                          e.target.value = "" // 같은 파일 재선택 가능하도록
                        }}
                        className="hidden"
                      />
                      <input
                        type="file"
                        id="policy-file-gallery"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handlePolicyFileUpload(file)
                          }
                          e.target.value = ""
                        }}
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <label
                          htmlFor="policy-file-camera"
                          className="flex-1 p-3 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-primary-500 transition-colors"
                        >
                          <Camera className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">카메라</p>
                        </label>
                        <label
                          htmlFor="policy-file-gallery"
                          className="flex-1 p-3 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-primary-500 transition-colors"
                        >
                          <ImageIcon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">갤러리</p>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 증권 내용 모름 체크박스 */}
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={step2.policyUnknown}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      step2: {
                        ...formData.step2,
                        policyUnknown: e.target.checked,
                        policyFiles: e.target.checked ? [] : formData.step2.policyFiles,
                        insuranceCompany: e.target.checked ? "" : formData.step2.insuranceCompany,
                        policyNumber: e.target.checked ? "" : formData.step2.policyNumber,
                      },
                    })
                  }
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-sm text-foreground">증권 내용 모름</span>
              </label>
              {step2.policyUnknown && (
                <p className="text-xs text-muted-foreground mt-2 ml-7">
                  손해사정사가 확인 후 추가 요청드릴게요.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 3단계 렌더링
  const renderStep3 = () => {
    const step3 = formData.step3
    const charCount = step3.consultationContent.length

    return (
      <div className="space-y-6">
        {/* 이름 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            이름
          </label>
          <input
            type="text"
            value={step3.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                step3: { ...formData.step3, name: e.target.value },
              })
            }
            placeholder="성함을 입력해주세요"
            className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground placeholder:text-[#9CA3AF] placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            연락처
          </label>
          <input
            type="tel"
            value={step3.contact}
            onChange={(e) =>
              setFormData({
                ...formData,
                step3: { ...formData.step3, contact: e.target.value },
              })
            }
            placeholder="010-0000-0000"
            inputMode="numeric"
            className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground placeholder:text-[#9CA3AF] placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
          />
        </div>

        {/* 상담 내용 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            상담 내용
          </label>
          <div className="relative">
            <textarea
              value={step3.consultationContent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  step3: {
                    ...formData.step3,
                    consultationContent: e.target.value.slice(0, 500),
                  },
                })
              }
              placeholder="상담 내용을 입력해주세요"
              rows={6}
              className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-[#9CA3AF] placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm resize-none pr-16 transition-all"
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {charCount}/500자
            </div>
          </div>
        </div>

        {/* 연락 가능 시간대 */}
        <div>
          <label className="block text-[15px] font-medium mb-4 text-[#374151]">
            연락 가능 시간대
          </label>
          <input
            type="text"
            value={step3.availableTime}
            onChange={(e) =>
              setFormData({
                ...formData,
                step3: { ...formData.step3, availableTime: e.target.value },
              })
            }
            placeholder="전화 받기 편한 시간"
            className="w-full h-[52px] px-4 rounded-md border border-border bg-background text-foreground placeholder:text-[#9CA3AF] placeholder:italic focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:shadow-sm transition-all"
          />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-40">
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
          <h1 className="text-lg font-bold text-foreground flex-1">
            의뢰 신청
          </h1>
        </div>
      </header>

      {/* 스텝 바 */}
      <div className="max-w-md mx-auto px-5 pt-10 pb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    index === currentStep
                      ? "bg-[#2563EB] text-white"
                      : index < currentStep
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#E5E7EB] text-[#9CA3AF]"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs mt-4 transition-all ${
                    index === currentStep
                      ? "text-[#2563EB] font-bold"
                      : index < currentStep
                      ? "text-[#2563EB] font-medium"
                      : "text-[#9CA3AF]"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-3 transition-colors ${
                    index < currentStep ? "bg-[#2563EB]" : "bg-[#E5E7EB]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 메인 타이틀 */}
      <div className="max-w-md mx-auto px-5 mb-10">
        <h2 className="text-[26px] font-bold text-[#111827] leading-relaxed text-center">
          손해사정사 선임이 가능할까?<br />
          <span className="text-base font-medium text-[#4B5563]">
            신청만 하면 선임가능 여부를 확인해 연락드려요
          </span>
        </h2>
      </div>

      {/* 폼 내용 */}
      <div className="max-w-md mx-auto px-5">
        <Card className="min-h-[180px]">
          <CardContent className="p-7 flex flex-col justify-start pt-6">
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
          </CardContent>
        </Card>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom z-[60] shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4 space-y-3">
          {currentStep === 2 && (
            <Button
              variant="outline"
              onClick={() => {
                // 의뢰 저장 전이므로 임시 ID 사용
                // 실제로는 의뢰 저장 후 ID를 받아서 사용
                const tempId = "temp_" + Date.now()
                localStorage.setItem("temp_request_id", tempId)
                router.push(`/requests/${tempId}/document`)
              }}
              className="w-full h-12"
            >
              사정서 초안 생성 (선택)
            </Button>
          )}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12"
              >
                이전
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !isStep1Valid()) ||
                (currentStep === 1 && !isStep2Valid()) ||
                (currentStep === 2 && !isStep3Valid())
              }
              className={`${currentStep > 0 ? "flex-1" : "w-full"} h-12`}
            >
              {currentStep === 2 ? "신청하기" : "다음"}
              {currentStep < 2 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
