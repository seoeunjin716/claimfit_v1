"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// 채팅 타입 정의
export interface Chat {
  id: string
  requestId: string
  name: string
  requestType: string
  lastMessage: string
  timeAgo: string
  unread: number
  messages: ChatMessage[]
  createdAt: number
}

export interface ChatMessage {
  id: string
  sender: "me" | "other"
  text: string
  time: string
  timestamp: number
}

interface ChatContextType {
  chats: Chat[]
  addChat: (requestId: string, name: string, requestType: string) => string
  addMessage: (chatId: string, message: ChatMessage) => void
  getChat: (chatId: string) => Chat | undefined
  updateLastMessage: (chatId: string, message: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// 초기 채팅 데이터 (샘플)
const initialChats: Chat[] = [
  {
    id: "1",
    requestId: "1",
    name: "김철수",
    requestType: "자동차",
    lastMessage: "진단서 보내드렸습니다. 확인 부탁드려요.",
    timeAgo: "5분 전",
    unread: 2,
    messages: [
      { id: "1", sender: "other", text: "안녕하세요. 의뢰 감사합니다.", time: "10:30", timestamp: Date.now() - 300000 },
      { id: "2", sender: "me", text: "네, 안녕하세요. 사고 경위를 자세히 알려주세요.", time: "10:31", timestamp: Date.now() - 240000 },
      { id: "3", sender: "other", text: "교차로에서 좌회전 중 정면 충돌이 발생했습니다.", time: "10:32", timestamp: Date.now() - 180000 },
      { id: "4", sender: "me", text: "진단서나 사고 현장 사진이 있으신가요?", time: "10:33", timestamp: Date.now() - 120000 },
      { id: "5", sender: "other", text: "네, 첨부해드리겠습니다.", time: "10:35", timestamp: Date.now() - 60000 },
    ],
    createdAt: Date.now() - 300000,
  },
  {
    id: "2",
    requestId: "2",
    name: "이영희",
    requestType: "실손",
    lastMessage: "네, 알겠습니다. 내일 오전에 방문하겠습니다.",
    timeAgo: "1시간 전",
    unread: 0,
    messages: [],
    createdAt: Date.now() - 3600000,
  },
  {
    id: "3",
    requestId: "3",
    name: "박민수",
    requestType: "화재",
    lastMessage: "감사합니다!",
    timeAgo: "3시간 전",
    unread: 0,
    messages: [],
    createdAt: Date.now() - 10800000,
  },
]

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => {
    // 클라이언트에서만 실행
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chats")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return initialChats
        }
      }
    }
    return initialChats
  })

  // 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chats", JSON.stringify(chats))
    }
  }, [chats])

  // 시간 계산 헬퍼
  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "방금 전"
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  // 채팅 추가
  const addChat = (requestId: string, name: string, requestType: string): string => {
    const chatId = `chat-${Date.now()}`
    const now = Date.now()
    
    const newChat: Chat = {
      id: chatId,
      requestId,
      name,
      requestType,
      lastMessage: "의뢰를 수락했습니다. 채팅을 시작해주세요.",
      timeAgo: "방금 전",
      unread: 0,
      messages: [
        {
          id: `msg-${now}`,
          sender: "other",
          text: "안녕하세요. 의뢰를 수락해주셔서 감사합니다.",
          time: new Date(now).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
          timestamp: now,
        },
      ],
      createdAt: now,
    }

    setChats((prev) => [newChat, ...prev])
    return chatId
  }

  // 메시지 추가
  const addMessage = (chatId: string, message: ChatMessage) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: message.text,
            timeAgo: getTimeAgo(message.timestamp),
          }
        }
        return chat
      })
    )
  }

  // 채팅 가져오기
  const getChat = (chatId: string): Chat | undefined => {
    return chats.find((chat) => chat.id === chatId)
  }

  // 마지막 메시지 업데이트
  const updateLastMessage = (chatId: string, message: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: message,
            timeAgo: getTimeAgo(Date.now()),
          }
        }
        return chat
      })
    )
  }

  // 시간 업데이트 (주기적으로)
  useEffect(() => {
    const interval = setInterval(() => {
      setChats((prev) =>
        prev.map((chat) => ({
          ...chat,
          timeAgo: getTimeAgo(chat.createdAt),
        }))
      )
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(interval)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chats,
        addChat,
        addMessage,
        getChat,
        updateLastMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
