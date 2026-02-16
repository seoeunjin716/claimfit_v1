import type { Metadata } from 'next'
import './globals.css'
import { BottomNav } from '@/components/layout/bottom-nav'
import { ChatProvider } from '@/contexts/chat-context'

export const metadata: Metadata = {
  title: '사정의 고수',
  description: '손해사정 전문 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen pb-16">
        <ChatProvider>
          {children}
          <BottomNav />
        </ChatProvider>
      </body>
    </html>
  )
}
