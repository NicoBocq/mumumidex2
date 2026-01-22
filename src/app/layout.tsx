import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'

import './globals.css'

import Background from '@/components/layout/background'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { app } from '@/config/app'
import { cn } from '@/lib/utils'

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
    <html lang="en" suppressContentEditableWarning>
      <body className={cn(rubik.className, 'flex min-h-screen flex-col font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Background />
          <Header />
          <main className="flex flex-auto flex-col">
            <div className="mx-auto w-full max-w-5xl items-center justify-between px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
          {modal}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
