'use client'

import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { useEffect, useRef } from 'react'

export function AutoGeolocate() {
  const { requestLocation, permission } = useLocalWeatherContext()
  const hasRequested = useRef(false)

  useEffect(() => {
    // Only request once on mount if not already denied
    // We want to trigger the browser prompt immediately
    if (!hasRequested.current && permission !== 'denied' && permission !== 'granted') {
      hasRequested.current = true
      requestLocation()
    }
  }, [permission, requestLocation])

  return null
}
