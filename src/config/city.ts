import { City } from '@prisma/client'

import { nanoid } from 'nanoid'

export const DEFAULT_LOCATIONS: City[] = [
  {
    id: nanoid(),
    externalId: 5391959,
    name: 'San Francisco',
    latitude: 37.77493,
    longitude: -122.41942,
    country_code: 'US',
    country: 'United States',
    hidden: false,
    admin1: 'California',
    pinned: false,
    userId: ''
  },
  {
    id: nanoid(),
    latitude: 48.856667,
    longitude: 2.352222,
    name: 'Paris',
    externalId: 2992166,
    country: 'France',
    country_code: 'FR',
    hidden: false,
    admin1: 'Île-de-France',
    pinned: false,
    userId: ''
  },
  {
    id: nanoid(),
    latitude: 43.29695,
    longitude: 5.38107,
    name: 'Marseille',
    externalId: 6447142,
    country: 'France',
    country_code: 'FR',
    hidden: false,
    admin1: "Provence-Alpes-Côte d'Azur",
    pinned: false,
    userId: ''
  },
  {
    id: nanoid(),
    latitude: 25.77427,
    longitude: -80.19366,
    name: 'Miami',
    externalId: 4190434,
    country: 'United States',
    country_code: 'US',
    hidden: false,
    admin1: 'Florida',
    pinned: false,
    userId: ''
  },
  {
    id: nanoid(),
    externalId: 2971053,
    name: 'Valence',
    latitude: 44.9256,
    longitude: 4.90956,
    country_code: 'FR',
    country: 'France',
    admin1: 'Auvergne-Rhône-Alpes',
    hidden: false,
    pinned: false,
    userId: ''
  },
  {
    id: nanoid(),
    externalId: 2992166,
    name: 'Montpellier',
    latitude: 43.61093,
    longitude: 3.87635,
    country_code: 'FR',
    country: 'France',
    admin1: 'Occitanie',
    hidden: false,
    pinned: false,
    userId: ''
  },
  {
    id: nanoid(),
    externalId: 2979849,
    name: "Saint-Germain-au-Mont-d'Or",
    latitude: 45.88174,
    longitude: 4.80205,
    country_code: 'FR',
    country: 'France',
    admin1: 'Auvergne-Rhône-Alpes',
    hidden: false,
    pinned: false,
    userId: ''
  },
]
