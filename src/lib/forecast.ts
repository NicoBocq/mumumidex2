import { WeatherApiResponse } from "@/types/forecast"

type getHumidexProps = {
  temp?: number
  humidity?: number
}

export const getHumidex = ({ temp, humidity }: getHumidexProps): number | null => {
  if (!temp || !humidity) {
    return null
  }

  const e =
    6.112 * Math.pow(10, (7.5 * temp) / (237.7 + temp)) * (humidity / 100)
  return Math.round(temp + (5 / 9) * (e - 10))
}

export const getHumidexBgClassColor = (item: WeatherApiResponse) => {
  if (!item) {
    return ''
  }

  switch (true) {
    case item.current.humidex <= 29:
      return 'bg-green-700'
    case item.current.humidex <= 39:
      return 'bg-yellow-700'
    case item.current.humidex <= 45:
      return 'bg-red-700'
    default:
      return 'bg-red-900'
  }
}
