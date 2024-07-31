type getHumidexProps = {
  temperature?: number
  humidity?: number
}

export const getHumidex = ({ temperature, humidity }: getHumidexProps): number => {
  if (!temperature || !humidity) {
    return 0
  }

  const e =
    6.112 * Math.pow(10, (7.5 * temperature) / (237.7 + temperature)) * (humidity / 100)
  return Math.round(temperature + (5 / 9) * (e - 10))
}
// const DEW_POINT_VALUATIONS = {
//   ARDENBUCK_DEFAULT: { a: 6.1121, b: 18.678, c: 257.14, d: 234.5 },
//   DAVID_BOLTON: { a: 6.112, b: 17.67, c: 234.5, d: 234.5 }, //maximum error of 0.1%, for −30 °C ≤ T ≤ 35°C and 1% < RH < 100%
//   SONNTAG1990: { a: 6.112, b: 17.62, c: 243.12, d: 234.5 }, //for −45 °C ≤ T ≤ 60 °C (error ±0.35 °C).
//   PAROSCIENTIFIC: { a: 6.105, b: 17.27, c: 237.7, d: 234.5 }, //for 0 °C ≤ T ≤ 60 °C (error ±0.4 °C).
//   ARDENBUCK_PLUS: { a: 6.1121, b: 17.368, c: 238.88, d: 234.5 }, //for 0 °C ≤ T ≤ 50 °C (error ≤ 0.05%).
//   ARDENBUCK_MINUS: { a: 6.1121, b: 17.966, c: 247.15, d: 234.5 }, //for −40 °C ≤ T ≤ 0 °C (error ≤ 0.06%).
// }

// function dewPointValuationsByTemperature(temperature: number) {
//   if (temperature < 0) {
//     return DEW_POINT_VALUATIONS.ARDENBUCK_MINUS
//   } else if (temperature >= 0 && temperature <= 50) {
//     return DEW_POINT_VALUATIONS.ARDENBUCK_PLUS
//   } else if (temperature > 50) {
//     return DEW_POINT_VALUATIONS.PAROSCIENTIFIC
//   } else {
//     return DEW_POINT_VALUATIONS.ARDENBUCK_DEFAULT
//   }
// }

// function dewPointMagnusFormula(temperature: number, humidity: number) {
//   const constants = dewPointValuationsByTemperature(temperature)

//   if (!constants) {
//     return 0
//   }

//   const gammaT_RH =
//     Math.log(humidity / 100) +
//     (constants.b * temperature) / (constants.c + temperature)
//   return (constants.c * gammaT_RH) / (constants.b - gammaT_RH)
// }

// export function getHumidex({ temperature, humidity }: getHumidexProps) {
//   if (!temperature || !humidity) {
//     return 0
//   }

//   const tdew = dewPointMagnusFormula(temperature, humidity)

//   if (!tdew) {
//     return 0
//   }

//   const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / tdew))
//   const h = 0.5555 * (e - 10.0)
//   const humidex = temperature + h

//   return Math.round(humidex)
// }

export const getHumidexClass = (
  value: number,
  type: 'card' | 'text' | 'foreground/50' | 'foreground/10' | 'ring' = 'card',
) => {
  if (!value) {
    return ''
  }

  const classes = {
    card: [
      'bg-gradient-to-b from-humidex-1 to-humidex-1/90 text-humidex-1-foreground',
      'bg-gradient-to-b from-humidex-2 to-humidex-2/90 text-humidex-2-foreground',
      'bg-gradient-to-b from-humidex-3 to-humidex-3/90 text-humidex-3-foreground',
      'bg-gradient-to-b from-humidex-4 to-humidex-4/90 text-humidex-4-foreground',
      'bg-gradient-to-b from-humidex-5 to-humidex-5/90 text-humidex-5-foreground',
    ],
    'foreground/50': [
      'text-humidex-1-foreground/50',
      'text-humidex-2-foreground/50',
      'text-humidex-3-foreground/50',
      'text-humidex-4-foreground/50',
      'text-humidex-5-foreground/50',
    ],
    'foreground/10': [
      'text-humidex-1-foreground/10',
      'text-humidex-2-foreground/10',
      'text-humidex-3-foreground/10',
      'text-humidex-4-foreground/10',
      'text-humidex-5-foreground/10',
    ],
    text: [
      'text-humidex-1-foreground',
      'text-humidex-2-foreground',
      'text-humidex-3-foreground',
      'text-humidex-4-foreground',
      'text-humidex-5-foreground',
    ],
    ring: [
      'ring-2 ring-humidex-1-darker ring-offset-2 ring-offset-humidex-1-darker',
      'ring-2 ring-humidex-2-darker ring-offset-2 ring-offset-humidex-2-darker',
      'ring-2 ring-humidex-3-darker ring-offset-2 ring-offset-humidex-3-darker',
      'ring-2 ring-humidex-4-darker ring-offset-2 ring-offset-humidex-4-darker',
      'ring-2 ring-humidex-5-darker ring-offset-2 ring-offset-humidex-5-darker',
    ],
  }

  const thresholds = [20, 30, 40, 46]

  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) {
      return classes[type][i]
    }
  }

  return classes[type][4]
}
