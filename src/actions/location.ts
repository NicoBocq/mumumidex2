'use server'

import { z } from 'zod'

import { actionClient } from '@/lib/safe-action'

const citySchema = z.string().min(3)

export const getLocation = actionClient
  .schema(citySchema)
  .action(async ({ parsedInput: search }) => {
    try {
      const params = new URLSearchParams({
        name: search,
        limit: '5',
      })
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params}`,
        {
          next: {
            revalidate: 60 * 60 * 24 * 7,
            tags: [`location-${search}`],
          },
        },
      )
      const data = await response.json()
      return data
    } catch (error) {
      return {
        error: error as Error,
      }
    }
  })
