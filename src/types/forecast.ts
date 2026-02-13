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
  uv_index: number
  european_aqi: number
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
  uv_index: string
  european_aqi: string
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

export type Daily = {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_probability_max: number[]
  wind_speed_10m_max: number[]
  weather_code: number[]
}

export type DailyUnits = {
  time: string
  temperature_2m_max: string
  temperature_2m_min: string
  precipitation_probability_max: string
  wind_speed_10m_max: string
  weather_code: string
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
  daily: Daily
  daily_units: DailyUnits
  city: City
}

export type ForecastDetails = {
  current: Pick<Current, 'cloud_cover' | 'uv_index' | 'european_aqi'>
  daily: Daily
}

export type ForecastActionResult = {
  data: Forecast[]
  error: string
}

export type ForecastDetailsActionParams = {
  latitude: number
  longitude: number
}

export type ForecastDetailsActionResult = {
  data: ForecastDetails | null
  error: string
}

export type APIForecastBase = {
  latitude: number
  longitude: number
  timezone: string
  utc_offset_seconds: number
  current: {
    time: string
    interval: number
    temperature_2m: number
    relative_humidity_2m: number
    dew_point_2m: number
    apparent_temperature: number
    wind_speed_10m: number
    wind_direction_10m: number
    is_day: number
    weather_code: number
  }
  current_units: Partial<Forecast['current_units']>
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
  hourly_units: Partial<Forecast['hourly_units']>
}

export type APICurrent = Omit<Current, 'humidex' | 'windChill'>
export type APIForecast = Omit<Forecast, 'city' | 'current'> & { current: APICurrent }
