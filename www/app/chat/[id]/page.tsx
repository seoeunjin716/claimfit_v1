"use client"

import { useState, use, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Paperclip, Mic, FileText, Send } from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { cn } from "@/lib/utils"

export default function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const { id } = use(params)
  const { getChat, addMessage, updateLastMessage } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 채팅 정보 가져오기
  const chat = getChat(id)

  // 채팅이 없으면 목록으로 리다이렉트
  useEffect(() => {
    if (!chat) {
      router.push("/chat")
    }
  }, [chat, router])

  // 메시지 전송 핸들러
  const handleSend = () => {
    if (message.trim() && chat) {
      const now = Date.now()
      const newMessage = {
        id: `msg-${now}`,
        sender: "me" as const,
        text: message.trim(),
        time: new Date(now).toLocaleTimeString("ko-KR", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        timestamp: now,
      }

      addMessage(chat.id, newMessage)
      updateLastMessage(chat.id, message.trim())
      setMessage("")
    }
  }

  // 메시지 목록이 변경되면 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages])

  if (!chat) {
    return null
  }

  return (
    <main className={cn(
      "flex flex-col h-screen bg-background",
      "lg:max-w-4xl lg:mx-auto"
    )}>
      {/* 헤더 - 모바일/데스크톱 반응형 */}
      <header className={cn(
        "sticky top-0 z-40 bg-card border-b border-border safe-area-top",
        "lg:relative"
      )}>
        <div className={cn(
          "max-w-md mx-auto px-4 py-3 flex items-center gap-3",
          "sm:px-6",
          "lg:max-w-full lg:px-8"
        )}>
          <button
            onClick={() => router.back()}
            className={cn(
              "p-2 -ml-2",
              "lg:hidden"
            )}
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className={cn(
              "text-title font-bold text-foreground",
              "text-lg sm:text-xl"
            )}>
              {chat.name}
            </h1>
            <p className={cn(
              "text-caption text-muted-foreground",
              "text-xs sm:text-sm"
            )}>
              {chat.requestType}
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="의뢰 정보">
            <FileText className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* 메시지 영역 - 반응형 패딩 */}
      <div className={cn(
        "flex-1 overflow-y-auto px-4 py-4 space-y-3",
        "sm:px-6 sm:py-6",
        "lg:px-8"
      )}>
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>메시지가 없습니다. 첫 메시지를 보내보세요.</p>
          </div>
        ) : (
          <>
            {chat.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[75%] sm:max-w-[60%]",
                    msg.sender === "me"
                      ? "bg-primary-500 text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className={cn(
                    "text-body break-words",
                    "text-sm sm:text-base"
                  )}>
                    {msg.text}
                  </p>
                  <p
                    className={cn(
                      "text-caption mt-1",
                      msg.sender === "me" 
                        ? "text-primary-100" 
                        : "text-muted-foreground",
                      "text-xs sm:text-sm"
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 입력 영역 - 모바일/데스크톱 반응형 */}
      <div className={cn(
        "border-t border-border bg-card safe-area-bottom",
        "lg:sticky lg:bottom-0"
      )}>
        <div className={cn(
          "max-w-md mx-auto px-4 py-3",
          "sm:px-6",
          "lg:max-w-full lg:px-8"
        )}>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              aria-label="파일 첨부"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="메시지를 입력하세요"
              className={cn(
                "flex-1 h-12 px-4 rounded-lg border border-border bg-background text-foreground",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500",
                "text-sm sm:text-base"
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="음성 녹음"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!message.trim()}
              aria-label="메시지 전송"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              aria-label="전자위임장 요청"
            >
              전자위임장 요청
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
