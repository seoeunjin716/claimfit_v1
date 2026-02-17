"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Edit, TrendingUp, BarChart3, CreditCard, FileText, DollarSign, Send, FolderOpen } from "lucide-react"
import Link from "next/link"

// 손해사정사 계정인지 체크 (실제로는 서버에서 확인)
const isExpert = false // 임시로 false (의뢰인 모드)

export default function ProfilePage() {
  const router = useRouter()
  const [userInfo] = useState({
    name: "홍길동",
    contact: "010-1234-5678",
    birthDate: "1990-01-01",
  })

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("has_seen_onboarding")
      router.push("/login")
    }
  }

  if (isExpert) {
    // 손해사정사 관리자 모드
    return (
      <main className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-title font-bold text-foreground">관리자</h1>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
          {/* 프로필 편집 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">프로필 편집</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                경력 및 성공률 업데이트
              </Button>
            </CardContent>
          </Card>

          {/* 케이스 업로드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">케이스 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                성공 사례 추가
              </Button>
            </CardContent>
          </Card>

          {/* 내부 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                내부 통계
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 의뢰 수</span>
                  <span className="font-bold">247건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">증액 총액</span>
                  <span className="font-bold text-success">12억 5천만원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">평균 증액률</span>
                  <span className="font-bold text-primary-500">180%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 결제 내역 대시보드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">예치 중</span>
                  <span className="font-bold text-warning">3,500,000원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이번 달 지급</span>
                  <span className="font-bold text-success">12,000,000원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">환불 요청</span>
                  <span className="font-bold text-destructive">500,000원</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                지급·환불 관리
              </Button>
            </CardContent>
          </Card>

          {/* 자료 요청 시스템 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="w-5 h-5" />
                자료 요청
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/profile/request-material")}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                자료 요청 보내기
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                의뢰인에게 필요한 자료를 요청할 수 있습니다. 푸시 알림이 자동으로 발송됩니다.
              </p>
            </CardContent>
          </Card>

          {/* 사정서 템플릿 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                사정서 템플릿 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                표준 양식 업데이트
              </Button>
              <Button variant="outline" className="w-full justify-start">
                카테고리별 템플릿 관리
              </Button>
              <Button variant="outline" className="w-full justify-start">
                템플릿 라이브러리
              </Button>
            </CardContent>
          </Card>

          {/* 콘텐츠 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">콘텐츠 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                배너 관리
              </Button>
              <Button variant="outline" className="w-full justify-start">
                프로모션 설정
              </Button>
            </CardContent>
          </Card>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </main>
    )
  }

  // 의뢰인 모드
  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-title font-bold text-foreground">프로필</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 내 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">내 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">이름</div>
              <div className="text-body">{userInfo.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">연락처</div>
              <div className="text-body">{userInfo.contact}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">생년월일</div>
              <div className="text-body">{userInfo.birthDate}</div>
            </div>
          </CardContent>
        </Card>

        {/* 과거 의뢰 내역 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">의뢰 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/requests">
              <Button variant="outline" className="w-full justify-start">
                과거 의뢰 보기
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body">푸시 알림</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body">이메일 알림</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>
    </main>
  )
}
