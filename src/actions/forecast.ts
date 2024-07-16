'use server'

import { Forecast } from '@/types/forecast'

import { DEFAULT_CITIES } from '@/config'

import { getHumidex } from '@/lib/humidex'

type getForecastReturnType = {
  data: Forecast[]
  error: string
}

export const getForecast = async (): Promise<getForecastReturnType> => {
  const cities = DEFAULT_CITIES

  try {
    const params = new URLSearchParams({
      latitude: cities.map((c) => c.latitude.toString()).join(','),
      longitude: cities.map((c) => c.longitude.toString()).join(','),
      timezone: 'auto',
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m',
    })
    const response = await fetch(`${process.env.API_URL}/forecast?${params}`, {
      next: {
        tags: ['forecast'],
        revalidate: 3600,
      },
    })
    const data = await response.json()
    const result = data
      .map((item: Forecast, index: number) => ({
        ...item,
        location: {
          ...cities[index],
        },
        current: {
          ...item.current,
          humidex: getHumidex({
            temp: item.current.temperature_2m,
            humidity: item.current.relative_humidity_2m,
          }),
        },
      }))
      .sort((b: Forecast, a: Forecast) => a.current.humidex - b.current.humidex)
    return {
      data: result,
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
