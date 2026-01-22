type getHumidexProps = {
  temperature?: number
  dewPoint?: number
}

export const getHumidex = ({ temperature, dewPoint }: getHumidexProps): number => {
  if (temperature === undefined || dewPoint === undefined) {
    return 0
  }

  // L'humidex n'est pertinent qu'au-dessus de 20°C
  if (temperature < 20) {
    return temperature
  }

  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (dewPoint + 273.15)))
  return Math.round(temperature + (5 / 9) * (e - 10))
}
