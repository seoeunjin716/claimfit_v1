"use client"

import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { MessageSquare } from "lucide-react"
import Link from "next/link"
import { useChat } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const { chats } = useChat()
  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-title font-bold text-foreground">채팅</h1>
        </div>
      </header>

      {/* 채팅 목록 - 모바일/데스크톱 반응형 */}
      <div className={cn(
        "max-w-md mx-auto",
        "lg:max-w-4xl"
      )}>
        {chats.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12" />}
            title="채팅이 없습니다"
            description="의뢰를 수락하면 채팅이 시작됩니다"
          />
        ) : (
          <div className="divide-y divide-border">
            {chats.map((chat) => (
              <Link 
                key={chat.id} 
                href={`/chat/${chat.id}`}
                className="block"
                aria-label={`${chat.name}와의 채팅`}
              >
                <div className={cn(
                  "px-4 py-3 hover:bg-accent/50 transition-colors",
                  "sm:px-6 sm:py-4",
                  "lg:px-8"
                )}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* 프로필 아바타 - 반응형 크기 */}
                    <div className={cn(
                      "rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold flex-shrink-0",
                      "w-12 h-12 text-base",
                      "sm:w-14 sm:h-14 sm:text-lg"
                    )}>
                      {chat.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "font-semibold text-foreground",
                            "text-base sm:text-lg"
                          )}>
                            {chat.name}
                          </span>
                          <Badge variant="outline" className="text-xs sm:text-sm">
                            {chat.requestType}
                          </Badge>
                        </div>
                        <span className={cn(
                          "text-caption text-muted-foreground flex-shrink-0",
                          "text-xs sm:text-sm"
                        )}>
                          {chat.timeAgo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "text-body text-muted-foreground truncate",
                          "text-sm sm:text-base"
                        )}>
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge
                            variant="default"
                            className={cn(
                              "ml-2 flex-shrink-0 bg-primary-500",
                              "text-xs sm:text-sm"
                            )}
                          >
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
