"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, CreditCard, Shield, CheckCircle2, Upload, Image as ImageIcon, X, Download, Camera, Info } from "lucide-react"

type FileAttachment = {
  id: string
  name: string
  type: "image" | "pdf" | "document"
  url?: string
  thumbnail?: string
  size: number
  uploadDate: string
}

// 샘플 데이터
const initialRequestData = {
  id: 1,
  type: "자동차 사고",
  status: "상담 중",
  date: "2024-01-15",
  estimatedAmount: "500만원",
  fee: 500000, // 수임료 (원)
  escrowEnabled: true,
  paymentStatus: "미결제", // 미결제, 예치완료, 지급완료
  documents: [],
  attachments: [
    {
      id: "1",
      name: "사고 현장 사진.jpg",
      type: "image" as const,
      size: 1024000,
      uploadDate: "2024-01-15",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E사진%3C/text%3E%3C/svg%3E",
    },
    {
      id: "2",
      name: "진단서.pdf",
      type: "pdf" as const,
      size: 512000,
      uploadDate: "2024-01-15",
    },
  ] as FileAttachment[],
}

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [escrowEnabled, setEscrowEnabled] = useState(initialRequestData.escrowEnabled)
  const [paymentStatus, setPaymentStatus] = useState(initialRequestData.paymentStatus)
  const [attachments, setAttachments] = useState<FileAttachment[]>(initialRequestData.attachments)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [materialRequests, setMaterialRequests] = useState([
    { id: "1", type: "진료기록부", date: "2024-01-16", status: "요청됨" },
  ])
  const [policyStatus, setPolicyStatus] = useState<"미제출" | "제출 완료" | "손해사정사 확인 중" | "완료">("제출 완료")
  const [policyData, setPolicyData] = useState({
    insuranceCompany: "삼성화재",
    policyNumber: "123-456-789",
    files: [
      {
        id: "1",
        name: "보험증권_앞면.jpg",
        type: "image" as const,
        thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E보험증권%3C/text%3E%3C/svg%3E",
        size: 512000,
        uploadDate: "2024-01-15",
      },
    ] as FileAttachment[],
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const policyFileInputRef = useRef<HTMLInputElement>(null)

  const MAX_TOTAL_UPLOADS = 20
  const MAX_POLICY_FILES = 3

  const handlePayment = () => {
    // TODO: 실제 PG 연동
    if (confirm("안심결제(에스크로)로 결제하시겠습니까?")) {
      setPaymentStatus("예치완료")
      alert("결제가 완료되었습니다. 손해사정사가 업무를 완료하면 자동으로 지급됩니다.")
    }
  }

  const handleCreateDocument = () => {
    router.push(`/requests/${params.id}/document`)
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
    if (attachments.length + files.length > MAX_TOTAL_UPLOADS) {
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
        uploadDate: new Date().toISOString().split("T")[0],
      }

      // 썸네일 생성 (이미지인 경우)
      if (fileType === "image") {
        const reader = new FileReader()
        reader.onload = (e) => {
          newFile.thumbnail = e.target?.result as string
          setAttachments((prev) => [...prev, { ...newFile }])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachments((prev) => [...prev, newFile])
      }
    })

    setShowUploadMenu(false)
    alert("자료가 업로드되었습니다. 손해사정사가 확인 중입니다.")
  }

  const handleUploadClick = () => {
    setShowUploadMenu(!showUploadMenu)
  }

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

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleGalleryClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (fileId: string) => {
    if (confirm("이 파일을 삭제하시겠습니까?")) {
      setAttachments((prev) => prev.filter((f) => f.id !== fileId))
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-card border-b border-border safe-area-top">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-foreground flex-1">의뢰 상세</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 기본 정보 */}
        <Card>
          <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  {initialRequestData.type}
                </h2>
                <Badge variant="warning" className="text-xs">
                  {initialRequestData.status}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{initialRequestData.date}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              예상 보상액: <span className="font-semibold text-foreground">{initialRequestData.estimatedAmount}</span>
            </div>
          </CardContent>
        </Card>

        {/* 계약 및 결제 섹션 */}
        <Card>
          <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              계약 및 결제
            </h3>

            {/* 수임료 금액 */}
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">수임료</div>
              <div className="text-2xl font-bold text-foreground">
                {initialRequestData.fee.toLocaleString()}원
              </div>
            </div>

            {/* 안심결제 토글 */}
            <div className="mb-4 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-foreground">안심결제(에스크로) 사용</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escrowEnabled}
                    onChange={(e) => setEscrowEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                수임료는 앱에 안전하게 예치됩니다. 업무 완료 후 손해사정사에게 지급되며, 불만 시 환불 가능합니다.
              </p>
            </div>

            {/* 결제 상태 */}
            {paymentStatus === "예치완료" && (
              <div className="mb-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">예치 완료</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  손해사정사가 업무를 완료하면 자동으로 지급됩니다.
                </p>
              </div>
            )}

            {/* 결제 버튼 */}
            {paymentStatus === "미결제" && (
              <Button
                onClick={handlePayment}
                disabled={!escrowEnabled}
                className="w-full h-12"
              >
                {escrowEnabled ? "안심결제하기" : "안심결제를 활성화해주세요"}
              </Button>
            )}

            {/* 환불 요청 버튼 */}
            {paymentStatus === "예치완료" && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("환불을 요청하시겠습니까? 손해사정사 승인 후 처리됩니다.")) {
                    alert("환불 요청이 접수되었습니다.")
                  }
                }}
                className="w-full h-12"
              >
                환불 요청
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 손해사정사 자료 요청 알림 */}
        {materialRequests.length > 0 && (
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">자료 요청 알림</h4>
                  <div className="space-y-2">
                    {materialRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-2 bg-white rounded border border-success/20"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {request.type} 요청됨
                          </span>
                          <Badge variant="warning" className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{request.date}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    손해사정사가 추가 자료를 요청했습니다. 아래에서 업로드해주세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 자료 목록 섹션 */}
        <Card>
          <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Upload className="w-5 h-5" />
                자료 목록
              </h3>
              {attachments.length > 0 && (
                <Badge variant="success" className="text-xs">
                  자료 보완 완료
                </Badge>
              )}
            </div>

            {attachments.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  초기 의뢰 시 첨부한 파일과 추가로 업로드한 자료가 여기에 표시됩니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 border border-border rounded-lg flex items-center gap-3"
                  >
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
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
                        {(file.size / 1024).toFixed(1)} KB · {file.uploadDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.thumbnail && (
                        <button
                          onClick={() => {
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
                          }}
                          className="p-2 hover:bg-muted rounded"
                          title="확대 보기"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => file.url && window.open(file.url, "_blank")}
                        className="p-2 hover:bg-muted rounded"
                        title="다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 hover:bg-muted rounded text-destructive"
                        title="삭제"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 추가 자료 업로드 버튼 */}
            <div className="relative upload-menu-container">
              <Button
                onClick={handleUploadClick}
                className="w-full h-12"
                disabled={attachments.length >= MAX_TOTAL_UPLOADS}
              >
                <Upload className="w-4 h-4 mr-2" />
                추가 자료 업로드
              </Button>
              {showUploadMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50">
                  <button
                    onClick={handleCameraClick}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-muted rounded flex items-center gap-3"
                  >
                    <Camera className="w-5 h-5" />
                    <div>
                      <div className="font-medium">카메라로 촬영</div>
                      <div className="text-xs text-muted-foreground">사진을 바로 촬영합니다</div>
                    </div>
                  </button>
                  <button
                    onClick={handleGalleryClick}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-muted rounded flex items-center gap-3"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <div>
                      <div className="font-medium">갤러리에서 선택</div>
                      <div className="text-xs text-muted-foreground">이미지, PDF, 문서 선택</div>
                    </div>
                  </button>
                </div>
              )}
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
            </div>
            {attachments.length >= MAX_TOTAL_UPLOADS && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                최대 업로드 제한에 도달했습니다. 손해사정사와 상담 후 추가 업로드를 부탁드려요.
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              업로드: {attachments.length}/{MAX_TOTAL_UPLOADS}장
            </p>
          </CardContent>
        </Card>

        {/* 보험 증권 자료 섹션 */}
        <Card>
          <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                보험 증권 자료
              </h3>
              <Badge
                variant={
                  policyStatus === "완료"
                    ? "success"
                    : policyStatus === "손해사정사 확인 중"
                    ? "warning"
                    : policyStatus === "제출 완료"
                    ? "default"
                    : "destructive"
                }
                className="text-xs"
              >
                {policyStatus}
              </Badge>
            </div>

            {policyStatus === "미제출" ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  보험증권을 제출하시면 손해사정사가 더 정확한 상담을 도와드릴 수 있습니다.
                </p>
                <Button
                  onClick={() => policyFileInputRef.current?.click()}
                  className="w-full h-12"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  보험증권 업로드
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 보험사 및 증권번호 */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">보험사</div>
                  <div className="font-medium text-foreground">{policyData.insuranceCompany}</div>
                  <div className="text-sm text-muted-foreground mt-2 mb-1">증권번호</div>
                  <div className="font-medium text-foreground">{policyData.policyNumber}</div>
                </div>

                {/* 업로드된 파일 리스트 */}
                {policyData.files.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      업로드된 파일
                    </label>
                    {policyData.files.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 border border-border rounded-lg flex items-center gap-3"
                      >
                        {file.thumbnail ? (
                          <img
                            src={file.thumbnail}
                            alt={file.name}
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
                            {(file.size / 1024).toFixed(1)} KB · {file.uploadDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.thumbnail && (
                            <button
                              onClick={() => {
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
                              }}
                              className="p-2 hover:bg-muted rounded"
                              title="확대 보기"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => file.url && window.open(file.url, "_blank")}
                            className="p-2 hover:bg-muted rounded"
                            title="다운로드"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 추가/수정 업로드 버튼 */}
                {policyData.files.length < MAX_POLICY_FILES && (
                  <Button
                    onClick={() => policyFileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    추가/수정 업로드
                  </Button>
                )}

                {/* 보안 안내 */}
                <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-primary-700">
                      <p>증권 자료는 손해사정사 직접 사정 보조용이며, 중개 목적 아님</p>
                      <p className="mt-1">개인정보는 암호화 저장되며 제3자에게 공유되지 않습니다</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={policyFileInputRef}
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length === 0) return

                if (policyData.files.length + files.length > MAX_POLICY_FILES) {
                  alert(`최대 ${MAX_POLICY_FILES}장까지 업로드 가능합니다.`)
                  return
                }

                if (!confirm("개인정보 암호화 저장됩니다. 업로드하시겠습니까?")) {
                  return
                }

                const newFiles: FileAttachment[] = files.map((file, index) => {
                  const fileId = Date.now().toString() + index
                  const fileType = file.type.startsWith("image/") ? "image" : file.type.includes("pdf") ? "pdf" : "document"
                  
                  const newFile: FileAttachment = {
                    id: fileId,
                    name: file.name,
                    type: fileType,
                    size: file.size,
                    uploadDate: new Date().toISOString().split("T")[0],
                  }

                  if (fileType === "image") {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      newFile.thumbnail = e.target?.result as string
                      setPolicyData((prev) => ({
                        ...prev,
                        files: [...prev.files, newFile],
                      }))
                    }
                    reader.readAsDataURL(file)
                  } else {
                    setPolicyData((prev) => ({
                      ...prev,
                      files: [...prev.files, newFile],
                    }))
                  }

                  return newFile
                })

                setPolicyStatus("제출 완료")
                alert("보험증권이 업로드되었습니다. 손해사정사가 확인 중입니다.")
              }}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* 사정서 섹션 */}
        <Card>
          <CardContent className="p-7 min-h-[140px] flex flex-col justify-start pt-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              사정서
            </h3>

            {initialRequestData.documents.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  사정서 초안을 생성하여 손해사정사에게 전송할 수 있습니다.
                </p>
                <Button
                  onClick={handleCreateDocument}
                  className="w-full h-12"
                >
                  사정서 초안 생성
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {initialRequestData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="p-3 border border-border rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          사정서 초안 {index + 1}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          초안이며 법적 효력 없음. 손해사정사 최종 검토 필수
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      보기
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={handleCreateDocument}
                  variant="outline"
                  className="w-full"
                >
                  새 사정서 생성
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 법적 안내 */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 min-h-[140px] flex flex-col justify-start pt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              본 앱은 [손해사정사 이름] 손해사정사의 개인 서비스 제공 도구이며, 어떠한 중개 수수료도 받지 않습니다.
              에스크로 및 사정서 템플릿은 손해사정사 직접 서비스 보조 툴로 제공됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
