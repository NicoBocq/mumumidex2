'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { useGeolocation } from '@/hooks/use-geolocation'
import { type LocalWeather, useLocalWeather } from '@/hooks/use-local-weather'

type LocalWeatherContextValue = {
  weather: LocalWeather | null
  loading: boolean
  error: string | null
  permission: 'granted' | 'denied' | 'prompt' | 'unknown'
  requestLocation: () => void
}

const LocalWeatherContext = createContext<LocalWeatherContextValue | null>(null)

export function LocalWeatherProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocation()
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useLocalWeather(geo.latitude, geo.longitude)

  return (
    <LocalWeatherContext.Provider
      value={{
        weather,
        loading: geo.loading || weatherLoading,
        error: geo.error || weatherError,
        permission: geo.permission,
        requestLocation: geo.requestLocation,
      }}
    >
      {children}
    </LocalWeatherContext.Provider>
  )
}

export function useLocalWeatherContext() {
  const context = useContext(LocalWeatherContext)
  if (!context) {
    throw new Error('useLocalWeatherContext must be used within a LocalWeatherProvider')
  }
  return context
}
