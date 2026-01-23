'use client'

import { useCallback, useEffect, useState } from 'react'

export type GeolocationState = {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
  permission: 'granted' | 'denied' | 'prompt' | 'unknown'
}

const STORAGE_KEY = 'mumumidex-geolocation'

type StoredLocation = {
  latitude: number
  longitude: number
  timestamp: number
}

// Cache location for 1 hour
const CACHE_DURATION = 60 * 60 * 1000

function getStoredLocation(): StoredLocation | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const data = JSON.parse(stored) as StoredLocation
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

function storeLocation(latitude: number, longitude: number) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ latitude, longitude, timestamp: Date.now() }))
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permission: 'unknown',
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation not supported',
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        storeLocation(latitude, longitude)
        setState({
          latitude,
          longitude,
          error: null,
          loading: false,
          permission: 'granted',
        })
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
          permission: error.code === 1 ? 'denied' : prev.permission,
        }))
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: CACHE_DURATION,
      }
    )
  }, [])

  useEffect(() => {
    // Check cached location first
    const cached = getStoredLocation()
    if (cached) {
      setState({
        latitude: cached.latitude,
        longitude: cached.longitude,
        error: null,
        loading: false,
        permission: 'granted',
      })
      return
    }

    // Check permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setState((prev) => ({
          ...prev,
          permission: result.state as GeolocationState['permission'],
        }))
        if (result.state === 'granted') {
          requestLocation()
        } else {
          setState((prev) => ({ ...prev, loading: false }))
        }
      })
    } else {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }, [requestLocation])

  return { ...state, requestLocation }
}
