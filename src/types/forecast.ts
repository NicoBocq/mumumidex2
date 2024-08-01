import { City } from '@prisma/client'

export type Current = {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  dew_point_2m: number
  apparent_temperature: number
  humidex: number
  wind_speed_10m: number
  is_day: number
}

export type CurrentUnits = {
  time: string
  interval: string
  temperature_2m: string
  relative_humidity_2m: string
  dew_point_2m: string
  apparent_temperature: string
  wind_speed_10m: string
  is_day: string
}

export type Forecast = {
  latitude: number
  longitude: number
  timezone: string
  utc_offset_seconds: number
  current: Current
  city: City
  current_units: CurrentUnits
}

export type APICurrent = Omit<Current, 'humidex'>
export type APIForecast = Omit<Forecast, 'location'> & { current: APICurrent }
