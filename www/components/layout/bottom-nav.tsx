"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"
import { 
  Home, 
  MessageSquare,
  FileText, 
  Scale, 
  UserCircle 
} from "lucide-react"

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/consult", label: "상담", icon: MessageSquare },
  { href: "/requests", label: "의뢰", icon: FileText },
  { href: "/cases", label: "판례", icon: Scale },
  { href: "/profile", label: "프로필", icon: UserCircle },
]

export function BottomNav() {
  const pathname = usePathname()

  // 로그인/온보딩/스플래시/의뢰 신청 화면에서는 네비게이션 숨김
  if (
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/splash") ||
    pathname?.startsWith("/requests/new")
  ) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors min-w-[48px]",
                isActive
                  ? "text-primary-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
