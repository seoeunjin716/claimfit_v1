"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, TrendingUp, ShieldCheck, Users, Sparkles } from "lucide-react";

const onboardingSlides = [
  {
    title: "최신 판례와 전문가의\n법률 자문을 확인하세요",
    description: "내 사고와 유사한 판례 데이터를 검색하고,\n전문적인 법률 검토 결과를 미리 확인해보세요.",
    color: "bg-blue-50/50",
    accent: "text-blue-600",
    icon: <TrendingUp className="w-10 h-10" />, // 크기 축소 (w-20 -> w-10)
  },
  {
    title: "전문가와 함께하는\n든든한 권리 찾기",
    description: "검증된 손해사정사들이 당신의 편에서\n가장 정당한 보상을 받을 수 있도록 도와드립니다.",
    color: "bg-indigo-50/50",
    accent: "text-indigo-600",
    icon: <ShieldCheck className="w-10 h-10" />,
  },
  {
    title: "1:1 맞춤 상담으로\n빠르고 정확하게",
    description: "어려운 용어와 복잡한 절차는 잊으세요.\n채팅으로 간편하게 전문가의 조언을 듣습니다.",
    color: "bg-emerald-50/50",
    accent: "text-emerald-600",
    icon: <Users className="w-10 h-10" />,
  },
  {
    title: "이제 정당한 보상을\n받을 준비가 되셨나요?",
    description: "수많은 사용자가 경험한 신뢰의 서비스,\n지금 바로 첫 걸음을 시작해보세요.",
    color: "bg-slate-50",
    accent: "text-slate-900",
    icon: <Sparkles className="w-10 h-10" />,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleComplete = () => {
    localStorage.setItem("has_seen_onboarding", "true");
    window.location.href = "/"; 
  };

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-700 ease-in-out ${onboardingSlides[currentSlide].color}`}>
      
      {/* 상단 바 */}
      <div className="flex justify-end p-6 h-16">
        {currentSlide < onboardingSlides.length - 1 && (
          <button
            onClick={handleComplete}
            className="text-[14px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
          >
            {/* 아이콘 컨테이너: 크기를 w-48에서 w-24로 축소하여 세련미 강조 */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center mb-10 shadow-lg shadow-slate-200/40 ${onboardingSlides[currentSlide].accent}`}
            >
              {onboardingSlides[currentSlide].icon}
            </motion.div>

            {/* 타이틀: 28px -> 24px로 조정하여 가독성 확보 */}
            <h2 className="text-[24px] font-bold text-slate-900 whitespace-pre-line leading-[1.35] mb-4 tracking-tight">
              {onboardingSlides[currentSlide].title}
            </h2>
            
            {/* 설명문: 18px -> 15px로 조정 */}
            <p className="text-slate-500 text-[15px] whitespace-pre-line leading-relaxed break-keep font-medium opacity-90">
              {onboardingSlides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

        {/* 하단 컨트롤러: 버튼을 더 크고 강조되게 수정 */}
        <div className="px-6 pb-14 space-y-10"> {/* 바닥 여백을 더 확보 (pb-12 -> pb-14) */}
        
        {/* 인디케이터 (Dots) */}
        <div className="flex justify-center gap-2">
          {onboardingSlides.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                width: index === currentSlide ? 32 : 8,
                backgroundColor: index === currentSlide ? "#0f172a" : "#cbd5e1",
              }}
              className="h-2 rounded-full transition-all duration-300"
            />
          ))}
        </div>

        {/* 액션 버튼: 높이와 둥글기, 그림자를 대폭 강화 */}
        <button
          onClick={nextSlide}
          style={{ height: '36px' }} // 높이를 72px로 강제 고정 (매우 시원해짐)
          className="
            w-full
            bg-[#0f172a] 
            text-white 
            rounded-[20px] 
            text-[16px]       /* 글자 크기를 더 키워 시인성 확보 */
            font-bold 
            flex items-center justify-center gap-3 
            active:scale-[0.97] 
            transition-all 
            shadow-[0_10px_25px_-5px_rgba(15,23,42,0.2)]
          "
        >
          {currentSlide === onboardingSlides.length - 1 ? (
            "지금 바로 시작하기"
          ) : (
            <>
              다음
              <ChevronRight className="w-6 h-6 stroke-[2.5]" /> {/* 아이콘도 더 선명하게 */}
            </>
          )}
        </button>
      </div>
    </div>
  );
}