import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, TrendingUp, ShieldCheck, Users, Sparkles } from "lucide-react";

// 온보딩 데이터 구성
const onboardingSlides = [
  {
    title: "손해사정사의 실제\n성공 사례를 확인하세요",
    description: "다양한 사고 유형별 증액 사례를 확인하고,\n나의 케이스와 유사한 데이터를 비교해보세요.",
    color: "bg-blue-50",
    accent: "text-blue-600",
    icon: <TrendingUp className="w-20 h-20" />,
  },
  {
    title: "전문가와 함께하는\n든든한 권리 찾기",
    description: "검증된 손해사정사들이 당신의 편에서\n가장 정당한 보상을 받을 수 있도록 도와드립니다.",
    color: "bg-indigo-50",
    accent: "text-indigo-600",
    icon: <ShieldCheck className="w-20 h-20" />,
  },
  {
    title: "1:1 맞춤 상담으로\n빠르고 정확하게",
    description: "어려운 용어와 복잡한 절차는 잊으세요.\n채팅으로 간편하게 전문가의 조언을 듣습니다.",
    color: "bg-emerald-50",
    accent: "text-emerald-600",
    icon: <Users className="w-20 h-20" />,
  },
  {
    title: "이제 정당한 보상을\n받을 준비가 되셨나요?",
    description: "수많은 사용자가 경험한 신뢰의 서비스,\n지금 바로 첫 걸음을 시작해보세요.",
    color: "bg-slate-50",
    accent: "text-slate-900",
    icon: <Sparkles className="w-20 h-20" />,
  },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      // 실제 환경에서는 router.push("/") 사용
      console.log("메인 페이지로 이동");
    }
  };

  const skipOnboarding = () => {
    console.log("온보딩 건너뛰기");
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-700 ease-in-out ${onboardingSlides[currentSlide].color}`}>
      
      {/* 상단 바: 건너뛰기 버튼 */}
      <div className="flex justify-end p-6 h-16">
        {currentSlide < onboardingSlides.length - 1 && (
          <button
            onClick={skipOnboarding}
            className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* 메인 콘텐츠: 애니메이션 적용 영역 */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            {/* 아이콘 컨테이너 */}
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className={`w-48 h-48 rounded-[3rem] bg-white flex items-center justify-center mb-12 shadow-xl shadow-slate-200/50 ${onboardingSlides[currentSlide].accent}`}
            >
              {onboardingSlides[currentSlide].icon}
            </motion.div>

            {/* 텍스트 정보 */}
            <h2 className="text-[28px] font-bold text-slate-900 whitespace-pre-line leading-tight mb-6">
              {onboardingSlides[currentSlide].title}
            </h2>
            <p className="text-slate-500 text-lg whitespace-pre-line leading-relaxed break-keep">
              {onboardingSlides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 컨트롤러: 인디케이터 및 버튼 */}
      <div className="px-6 pb-12 space-y-8">
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

        {/* 액션 버튼 */}
        <button
          onClick={nextSlide}
          className="w-full h-16 bg-slate-900 text-white rounded-2xl text-lg font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
        >
          {currentSlide === onboardingSlides.length - 1 ? (
            "시작하기"
          ) : (
            <>
              다음
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        body {
          font-family: 'Pretendard', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}