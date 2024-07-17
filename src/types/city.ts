import { City } from '@prisma/client'

export type SearchCity = Omit<City, 'userId' | 'id' | 'hidden'> & {
  id: number
}

export type DefaultCity = Omit<City, 'userId'>
