'use server'

import { z } from 'zod'

import { actionClient } from '@/lib/safe-action'
import { WeatherApiResponse } from '@/types/forecast'
import { flattenValidationErrors } from 'next-safe-action'
import { getHumidex } from '@/lib/forecast'

const citiesListSchema = z.array(z.object({
  latitude: z.number(),
  longitude: z.number(),
  name: z.string()
}))

export const getForecast = actionClient
  .schema(citiesListSchema, {
    handleValidationErrorsShape: (ve) => flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput: cities }) => {
    try {
      const params = new URLSearchParams({
        latitude: cities.map(c => c.latitude.toString()).join(','),
        longitude: cities.map(c => c.longitude.toString()).join(','),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature',
      })
      const response = await fetch(`${process.env.API_URL}/?${params}`, {
        next: {
          tags: ['forecast'],
          revalidate: 60 * 60 * 24,
        },
      })
      const data = await response.json()
      const formatedData = data.map((item: WeatherApiResponse, index: number) => ({
        ...item,
        location: {
          ...cities[index]
        },
        current: {
          ...item.current,
          humidex: getHumidex({ temp: item.current.temperature_2m, humidity: item.current.relative_humidity_2m }),
        }
      })).sort((b: WeatherApiResponse, a: WeatherApiResponse) => a.current.humidex - b.current.humidex)
      return {
        data: formatedData,
        error: null,
      }
    } catch (error) {
      console.error(error)
      return {
        data: null,
        error: 'Error fetching forecast',
      }
    }
  })