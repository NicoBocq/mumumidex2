'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes

export function AutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    const refresh = () => {
      const lastRefresh = localStorage.getItem('lastRefresh')
      if (!lastRefresh || Date.now() - Number(lastRefresh) > REFRESH_INTERVAL) {
        router.refresh()
        localStorage.setItem('lastRefresh', Date.now().toString())
        window.dispatchEvent(new Event('mumumidex-refresh'))
      }
    }

    // Refresh on mount if stale (PWA cold start)
    refresh()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [router])

  return null
}
