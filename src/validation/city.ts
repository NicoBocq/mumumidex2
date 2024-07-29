import { z } from 'zod'

import { nanoidSchema } from '.'

export const searchCitySchema = z.string().min(3)

export const apiCitySchema = z.object({
  id: z.number(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string(),
  country_code: z.string(),
  admin1: z.string(),
})

export const citySchema = z.object({
  id: nanoidSchema,
  hidden: z.boolean().optional(),
  pinned: z.boolean().optional(),
})

export type CitySchemaType = z.infer<typeof citySchema>
