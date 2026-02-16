"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Edit, TrendingUp } from "lucide-react"

export default function ProfilePage() {
  const stats = {
    successCases: 127,
    averageIncrease: 23.5,
    rating: 4.8,
  }

  const specialties = ["실손", "자동차", "화재", "산재"]

  const reviews = [
    { id: 1, rating: 5, comment: "정말 전문적이고 친절하세요!", date: "2024.01.15" },
    { id: 2, rating: 5, comment: "보상액이 크게 늘어났습니다. 감사합니다.", date: "2024.01.10" },
    { id: 3, rating: 4, comment: "빠른 처리 감사합니다.", date: "2024.01.05" },
  ]

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-title font-bold text-foreground">마이페이지</h1>
          <Button variant="ghost" size="icon">
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 프로필 헤더 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
                홍
              </div>
              <div className="flex-1">
                <h2 className="text-subtitle font-semibold mb-1">홍길동 사정사</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">실손 고수</Badge>
                  <Badge variant="default">자동차 마스터</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">성과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-primary-500 mb-1">
                  {stats.successCases}건
                </div>
                <div className="text-caption text-muted-foreground">
                  성공 케이스
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-5 h-5" />
                  {stats.averageIncrease}%
                </div>
                <div className="text-caption text-muted-foreground">
                  평균 증액률
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 전문 분야 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">전문 분야</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <Badge key={specialty} variant="outline">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 리뷰 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              리뷰 {stats.rating}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-caption text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <p className="text-body">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 성공 사례 샘플 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">성공 사례</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center"
                >
                  <span className="text-caption text-muted-foreground">
                    사례 {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
