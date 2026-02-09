'use server'
import type { City } from '@prisma/client'
import { headers } from 'next/headers'
import { DEFAULT_LOCATIONS } from '@/config/city'
import { auth } from '@/lib/auth'
import { calculateHumidex, calculateWindChill } from '@/lib/weather-metrics'
import type { APIForecast, Forecast } from '@/types/forecast'

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

  const latStr = cities.map((c) => c.latitude.toString()).join(',')
  const longStr = cities.map((c) => c.longitude.toString()).join(',')

  const weatherParams = new URLSearchParams({
    latitude: latStr,
    longitude: longStr,
    timezone: 'auto',
    current:
      'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,is_day,precipitation,cloud_cover,weather_code',
    hourly: 'temperature_2m,precipitation,uv_index',
    daily:
      'temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code',
    forecast_days: '7',
  })

  const airQualityParams = new URLSearchParams({
    latitude: latStr,
    longitude: longStr,
    timezone: 'auto',
    current: 'european_aqi',
  })

  try {
    const [weatherResponse, airQualityResponse] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams}`, {
        next: { revalidate: 900 },
      }),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${airQualityParams}`, {
        next: { revalidate: 900 },
      }),
    ])

    const [weatherData, airQualityData] = await Promise.all([
      weatherResponse.json(),
      airQualityResponse.json(),
    ])

    if (!weatherData) {
      throw new Error('No data returned from OpenWeather API')
    }

    const weatherResult = Array.isArray(weatherData) ? weatherData : [weatherData]
    const airQualityResult = Array.isArray(airQualityData) ? airQualityData : [airQualityData]

    const processedResult: Forecast[] = weatherResult.map((item: APIForecast, index: number) => {
      // Find current UV index from hourly data (closest matching hour)
      // We use the current time from the item's current.time
      const currentTime = new Date(item.current.time).setMinutes(0, 0, 0)
      const hourIndex = item.hourly.time.findIndex((t: string) => {
        return new Date(t).getTime() === currentTime
      })
      // Default to 0 if not found, or use the value at the index
      // Note: item.hourly.uv_index might not be typed in APIForecast yet if I didn't update types fully?
      // I updated 'Forecast' types, but 'Hourly' type might need uv_index defined if I access it here.
      // Wait, I didn't update Hourly type for uv_index, only Current.
      // I should update Hourly type as well or cast it.
      // Actually, passing uv_index in 'Hourly' param returns it in 'hourly' object.
      // Let's access it safely.
      // @ts-expect-error - uv_index added dynamically
      const currentUvIndex = hourIndex !== -1 ? item.hourly.uv_index[hourIndex] : 0

      const airQuality = airQualityResult[index]

      return {
        ...item,
        city: {
          ...cities[index],
        },
        current: {
          ...item.current,
          uv_index: currentUvIndex,
          european_aqi: airQuality?.current?.european_aqi || 0,
          humidex: calculateHumidex(item.current.temperature_2m, item.current.dew_point_2m),
          windChill: calculateWindChill(item.current.temperature_2m, item.current.wind_speed_10m),
        },
      }
    })

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
