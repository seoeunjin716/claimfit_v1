"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ShieldCheck, 
  Sparkles,
  HeartHandshake
} from "lucide-react"

// --- 서비스별 공식 비율을 반영한 커스텀 SVG 아이콘 ---

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9 2.5C5.13401 2.5 2 5.0315 2 8.155C2 10.183 3.32843 11.968 5.34975 12.973L4.796 15.003C4.708 15.326 5.081 15.602 5.356 15.42L7.766 13.829C8.169 13.883 8.581 13.91 9 13.91C12.866 13.91 16 11.3785 16 8.255C16 5.1315 12.866 2.5 9 2.5Z" fill="currentColor"/>
  </svg>
)

const NaverIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.49333 7.49275L4.30133 0H0V14H4.50667V6.50725L9.69867 14H14V0H9.49333V7.49275Z" fill="white"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
)

// --- 메인 페이지 컴포넌트 ---

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (provider: "kakao" | "naver" | "google") => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("auth_token", `mock_token_${provider}`)
      localStorage.setItem("has_seen_onboarding", "false")
      router.push("/onboarding")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-between px-8 py-16 relative overflow-hidden">
      
      {/* 은은하고 고급스러운 배경 장식 */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-[#FFECD2]/30 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#E0E7FF]/30 rounded-full blur-[80px] pointer-events-none" />

      {/* 상단: 로고 및 타이틀 영역 */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="relative mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-indigo-200/50 rotate-3 transition-transform hover:rotate-0 duration-500">
            <HeartHandshake className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 bg-orange-400 rounded-full p-2 shadow-lg border-2 border-white">
            <Sparkles className="w-3.5 h-3.5 text-white fill-current" />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            모두의 사정 <span className="text-indigo-600 font-normal italic ml-1">Claimfit</span>
          </h1>
          <div className="h-0.5 w-12 bg-indigo-100 mx-auto rounded-full" />
          <p className="text-[15px] text-slate-500 leading-relaxed font-light">
            어려운 순간, 당신의 편이 되어드릴게요.<br />
            <span className="text-slate-800 font-medium tracking-tight text-sm">따뜻한 전문가와 함께 정당한 권리를 찾으세요.</span>
          </p>
        </div>
      </div>

      {/* 중앙: 소셜 로그인 버튼 그룹 (높이 h-12 및 아이콘 교정) */}
      <div className="w-full max-w-sm space-y-3 z-10 mt-10">
        <Button
          onClick={() => handleSocialLogin("kakao")}
          disabled={isLoading}
          style={{ backgroundColor: "#FEE500", color: "#191919" }}
          className="w-full h-12 rounded-2xl border-none shadow-sm hover:brightness-[0.98] transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-sm"
        >
          <KakaoIcon />
          카카오로 시작하기
        </Button>

        <Button
          onClick={() => handleSocialLogin("naver")}
          disabled={isLoading}
          style={{ backgroundColor: "#03C75A", color: "#FFFFFF" }}
          className="w-full h-12 rounded-2xl border-none shadow-sm hover:brightness-[0.98] transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-sm"
        >
          <NaverIcon />
          네이버로 시작하기
        </Button>

        <Button
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
          variant="outline"
          className="w-full h-12 bg-white text-slate-700 border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 font-bold text-sm"
        >
          <GoogleIcon />
          Google로 시작하기
        </Button>

        <button 
          onClick={() => router.push("/")}
          className="w-full py-3 text-[13px] text-slate-400 hover:text-indigo-500 transition-colors font-medium mt-2"
        >
          로그인 없이 천천히 둘러보기
        </button>
      </div>

      {/* 하단: 안내 사항 */}
      <div className="w-full max-w-sm z-10 flex flex-col gap-6">
        <div className="py-5 px-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white flex items-start gap-3 shadow-sm shadow-indigo-100/10">
          <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
          <p className="text-[10.5px] text-slate-400 leading-relaxed font-light">
            본 서비스는 <strong className="text-slate-600">[손해사정사 이름]</strong>의 개인 서비스 공간입니다. 
            상담 과정에서 어떠한 중개 수수료도 발생하지 않는 투명한 권리 보호를 약속합니다.
          </p>
        </div>
        <p className="text-[10px] text-slate-300 text-center">
          로그인 시 <Link href="/terms" className="underline">이용약관</Link> 및 <Link href="/privacy" className="underline">개인정보 처리방침</Link> 동의 간주
        </p>
      </div>

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#FDFCFB]/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-6 h-6 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}