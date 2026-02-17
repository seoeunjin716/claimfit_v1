"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Image, Mic, FileText, Lock, Handshake, Camera, X, Download } from "lucide-react"

type Message = {
  id: string
  text: string
  sender: "user" | "ai" | "expert"
  timestamp: Date
  isTyping?: boolean
  files?: FileAttachment[]
}

type FileAttachment = {
  id: string
  name: string
  type: "image" | "pdf" | "document"
  url?: string
  thumbnail?: string
  size: number
  uploadProgress?: number
}

export default function ConsultPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "안녕하세요! 모두의 사정 AI 상담입니다. 어떤 도움이 필요하신가요?",
      sender: "ai",
      timestamp: new Date(),
    },
    // 샘플: 손해사정사 자료 요청 메시지
    {
      id: "request-1",
      text: "진료기록부 추가로 보내주세요",
      sender: "expert",
      timestamp: new Date(Date.now() - 3600000),
    },
    // 샘플: 보험증권 요청 메시지
    {
      id: "request-2",
      text: "보험증권 사진 보내주시면 더 정확히 도와드릴 수 있어요.",
      sender: "expert",
      timestamp: new Date(Date.now() - 1800000),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isConnectedToExpert, setIsConnectedToExpert] = useState(false)
  const [isExpertChecking, setIsExpertChecking] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([])
  const [sessionUploadCount, setSessionUploadCount] = useState(0)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 업로드 제한: 세션당 5장, 전체 20장
  const MAX_SESSION_UPLOADS = 5
  const MAX_TOTAL_UPLOADS = 20

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 외부 클릭 시 업로드 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUploadMenu && !(event.target as HTMLElement).closest(".upload-menu-container")) {
        setShowUploadMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showUploadMenu])

  const handleSend = () => {
    if (!inputText.trim()) return

    const token = localStorage.getItem("auth_token")
    if (!token) {
      if (confirm("손해사정사와 상담하려면 로그인해주세요.")) {
        router.push("/login")
      }
      return
    }

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // AI 응답 시뮬레이션
    setTimeout(() => {
      // 복잡한 질문인지 체크 (예: "사고 당했어요" 같은 경우)
      if (inputText.includes("사고") || inputText.includes("의뢰") || inputText.length > 50) {
        // 손해사정사 연결 필요
        setIsExpertChecking(true)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "손해사정사가 직접 확인 중입니다",
            sender: "ai",
            timestamp: new Date(),
            isTyping: true,
          },
        ])

        setTimeout(() => {
          setIsExpertChecking(false)
          setIsConnectedToExpert(true)
          setMessages((prev) => [
            ...prev.filter((m) => !m.isTyping),
            {
              id: (Date.now() + 2).toString(),
              text: "안녕하세요, 손해사정사입니다. 상세히 말씀해주시면 더 정확한 상담이 가능합니다.",
              sender: "expert",
              timestamp: new Date(),
            },
          ])
        }, 2000)
      } else {
        // 간단한 AI 응답
        let aiResponse = "네, 도와드리겠습니다. 더 자세한 정보를 알려주시면 정확한 상담이 가능합니다."
        
        // 보험증권 자동 제안
        if (inputText.includes("보험") || inputText.includes("실손") || inputText.includes("교통사고")) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + 2).toString(),
                text: "보험증권이 필요해 보이네요. 첨부해주세요!",
                sender: "ai",
                timestamp: new Date(),
              },
            ])
          }, 1000)
        }
        
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: aiResponse,
            sender: "ai",
            timestamp: new Date(),
          },
        ])
      }
    }, 500)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const token = localStorage.getItem("auth_token")
    if (!token) {
      if (confirm("파일을 업로드하려면 로그인해주세요.")) {
        router.push("/login")
      }
      return
    }

    // 업로드 제한 체크
    if (sessionUploadCount + files.length > MAX_SESSION_UPLOADS) {
      alert(`세션당 최대 ${MAX_SESSION_UPLOADS}장까지 업로드 가능합니다. 손해사정사와 상담 후 추가 업로드를 부탁드려요.`)
      return
    }

    if (uploadedFiles.length + files.length > MAX_TOTAL_UPLOADS) {
      alert(`전체 의뢰당 최대 ${MAX_TOTAL_UPLOADS}장까지 업로드 가능합니다. 손해사정사와 상담 후 추가 업로드를 부탁드려요.`)
      return
    }

    // 파일 형식 체크
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type))
    
    if (invalidFiles.length > 0) {
      alert("이미지(jpg, png), PDF, 문서(docx) 형식만 업로드 가능합니다.")
      return
    }

    // 암호화 안내
    if (!confirm("개인정보 암호화 저장됩니다. 업로드하시겠습니까?")) {
      return
    }

    // 파일 업로드 처리
    Array.from(files).forEach((file) => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const fileType = file.type.startsWith("image/") ? "image" : file.type.includes("pdf") ? "pdf" : "document"
      
      const newFile: FileAttachment = {
        id: fileId,
        name: file.name,
        type: fileType,
        size: file.size,
        uploadProgress: 0,
      }

      // 썸네일 생성 (이미지인 경우)
      if (fileType === "image") {
        const reader = new FileReader()
        reader.onload = (e) => {
          newFile.thumbnail = e.target?.result as string
          setUploadedFiles((prev) => [...prev, { ...newFile }])
        }
        reader.readAsDataURL(file)
      } else {
        setUploadedFiles((prev) => [...prev, newFile])
      }

      // 업로드 시뮬레이션
      const uploadInterval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, uploadProgress: Math.min((f.uploadProgress || 0) + 20, 100) }
              : f
          )
        )
      }, 200)

      setTimeout(() => {
        clearInterval(uploadInterval)
        const completedFile: FileAttachment = {
          ...newFile,
          uploadProgress: 100,
          url: URL.createObjectURL(file),
        }
        
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? completedFile : f
          )
        )
        setSessionUploadCount((prev) => prev + 1)

        // 메시지에 파일 추가
        const fileMessage: Message = {
          id: fileId,
          text: `파일 업로드: ${file.name}`,
          sender: "user",
          timestamp: new Date(),
          files: [completedFile],
        }
        setMessages((prev) => [...prev, fileMessage])

        // 업로드 완료 후 uploadedFiles에서 제거 (메시지에 포함되었으므로)
        setTimeout(() => {
          setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
        }, 2000)

        // AI 자동 응답
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              text: "손해사정사가 확인 중입니다",
              sender: "ai",
              timestamp: new Date(),
            },
          ])
        }, 500)
      }, 1000)
    })

    setShowUploadMenu(false)
  }

  const handleFileUpload = () => {
    setShowUploadMenu(!showUploadMenu)
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleGalleryClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    setSessionUploadCount((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-title font-bold text-foreground">상담</h1>
            {isConnectedToExpert && (
              <Badge variant="success" className="text-xs">
                손해사정사 연결됨
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.sender === "user"
                  ? "bg-primary-500 text-white"
                  : message.sender === "expert"
                  ? "bg-success/10 text-foreground border border-success/20"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.isTyping ? (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-150" />
                </div>
              ) : (
                <>
                  <p className="text-sm">{message.text}</p>
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.files.map((file) => (
                        <div
                          key={file.id}
                          className="bg-white/20 rounded-lg p-2 flex items-center gap-2 cursor-pointer hover:bg-white/30 transition-colors"
                          onClick={() => {
                            if (file.url) {
                              window.open(file.url, "_blank")
                            } else if (file.thumbnail) {
                              // 이미지 확대 보기
                              const newWindow = window.open()
                              if (newWindow) {
                                newWindow.document.write(`
                                  <html>
                                    <head><title>${file.name}</title></head>
                                    <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000">
                                      <img src="${file.thumbnail}" style="max-width:100%;max-height:100vh;object-fit:contain" />
                                    </body>
                                  </html>
                                `)
                              }
                            }
                          }}
                        >
                          {file.thumbnail ? (
                            <img
                              src={file.thumbnail}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <FileText className="w-8 h-8 text-white/70" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{file.name}</p>
                            <p className="text-xs opacity-70">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          {file.url && (
                            <Download className="w-4 h-4 text-white/70" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {message.sender === "expert" && (
                <div className="mt-1 text-xs opacity-70">손해사정사</div>
              )}
              {message.sender === "ai" && !isConnectedToExpert && (
                <div className="mt-1 text-xs opacity-70">AI</div>
              )}
            </div>
          </div>
        ))}

        {/* 업로드된 파일 표시 */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className={`flex ${
                  file.uploadProgress === 100 ? "justify-end" : "justify-center"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    file.uploadProgress === 100
                      ? "bg-primary-500 text-white"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-16 h-16 object-cover rounded"
                        onClick={() => file.url && window.open(file.url, "_blank")}
                      />
                    ) : (
                      <FileText className="w-12 h-12" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{file.name}</p>
                      {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                        <div className="mt-2">
                          <div className="w-full bg-white/20 rounded-full h-1.5">
                            <div
                              className="bg-white h-1.5 rounded-full transition-all"
                              style={{ width: `${file.uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs mt-1">업로드 중... {file.uploadProgress}%</p>
                        </div>
                      )}
                      {file.uploadProgress === 100 && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => file.url && window.open(file.url, "_blank")}
                            className="text-xs underline"
                          >
                            보기
                          </button>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-xs underline opacity-70"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 손해사정사 자료 요청 카드 */}
        {messages.some((m) => m.sender === "expert" && m.text.includes("보내주세요")) && (
          <Card className="mx-4 my-6 border-success/20 bg-success/5">
            <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">자료 요청</h4>
                  <p className="text-sm text-muted-foreground mb-5">
                    손해사정사가 추가 자료를 요청했습니다. 아래 버튼으로 업로드해주세요.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleFileUpload}
                    className="w-full"
                  >
                    자료 업로드하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 보험증권 요청 카드 */}
        {messages.some((m) => m.sender === "expert" && m.text.includes("보험증권")) && (
          <Card className="mx-4 my-4 border-primary-500/20 bg-primary-50 shadow-sm">
            <CardContent className="p-6 min-h-[150px] flex flex-col justify-start pt-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">보험증권 요청</h4>
                  <p className="text-sm text-muted-foreground mb-5">
                    보험증권을 제출하시면 더 정확한 상담이 가능합니다.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleFileUpload}
                      className="flex-1"
                    >
                      보험증권 업로드
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/requests")}
                      className="flex-1"
                    >
                      의뢰 페이지로
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 계약 진행 제안 카드 */}
        {isConnectedToExpert && messages.length > 3 && (
          <Card className="mx-4 my-6 border-primary-500/20 bg-primary-50">
            <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
              <div className="flex items-start gap-3">
                <Handshake className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-3">계약 진행 제안</h4>
                  <p className="text-sm text-muted-foreground mb-5">
                    안심결제(에스크로)로 안전하게 계약하고 진행하세요.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => router.push("/requests")}
                    className="w-full"
                  >
                    계약 및 결제 진행
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="sticky bottom-0 bg-card border-t border-border safe-area-bottom">
        <div className="max-w-md mx-auto px-4 py-3">
          {/* 파일 업로드 안내 */}
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>개인정보 암호화 저장</span>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2 mb-2 relative">
            <div className="relative upload-menu-container">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFileUpload}
                className="h-10"
                title="파일 첨부"
              >
                <Image className="w-5 h-5" />
              </Button>
              {showUploadMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50 min-w-[120px]">
                  <button
                    onClick={handleCameraClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted rounded flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    카메라
                  </button>
                  <button
                    onClick={handleGalleryClick}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted rounded flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    갤러리
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <Button variant="ghost" size="sm" className="h-10">
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10"
              onClick={() => {
                const token = localStorage.getItem("auth_token")
                if (!token) {
                  if (confirm("사정서를 생성하려면 로그인해주세요.")) {
                    router.push("/login")
                  }
                  return
                }
                router.push("/requests/new/document")
              }}
              title="사정서 생성"
            >
              <FileText className="w-5 h-5" />
            </Button>
          </div>
          {/* 업로드 제한 안내 */}
          {sessionUploadCount > 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              업로드: {sessionUploadCount}/{MAX_SESSION_UPLOADS}장 (세션당) | 전체: {uploadedFiles.length}/{MAX_TOTAL_UPLOADS}장
            </div>
          )}

          {/* 입력 필드 */}
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 min-h-[48px] px-4 py-2 bg-muted rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              onClick={handleSend}
              size="lg"
              className="h-12 w-12 rounded-full p-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
