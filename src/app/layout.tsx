import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'

import './globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { AutoGeolocate } from '@/components/layout/auto-geolocate'
import { AutoRefresh } from '@/components/layout/auto-refresh'
import Background from '@/components/layout/background'
import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'

import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { app } from '@/config/app'
import { LocalWeatherProvider } from '@/contexts/local-weather-context'
import { SortMetricProvider } from '@/contexts/sort-metric-context'
import { cn } from '@/lib/utils'

const rubik = Rubik({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(app.url),
  title: app.name,
  description: app.description,
  icons: {
    icon: { url: '/api/icon?format=svg', type: 'image/svg+xml' },
    apple: '/api/icon?size=180',
  },
  verification: {
    google: 'SoTUK0J0yOG_ZDjwJrAWCUANoSOSzEMu3zSvqrwkZr0',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressContentEditableWarning
      suppressHydrationWarning
      className={cn(rubik.className)}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocalWeatherProvider>
            <AutoGeolocate />
            <AutoRefresh />
            <Suspense>
              <SortMetricProvider>
                <Background />
                <Header />
                <main className="flex flex-auto flex-col">
                  <div className="mx-auto w-full max-w-5xl items-center justify-between px-6 lg:px-8">
                    {children}
                  </div>
                </main>
                <Footer />
                <Toaster />
              </SortMetricProvider>
            </Suspense>
          </LocalWeatherProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="53136dd2-b4f8-4b7e-9074-ccd2a7deb68a"
          data-domains="mmdex.1h12.com"
        />
      </body>
    </html>
  )
}
