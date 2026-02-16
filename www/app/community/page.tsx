"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Plus, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"

const tabs = ["전체", "성공사례", "실패사례", "Q&A"]

const posts = [
  {
    id: 1,
    title: "실손보험 사고 처리 성공 사례 공유",
    tags: ["실손", "증액"],
    author: "고수",
    views: 234,
    comments: 12,
    category: "성공사례",
  },
  {
    id: 2,
    title: "자동차 사고 보상액 협상 팁",
    tags: ["자동차", "협상"],
    author: "고수",
    views: 156,
    comments: 8,
    category: "Q&A",
  },
  {
    id: 3,
    title: "화재 사고 처리 시 주의사항",
    tags: ["화재", "주의사항"],
    author: "고수",
    views: 89,
    comments: 5,
    category: "성공사례",
  },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("전체")

  const filteredPosts =
    activeTab === "전체"
      ? posts
      : posts.filter((post) => post.category === activeTab)

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-title font-bold text-foreground">커뮤니티</h1>
        </div>
      </header>

      {/* 탭 */}
      <div className="sticky top-[57px] z-30 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
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

      {/* 게시물 목록 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3">
        {filteredPosts.length === 0 ? (
          <EmptyState
            title="게시글이 없습니다"
            description="첫 게시글을 작성해보세요"
          />
        ) : (
          filteredPosts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`} className="block"> {/* ← className="block" 추가 */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-body font-semibold text-foreground flex-1">
                      {post.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-caption text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Badge variant="default" className="text-xs">
                          {post.author}
                        </Badge>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* FAB */}
      <Link href="/community/new">
        <button
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 active:bg-primary-700 transition-colors z-40"
          aria-label="글쓰기"
        >
          <Plus className="w-6 h-6" />
        </button>
      </Link>
    </main>
  )
}
