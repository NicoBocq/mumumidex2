import { City } from '@prisma/client'

export type SearchCity = Omit<City, 'userId' | 'id' | 'hidden'> & {
  id: number
  admin1: string
  admin2: string
  admin3: string
  admin4: string
}

export type DefaultCity = Omit<City, 'userId'>
