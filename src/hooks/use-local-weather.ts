'use client'

import { type SortMetric, calculateHumidex, calculateWindChill } from '@/lib/weather-metrics'
import { useEffect, useState } from 'react'

export type LocalWeather = {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  dewPoint: number
  humidex: number
  windChill: number
  isDay: boolean
  weatherCode: number
}

type LocalWeatherState = {
  weather: LocalWeather | null
  loading: boolean
  error: string | null
}

const STORAGE_KEY = 'mumumidex-local-weather'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

type StoredWeather = LocalWeather & { timestamp: number }

function getStoredWeather(): LocalWeather | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const data = JSON.parse(stored) as StoredWeather
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const { timestamp: _, ...weather } = data
    return weather
  } catch {
    return null
  }
}

function storeWeather(weather: LocalWeather) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...weather, timestamp: Date.now() }))
}

export function useLocalWeather(latitude: number | null, longitude: number | null) {
  const [state, setState] = useState<LocalWeatherState>({
    weather: null,
    loading: false,
    error: null,
  })

  useEffect(() => {
    if (latitude === null || longitude === null) return

    // Check cache first
    const cached = getStoredWeather()
    if (cached) {
      setState((prev) => {
        if (prev.weather && prev.weather.temperature === cached.temperature) return prev
        return { weather: cached, loading: false, error: null }
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,wind_speed_10m,is_day,weather_code',
      timezone: 'auto',
    })

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.current) {
          throw new Error('No weather data')
        }
        const weather: LocalWeather = {
          temperature: data.current.temperature_2m,
          apparentTemperature: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          dewPoint: data.current.dew_point_2m,
          humidex: calculateHumidex(data.current.temperature_2m, data.current.dew_point_2m),
          windChill: calculateWindChill(data.current.temperature_2m, data.current.wind_speed_10m),
          isDay: data.current.is_day === 1,
          weatherCode: data.current.weather_code,
        }
        storeWeather(weather)
        setState({ weather, loading: false, error: null })
      })
      .catch((err) => {
        setState({ weather: null, loading: false, error: err.message })
      })
  }, [latitude, longitude])

  return state
}

export function getSuggestedMetric(temperature: number): SortMetric {
  if (temperature > 25) return 'humidex'
  if (temperature <= 5) return 'windchill'
  return 'apparent'
}
