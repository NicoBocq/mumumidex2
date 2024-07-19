import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'

import './globals.css'

import { app } from '@/config/app'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toaster } from '@/components/ui/sonner'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'

export const rubik = Rubik({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(app.url),
  title: app.name,
  description: app.description,
  openGraph: {
    title: app.name,
    description: app.description,
    images: '/og-image.png',
  },
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
          'flex min-h-screen flex-col bg-gradient-to-b from-amber-100 to-amber-50 font-sans antialiased',
        )}
      >
        <Header />
        <main className="flex flex-auto flex-col">
          <div className="mx-auto w-full max-w-7xl flex-1 items-center justify-between p-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
        {modal}
        <Toaster />
      </body>
    </html>
  )
}
