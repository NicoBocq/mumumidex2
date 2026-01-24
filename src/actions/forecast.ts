'use server'
import type { APIForecast, Forecast } from '@/types/forecast'

import { auth } from '@/lib/auth'
import type { City } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { DEFAULT_LOCATIONS } from '@/config/city'
import { calculateHumidex, calculateWindChill } from '@/lib/weather-metrics'

import { getUserCities } from './city'

type getForecastReturnType = {
  data: Forecast[]
  error: string
}

async function returnCities(): Promise<City[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return DEFAULT_LOCATIONS
  }
  const { data: cities } = await getUserCities({
    userId: session.user.id,
    hideHidden: true,
  })
  return cities || []
}

export const getForecast = async (): Promise<getForecastReturnType> => {
  const cities = await returnCities()
  if (!cities.length) {
    return {
      data: [],
      error: '',
    }
  }
  const params = new URLSearchParams({
    latitude: cities.map((c) => c.latitude.toString()).join(','),
    longitude: cities.map((c) => c.longitude.toString()).join(','),
    timezone: 'auto',
    current:
      'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,is_day,precipitation,cloud_cover,weather_code',
    hourly: 'temperature_2m,precipitation',
    forecast_days: '2',
  })
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 900 },
    })
    const data = await response.json()
    if (!data) {
      throw new Error('No data returned from OpenWeather API')
    }
    const result = Array.isArray(data) ? data : [data]

    const processedResult: Forecast[] = result.map((item: APIForecast, index: number) => ({
      ...item,
      city: {
        ...cities[index],
      },
      current: {
        ...item.current,
        humidex: calculateHumidex(item.current.temperature_2m, item.current.dew_point_2m),
        windChill: calculateWindChill(item.current.temperature_2m, item.current.wind_speed_10m),
      },
    }))
    return {
      data: processedResult,
      error: '',
    }
  } catch (error) {
    console.error(error)
    return {
      data: [],
      error: 'Error fetching forecast',
    }
  }
}

export async function reload() {
  revalidatePath('/')
}
