import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'

import './globals.css'

import { app } from '@/config/app'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Toaster } from '@/components/ui/sonner'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'

const rubik = Rubik({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: app.name,
  description: app.description,
  verification: {
    google: 'SoTUK0J0yOG_ZDjwJrAWCUANoSOSzEMu3zSvqrwkZr0',
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          rubik.className,
          'bg-gradient-to-b from-amber-100 to-amber-50 font-sans antialiased',
        )}
      >
        <div className="container">
          <Header />
          <ScrollArea className="h-[calc(100vh-104px)]">
            <ScrollBar />
            {children}
          </ScrollArea>
          <Footer />
          {modal}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
