'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes

export function AutoRefresh() {
  const router = useRouter()

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const lastRefresh = localStorage.getItem('lastRefresh')
        if (!lastRefresh || Date.now() - Number(lastRefresh) > REFRESH_INTERVAL) {
          router.refresh()
          localStorage.setItem('lastRefresh', Date.now().toString())
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [router])

  return null
}
