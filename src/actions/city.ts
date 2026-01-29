'use server'

import { nanoidSchema } from '@/validation'
import { apiCitySchema, citySchema, searchCitySchema } from '@/validation/city'
import { Prisma } from '@prisma/client'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'

import prisma from '@/config/db'
import { actionClient, authActionClient } from '@/lib/safe-action'

export const searchCity = actionClient
  .metadata({ actionName: 'searchCity' })
  .inputSchema(searchCitySchema)
  .action(async ({ parsedInput: search }) => {
    try {
      const params = new URLSearchParams({
        name: search,
        limit: '10',
      })
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
        next: {
          revalidate: 60 * 60 * 24 * 7,
          tags: [`search-city-${search}`],
        },
      })
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
}

export async function getUserCities({ userId }: getUserCitiesType) {
  'use cache'
  cacheTag(`user-cities-${userId}`)
  cacheLife('days')

  try {
    const cities = await prisma.city.findMany({
      where: {
        userId,
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
}

export const addCity = authActionClient
  .metadata({ actionName: 'addCity' })
  .inputSchema(apiCitySchema)
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
      revalidateTag(`user-cities-${userId}`, 'max')
      return {
        success: 'City added',
      }
    } catch (error) {
      console.error(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
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
  .inputSchema(citySchema.partial())
  .action(async ({ parsedInput, ctx: { id: userId } }) => {
    const { id, ...rest } = parsedInput
    try {
      await prisma.city.update({
        where: {
          id,
        },
        data: rest,
      })
      revalidateTag(`user-cities-${userId}`, 'max')
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
  .inputSchema(nanoidSchema)
  .action(async ({ parsedInput: id, ctx: { id: userId } }) => {
    try {
      await prisma.city.delete({
        where: {
          id,
        },
      })
      revalidateTag(`user-cities-${userId}`, 'max')
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
