'use server'

import { DefaultCity } from '@/types/city'
import { APIForecast, Forecast } from '@/types/forecast'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { City } from '@prisma/client'

import { DEFAULT_LOCATIONS } from '@/config/city'
import { getHumidex } from '@/lib/humidex'

import { getUserCities } from './city'

type getForecastReturnType = {
  data: Forecast[]
  error: string
}

async function returnCities(): Promise<City[]> {
  const session = await auth()
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
      'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,wind_speed_10m,is_day',
  })
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      {
        cache: 'no-store',
      },
    )
    const data = await response.json()
    if (!data) {
      throw new Error('No data returned from OpenWeather API')
    }
    const result = Array.isArray(data) ? data : [data]

    const processedResult: Forecast[] = result
      .map((item: APIForecast, index: number) => ({
        ...item,
        city: {
          ...cities[index],
        },
        current: {
          ...item.current,
          humidex: getHumidex({
            temperature: item.current.temperature_2m,
            humidity: item.current.relative_humidity_2m,
            dewPoint: item.current.dew_point_2m,
          }),
        },
      }))
      .sort((b, a) => a.current.humidex - b.current.humidex)
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
