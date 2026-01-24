'use client'

import type { SortMetric } from '@/lib/weather-metrics'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'mumumidex-sort-preference'
const USER_CHOICE_KEY = 'mumumidex-sort-user-choice'
const DEFAULT_METRIC: SortMetric = 'apparent'

type SortMetricContextValue = {
  sortMetric: SortMetric
  setSortMetric: (metric: SortMetric) => void
  setAutoMetric: (metric: SortMetric) => void
}

const SortMetricContext = createContext<SortMetricContextValue | null>(null)

function isValidMetric(value: string): value is SortMetric {
  return ['apparent', 'humidex', 'windchill'].includes(value)
}

function hasUserChoice(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(USER_CHOICE_KEY) === 'true'
}

export function SortMetricProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sortMetric, setSortMetricState] = useState<SortMetric>(() => {
    // Priority: URL param > localStorage > default
    const urlParam = searchParams.get('sort')
    if (urlParam && isValidMetric(urlParam)) {
      return urlParam as SortMetric
    }
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && isValidMetric(stored)) {
        return stored as SortMetric
      }
    }
    return DEFAULT_METRIC
  })

  // Sync from URL on change
  useEffect(() => {
    const urlParam = searchParams.get('sort')
    if (urlParam && isValidMetric(urlParam)) {
      setSortMetricState(urlParam as SortMetric)
    }
  }, [searchParams])

  const updateUrl = useCallback(
    (metric: SortMetric) => {
      const params = new URLSearchParams(searchParams.toString())
      if (metric === DEFAULT_METRIC) {
        params.delete('sort')
      } else {
        params.set('sort', metric)
      }
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newUrl, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  // User explicitly chooses a metric
  const setSortMetric = useCallback(
    (metric: SortMetric) => {
      setSortMetricState(metric)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, metric)
        localStorage.setItem(USER_CHOICE_KEY, 'true')
      }
      updateUrl(metric)
    },
    [updateUrl]
  )

  // Auto-select based on weather (only if user hasn't chosen)
  // Does NOT update URL to avoid re-render loops
  const setAutoMetric = useCallback((metric: SortMetric) => {
    if (hasUserChoice()) return
    setSortMetricState((prev) => {
      if (prev === metric) return prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, metric)
      }
      return metric
    })
  }, [])

  return (
    <SortMetricContext.Provider value={{ sortMetric, setSortMetric, setAutoMetric }}>
      {children}
    </SortMetricContext.Provider>
  )
}

export function useSortMetricContext() {
  const context = useContext(SortMetricContext)
  if (!context) {
    throw new Error('useSortMetricContext must be used within a SortMetricProvider')
  }
  return context
}
