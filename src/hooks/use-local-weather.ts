'use client'

import { useEffect, useState } from 'react'
import { calculateHumidex, calculateWindChill, type SortMetric } from '@/lib/weather-metrics'

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
  locationName?: string
}

type LocalWeatherState = {
  weather: LocalWeather | null
  loading: boolean
  error: string | null
}

const STORAGE_KEY = 'mumumidex-local-weather'
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

type StoredWeather = LocalWeather & {
  timestamp: number
  latitude: number
  longitude: number
}

const LOCATION_THRESHOLD = 0.01 // ~1km

function getStoredWeather(latitude: number, longitude: number): LocalWeather | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const data = JSON.parse(stored) as StoredWeather
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    if (
      Math.abs(data.latitude - latitude) > LOCATION_THRESHOLD ||
      Math.abs(data.longitude - longitude) > LOCATION_THRESHOLD
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    const { timestamp: _, latitude: _lat, longitude: _lon, ...weather } = data
    return weather
  } catch {
    return null
  }
}

function storeWeather(weather: LocalWeather, latitude: number, longitude: number) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...weather, timestamp: Date.now(), latitude, longitude })
  )
}

export function useLocalWeather(latitude: number | null, longitude: number | null) {
  const [state, setState] = useState<LocalWeatherState>({
    weather: null,
    loading: false,
    error: null,
  })
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const handleRefresh = () => {
      localStorage.removeItem(STORAGE_KEY)
      setRefreshKey((k) => k + 1)
    }
    window.addEventListener('mumumidex-refresh', handleRefresh)
    return () => window.removeEventListener('mumumidex-refresh', handleRefresh)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey forces re-fetch on auto-refresh
  useEffect(() => {
    if (latitude === null || longitude === null) return

    const cached = getStoredWeather(latitude, longitude)
    if (cached) {
      setState((prev) => {
        if (prev.weather && prev.weather.temperature === cached.temperature) return prev
        return { weather: cached, loading: false, error: null }
      })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const weatherParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current:
        'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,wind_speed_10m,is_day,weather_code',
      timezone: 'auto',
    })

    const geocodingParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      localityLanguage: 'fr',
    })

    Promise.allSettled([
      fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams}`).then((res) => res.json()),
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${geocodingParams}`).then(
        (res) => res.json()
      ),
    ])
      .then(([weatherResult, geoResult]) => {
        // Handle weather (critical)
        if (weatherResult.status === 'rejected' || !weatherResult.value.current) {
          throw new Error('No weather data')
        }
        const weatherData = weatherResult.value

        // Handle location (optional)
        const locationName =
          geoResult.status === 'fulfilled'
            ? geoResult.value.city || geoResult.value.locality
            : undefined

        const weather: LocalWeather = {
          temperature: weatherData.current.temperature_2m,
          apparentTemperature: weatherData.current.apparent_temperature,
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: weatherData.current.wind_speed_10m,
          dewPoint: weatherData.current.dew_point_2m,
          humidex: calculateHumidex(
            weatherData.current.temperature_2m,
            weatherData.current.dew_point_2m
          ),
          windChill: calculateWindChill(
            weatherData.current.temperature_2m,
            weatherData.current.wind_speed_10m
          ),
          isDay: weatherData.current.is_day === 1,
          weatherCode: weatherData.current.weather_code,
          locationName,
        }
        storeWeather(weather, latitude, longitude)
        setState({ weather, loading: false, error: null })
      })
      .catch((err) => {
        console.error('Weather fetch error:', err)
        setState({ weather: null, loading: false, error: err.message })
      })
  }, [latitude, longitude, refreshKey])

  return state
}

export function getSuggestedMetric(temperature: number): SortMetric {
  if (temperature > 25) return 'humidex'
  if (temperature <= 5) return 'windchill'
  return 'apparent'
}
