"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx } from "clsx"
import { 
  Home, 
  ClipboardList, 
  MessageSquare, 
  Users, 
  UserCircle 
} from "lucide-react"

const navItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/requests", label: "의뢰", icon: ClipboardList },
  { href: "/chat", label: "채팅", icon: MessageSquare },
  { href: "/community", label: "커뮤니티", icon: Users },
  { href: "/profile", label: "마이", icon: UserCircle },
]

export function BottomNav() {
  const pathname = usePathname()

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
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
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
