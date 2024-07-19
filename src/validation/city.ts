import { z } from 'zod'

import { nanoidSchema } from '.'

export const searchCitySchema = z.string().min(3)

export const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string(),
  country_code: z.string(),
  admin1: z.string(),
})

export const cityVisibilitySchema = z.object({
  id: nanoidSchema,
  hidden: z.boolean(),
})
