'use client'

import { useEffect, useRef } from 'react'
import { useLocalWeatherContext } from '@/contexts/local-weather-context'

export function AutoGeolocate() {
  const { requestLocation, permission } = useLocalWeatherContext()
  const hasRequested = useRef(false)

  useEffect(() => {
    if (!hasRequested.current && permission !== 'denied' && permission !== 'granted') {
      hasRequested.current = true
      // Delay to let the user see the app before the browser prompt
      const timer = setTimeout(() => requestLocation(), 3000)
      return () => clearTimeout(timer)
    }
  }, [permission, requestLocation])

  return null
}
