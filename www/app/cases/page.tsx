"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

// 판례 데이터 타입
type CaseType = "교통사고" | "실손의료" | "배상책임·재물" | "후유장해" | "진단·수술비" | "기타"

type Precedent = {
  id: string
  caseNumber: string
  date: string
  type: CaseType
  title: string
  keyPoint: string
  expertComment: string
  keywords: string[]
  year: number
  link?: string
}

// 샘플 판례 데이터
const precedents: Precedent[] = [
  {
    id: "1",
    caseNumber: "2024다288861",
    date: "2024.12.24",
    type: "교통사고",
    title: "대법원 2024다288861 [구상금] – 조치의무 위반 시 청구 가능",
    keyPoint: "사고 후 조치의무 위반 시 보험사 구상금 청구 가능",
    expertComment: "가해자가 도주하거나 구호 안 하면 보험사가 피해자 대신 지급한 금액 일부를 가해자에게 돌려받을 수 있어요. 과실비율 협상 시 강력한 근거!",
    keywords: ["과실비율", "조치의무", "구상금"],
    year: 2024,
    link: "https://casenote.kr/cases/2024다288861",
  },
  {
    id: "2",
    caseNumber: "2022다246146",
    date: "2025.5.15",
    type: "교통사고",
    title: "대법원 2022다246146 – 진료비 기준 책임보험금 산정",
    keyPoint: "진료비가 손해액 미달 시에도 진료비 기준으로 책임보험금 산정",
    expertComment: "병원비가 보험 기준보다 적게 나와도 실제 손해액만큼 인정받을 수 있어요. 치료비 과소평가 케이스에 유리합니다.",
    keywords: ["진료비", "책임보험금", "증액 인정"],
    year: 2025,
  },
  {
    id: "3",
    caseNumber: "2025.1.9",
    date: "2025.1.9",
    type: "실손의료",
    title: "대법원 2025.1.9 – 고지의무 인과관계 관련",
    keyPoint: "고지의무 위반과 사고 간 인과관계 없음 입증 시 보험금 지급",
    expertComment: "과거 병원 방문 사실 숨겼어도 사고와 무관함 증명하면 보험금 받을 수 있어요. 최근 혈액검사 이상 케이스 주의!",
    keywords: ["고지의무 위반", "보험금 거절", "인과관계"],
    year: 2025,
  },
  {
    id: "4",
    caseNumber: "2025년 다수",
    date: "2025",
    type: "실손의료",
    title: "대법원 (2025년 다수) – 설명의무 미이행 시 고지의무 주장 무효",
    keyPoint: "보험 설계사 설명의무 미이행 시 고지의무 위반 주장 무효",
    expertComment: "보험 설계사가 제대로 설명 안 해줬다면 거절·해지 못 해요. 계약서·통화 기록 꼭 확인하세요.",
    keywords: ["고지의무 위반", "설명의무", "보험금 거절"],
    year: 2025,
  },
  {
    id: "5",
    caseNumber: "2026.1.15",
    date: "2026.1.15",
    type: "배상책임·재물",
    title: "대법원 2026.1.15 – 근로복지공단 대위 관련",
    keyPoint: "산재 + 민사 배상 중복 시 공제 기준 명확",
    expertComment: "누수·화재 배상 시 산재 중복 여부 확인 필수. 최근 판례 덕에 공제 기준이 명확해졌어요.",
    keywords: ["누수·화재", "산재", "배상책임"],
    year: 2026,
  },
]

// 쟁점 키워드 옵션
const keywordOptions = [
  "과실비율",
  "고지의무 위반",
  "보험금 거절",
  "증액 인정",
  "누수·화재",
  "조치의무",
  "설명의무",
]

// FAQ 데이터
const faqs = [
  {
    question: "고지의무 위반 시 보험금 거절되나요?",
    answer: "고지의무 위반과 사고 간 인과관계가 없음을 입증하면 보험금을 받을 수 있습니다. 최근 대법원 판례(2025.1.9)에서도 이를 명확히 했어요.",
  },
  {
    question: "과실비율은 어떻게 결정되나요?",
    answer: "교통사고 과실비율은 도로교통법, 과실상계 원칙, 유사 판례를 종합적으로 고려해 결정됩니다. 조치의무 위반 시 가해자 과실이 증가할 수 있어요.",
  },
  {
    question: "실손보험 고지의무 범위는?",
    answer: "계약 체결 전 3년 이내 입원·수술 이력, 현재 치료 중인 질병 등이 고지 대상입니다. 다만 사고와 무관한 질병은 인과관계 입증 시 문제없어요.",
  },
]

export default function CasesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<CaseType | "전체">("전체")
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<"최근 5년" | "전체">("최근 5년")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  // 필터링된 판례
  const filteredPrecedents = precedents.filter((precedent) => {
    // 사고 유형 필터
    if (selectedType !== "전체" && precedent.type !== selectedType) return false

    // 연도 필터
    if (selectedYear === "최근 5년") {
      const currentYear = new Date().getFullYear()
      if (precedent.year < currentYear - 5) return false
    }

    // 키워드 필터
    if (selectedKeywords.length > 0) {
      const hasKeyword = selectedKeywords.some((keyword) =>
        precedent.keywords.includes(keyword)
      )
      if (!hasKeyword) return false
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const searchableText = `${precedent.title} ${precedent.keyPoint} ${precedent.expertComment}`.toLowerCase()
      if (!searchableText.includes(query)) return false
    }

    return true
  })

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    )
  }

  const handleSimilarCase = (precedent: Precedent) => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      if (confirm("상담을 받으려면 로그인해주세요.")) {
        router.push("/login")
      }
      return
    }
    // 상담 탭으로 이동하고 판례 정보 전달
    router.push(`/consult?precedent=${precedent.caseNumber}`)
  }

  const handleConsult = () => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      if (confirm("상담을 받으려면 로그인해주세요.")) {
        router.push("/login")
      }
      return
    }
    router.push("/consult")
  }

  const getTypeColor = (type: CaseType) => {
    const colors: Record<CaseType, string> = {
      교통사고: "destructive",
      실손의료: "default",
      "배상책임·재물": "warning",
      후유장해: "success",
      "진단·수술비": "outline",
      기타: "secondary",
    }
    return colors[type] || "outline"
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-title font-bold text-foreground">판례 · 법률 자문</h1>
        </div>
      </header>

      {/* 필터링 섹션 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4 bg-card border-b border-border">
        {/* 검색 바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="교통사고 증액 등 키워드 검색"
            className="w-full h-12 pl-10 pr-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* 사고 유형 드롭다운 */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as CaseType | "전체")}
            className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="전체">전체</option>
            <option value="교통사고">교통사고</option>
            <option value="실손의료">실손의료</option>
            <option value="배상책임·재물">배상책임·재물</option>
            <option value="후유장해">후유장해</option>
            <option value="진단·수술비">진단·수술비</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 쟁점 키워드 칩 */}
        <div>
          <div className="flex flex-wrap gap-2">
            {keywordOptions.map((keyword) => (
              <button
                key={keyword}
                onClick={() => toggleKeyword(keyword)}
                className={`px-3 py-1.5 rounded-full text-xs border-2 transition-colors ${
                  selectedKeywords.includes(keyword)
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-border hover:border-primary-300"
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* 연도 필터 */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedYear("최근 5년")}
            className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
              selectedYear === "최근 5년"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-border hover:border-primary-300"
            }`}
          >
            최근 5년
          </button>
          <button
            onClick={() => setSelectedYear("전체")}
            className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm transition-colors ${
              selectedYear === "전체"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-border hover:border-primary-300"
            }`}
          >
            전체
          </button>
        </div>
      </div>

      {/* 판례 카드 리스트 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {filteredPrecedents.length === 0 ? (
          <Card>
            <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6 text-center">
              <p className="text-muted-foreground">검색 결과가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPrecedents.map((precedent) => (
            <Card key={precedent.id} className="shadow-sm">
              <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6">
                {/* 상단 뱃지 */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={getTypeColor(precedent.type) as any}>
                    {precedent.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{precedent.date}</span>
                </div>

                {/* 제목 */}
                <h3 className="text-base font-bold text-foreground mb-3 leading-snug">
                  {precedent.title}
                </h3>

                {/* 키 포인트 */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground">
                    {precedent.keyPoint}
                  </p>
                </div>

                {/* 손해사정사 해설 */}
                <div className="mb-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {precedent.expertComment}
                  </p>
                </div>

                {/* 키워드 태그 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {precedent.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>

                {/* 하단 버튼 */}
                <div className="flex flex-col gap-2">
                  {precedent.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(precedent.link, "_blank")}
                      className="w-full justify-start"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      판례 원문 보기
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => handleSimilarCase(precedent)}
                    className="w-full"
                  >
                    내 케이스와 비슷해?
                  </Button>
                </div>

                {/* 손해사정사 서명 */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    손해사정사 직접 검토: [실제 이름]
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    본 내용은 참고용이며 법적 자문이 아닙니다. 실제 적용은 손해사정사 상담을 권장합니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 하단 고정 섹션 */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* 법률 자문 가이드 */}
        <Card>
          <CardContent className="p-5 flex flex-col justify-start pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">법률 자문 가이드</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border last:border-0 pb-3 last:pb-0">
                  <button
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-sm font-medium text-foreground flex-1">
                      {faq.question}
                    </span>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 판례 기반 체크리스트 */}
        <Card>
          <CardContent className="p-5 flex flex-col justify-start pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              판례 기반 체크리스트
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              이 판례처럼 고지의무 문제 있나요?
            </p>
            <div className="space-y-2 mb-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-border"
                />
                <span className="text-sm text-foreground">
                  과거 병원 방문 이력이 있나요?
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-border"
                />
                <span className="text-sm text-foreground">
                  보험 설계사가 충분히 설명했나요?
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 w-5 h-5 rounded border-border"
                />
                <span className="text-sm text-foreground">
                  사고와 무관한 질병인가요?
                </span>
              </label>
            </div>
            <Button onClick={handleConsult} className="w-full">
              상담 받기
            </Button>
          </CardContent>
        </Card>

        {/* 큰 CTA 버튼 */}
        <Button onClick={handleConsult} className="w-full h-14 text-base font-semibold">
          지금 손해사정사와 상담 시작하기
        </Button>
      </div>
    </div>
  )
}
