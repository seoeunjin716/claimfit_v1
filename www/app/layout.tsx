import type { Metadata } from 'next'
import './globals.css'
import { BottomNav } from '@/components/layout/bottom-nav'
import { ChatProvider } from '@/contexts/chat-context'

export const metadata: Metadata = {
  title: '모두의 사정 - Claimfit 손해사정',
  description: '모두의 사정을 말해주세요. 각각 사정에 맞는 손해사정 서비스를 제공합니다.',
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
