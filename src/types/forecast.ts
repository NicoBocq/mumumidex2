import type { City } from '@prisma/client'

export type Current = {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  dew_point_2m: number
  apparent_temperature: number
  wind_speed_10m: number
  wind_direction_10m: number
  is_day: number
  precipitation: number
  cloud_cover: number
  weather_code: number
  humidex: number
  windChill: number
}

export type CurrentUnits = {
  time: string
  interval: string
  temperature_2m: string
  relative_humidity_2m: string
  dew_point_2m: string
  apparent_temperature: string
  wind_speed_10m: string
  wind_direction_10m: string
  is_day: string
  precipitation: string
  cloud_cover: string
  weather_code: string
}

export type Hourly = {
  time: string[]
  temperature_2m: number[]
  precipitation: number[]
}

export type HourlyUnits = {
  time: string
  temperature_2m: string
  precipitation: string
}

export type Forecast = {
  latitude: number
  longitude: number
  timezone: string
  utc_offset_seconds: number
  current: Current
  current_units: CurrentUnits
  hourly: Hourly
  hourly_units: HourlyUnits
  city: City
}

export type APICurrent = Omit<Current, 'humidex' | 'windChill'>
export type APIForecast = Omit<Forecast, 'city' | 'current'> & { current: APICurrent }
