'use server'

import { revalidateTag, unstable_cache } from 'next/cache'
import { nanoidSchema } from '@/validation'
import { apiCitySchema, citySchema, searchCitySchema } from '@/validation/city'
import { Prisma } from '@prisma/client'

import prisma from '@/config/db'
import { actionClient, authActionClient } from '@/lib/safe-action'

export const searchCity = actionClient
  .metadata({ actionName: 'searchCity' })
  .schema(searchCitySchema)
  .action(async ({ parsedInput: search }) => {
    try {
      const params = new URLSearchParams({
        name: search,
        limit: '10',
      })
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?${params}`,
        {
          next: {
            revalidate: 60 * 60 * 24 * 7,
            tags: [`search-city-${search}`],
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

type getUserCitiesType = {
  userId: string
  hideHidden?: boolean
}

export async function getUserCities({
  userId,
  hideHidden = false,
}: getUserCitiesType) {
  const cachedUserCities = unstable_cache(
    async () => {
      try {
        const cities = await prisma.city.findMany({
          where: {
            userId,
            ...(hideHidden ? { hidden: false } : {}),
          },
          orderBy: {
            name: 'asc',
          },
        })
        return {
          data: cities,
        }
      } catch (error) {
        console.error(error)
        return {
          error: 'Error fetching cities',
        }
      }
    },
    [`user-cities-${userId}-${hideHidden}`],
    {
      tags: [`user-cities-${userId}`],
      revalidate: 60 * 60 * 24 * 7,
    },
  )()
  return cachedUserCities
}

export const addCity = authActionClient
  .metadata({ actionName: 'addCity' })
  .schema(apiCitySchema)
  .action(async ({ parsedInput, ctx: { id: userId } }) => {
    const { id: externalId, ...rest } = parsedInput
    try {
      await prisma.city.create({
        data: {
          ...rest,
          externalId,
          userId,
        },
      })
      revalidateTag(`user-cities-${userId}`)
      return {
        success: 'City added',
      }
    } catch (error) {
      console.error(error)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {
          error: 'City already exists',
        }
      }
      return {
        error: 'Error adding city',
      }
    }
  })

export const updateCity = authActionClient
  .metadata({ actionName: 'updateCity' })
  .schema(citySchema.partial())
  .action(async ({ parsedInput, ctx: { id: userId } }) => {
    const { id, ...rest } = parsedInput
    try {
      await prisma.city.update({
        where: {
          id,
        },
        data: rest,
      })
      revalidateTag(`user-cities-${userId}`)
      return {
        success: 'City updated',
      }
    } catch (error) {
      console.error(error)
      return {
        error: 'Error updating city',
      }
    }
  })

export const deleteCity = authActionClient
  .metadata({ actionName: 'deleteCity' })
  .schema(nanoidSchema)
  .action(async ({ parsedInput: id, ctx: { id: userId } }) => {
    try {
      await prisma.city.delete({
        where: {
          id,
        },
      })
      revalidateTag(`user-cities-${userId}`)
      return {
        success: 'City removed',
      }
    } catch (error) {
      console.error(error)
      return {
        error: 'Error removing city',
      }
    }
  })
