'use client'

import type { SortMetric } from '@/lib/weather-metrics'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'mumumidex-sort-preference'
const DEFAULT_METRIC: SortMetric = 'apparent'

export function useSortPreference() {
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

  // Sync from URL on mount
  useEffect(() => {
    const urlParam = searchParams.get('sort')
    if (urlParam && isValidMetric(urlParam)) {
      setSortMetricState(urlParam as SortMetric)
    }
  }, [searchParams])

  const setSortMetric = useCallback(
    (metric: SortMetric) => {
      setSortMetricState(metric)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, metric)
      }

      // Update URL
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

  return { sortMetric, setSortMetric }
}

function isValidMetric(value: string): value is SortMetric {
  return ['apparent', 'humidex', 'windchill'].includes(value)
}
