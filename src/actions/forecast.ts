'use server'
import type { City } from '@prisma/client'
import { DEFAULT_LOCATIONS } from '@/config/city'
import { getServerSession } from '@/lib/server-session'
import { calculateHumidex, calculateWindChill } from '@/lib/weather-metrics'
import type {
  APIForecastBase,
  Forecast,
  ForecastActionResult,
  ForecastDetailsActionParams,
  ForecastDetailsActionResult,
} from '@/types/forecast'

import { getUserCities } from './city'

async function returnCities(): Promise<City[]> {
  const session = await getServerSession()
  if (!session) {
    return DEFAULT_LOCATIONS
  }
  const { data: cities } = await getUserCities({
    userId: session.user.id,
  })
  return cities || []
}

export const getForecast = async (): Promise<ForecastActionResult> => {
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
      'temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,is_day,weather_code',
    hourly: 'temperature_2m',
    forecast_days: '2',
  })

  try {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${weatherParams}`, {
      next: { revalidate: 900 },
    })
    if (!weatherResponse.ok) {
      throw new Error('Open-Meteo forecast request failed')
    }
    const weatherData = await weatherResponse.json()

    if (!weatherData) {
      throw new Error('No data returned from OpenWeather API')
    }

    const weatherResult: APIForecastBase[] = Array.isArray(weatherData)
      ? weatherData
      : [weatherData]
    const processedResult: Forecast[] = weatherResult.map((item, index) => {
      return {
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone,
        utc_offset_seconds: item.utc_offset_seconds,
        city: {
          ...cities[index],
        },
        current: {
          ...item.current,
          precipitation: 0,
          cloud_cover: 0,
          uv_index: 0,
          european_aqi: 0,
          humidex: calculateHumidex(item.current.temperature_2m, item.current.dew_point_2m),
          windChill: calculateWindChill(item.current.temperature_2m, item.current.wind_speed_10m),
        },
        current_units: {
          time: item.current_units.time ?? 'iso8601',
          interval: item.current_units.interval ?? 'seconds',
          temperature_2m: item.current_units.temperature_2m ?? '°C',
          relative_humidity_2m: item.current_units.relative_humidity_2m ?? '%',
          dew_point_2m: item.current_units.dew_point_2m ?? '°C',
          apparent_temperature: item.current_units.apparent_temperature ?? '°C',
          wind_speed_10m: item.current_units.wind_speed_10m ?? 'km/h',
          wind_direction_10m: item.current_units.wind_direction_10m ?? '°',
          is_day: item.current_units.is_day ?? '',
          precipitation: item.current_units.precipitation ?? 'mm',
          cloud_cover: item.current_units.cloud_cover ?? '%',
          weather_code: item.current_units.weather_code ?? 'wmo code',
          uv_index: item.current_units.uv_index ?? '',
          european_aqi: item.current_units.european_aqi ?? '',
        },
        hourly: {
          time: item.hourly.time,
          temperature_2m: item.hourly.temperature_2m,
          precipitation: [],
        },
        hourly_units: {
          time: item.hourly_units.time ?? 'iso8601',
          temperature_2m: item.hourly_units.temperature_2m ?? '°C',
          precipitation: item.hourly_units.precipitation ?? 'mm',
        },
        daily: {
          time: [],
          temperature_2m_max: [],
          temperature_2m_min: [],
          precipitation_probability_max: [],
          wind_speed_10m_max: [],
          weather_code: [],
        },
        daily_units: {
          time: 'iso8601',
          temperature_2m_max: '°C',
          temperature_2m_min: '°C',
          precipitation_probability_max: '%',
          wind_speed_10m_max: 'km/h',
          weather_code: 'wmo code',
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

export const getForecastDetails = async ({
  latitude,
  longitude,
}: ForecastDetailsActionParams): Promise<ForecastDetailsActionResult> => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { data: null, error: 'Invalid coordinates' }
  }

  const weatherParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone: 'auto',
    current: 'cloud_cover',
    hourly: 'uv_index',
    daily:
      'temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code',
    forecast_days: '7',
  })

  const airQualityParams = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
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

    if (!weatherResponse.ok || !airQualityResponse.ok) {
      throw new Error('Forecast details request failed')
    }

    const [weatherData, airQualityData] = await Promise.all([
      weatherResponse.json(),
      airQualityResponse.json(),
    ])

    const currentTime = weatherData?.current?.time
    const roundedCurrentTime = currentTime ? new Date(currentTime).setMinutes(0, 0, 0) : null
    const hourlyTimes: string[] = weatherData?.hourly?.time ?? []
    const hourlyUvIndex: number[] = weatherData?.hourly?.uv_index ?? []
    const hourIndex =
      roundedCurrentTime === null
        ? -1
        : hourlyTimes.findIndex((time) => new Date(time).getTime() === roundedCurrentTime)

    return {
      data: {
        current: {
          cloud_cover: weatherData?.current?.cloud_cover ?? 0,
          uv_index: hourIndex >= 0 ? (hourlyUvIndex[hourIndex] ?? 0) : 0,
          european_aqi: airQualityData?.current?.european_aqi ?? 0,
        },
        daily: {
          time: weatherData?.daily?.time ?? [],
          temperature_2m_max: weatherData?.daily?.temperature_2m_max ?? [],
          temperature_2m_min: weatherData?.daily?.temperature_2m_min ?? [],
          precipitation_probability_max: weatherData?.daily?.precipitation_probability_max ?? [],
          wind_speed_10m_max: weatherData?.daily?.wind_speed_10m_max ?? [],
          weather_code: weatherData?.daily?.weather_code ?? [],
        },
      },
      error: '',
    }
  } catch (error) {
    console.error(error)
    return {
      data: null,
      error: 'Error fetching forecast details',
    }
  }
}
