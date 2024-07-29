type getHumidexProps = {
  temp?: number
  humidity?: number
}

export const getHumidex = ({ temp, humidity }: getHumidexProps): number => {
  if (!temp || !humidity) {
    return 0
  }

  const e =
    6.112 * Math.pow(10, (7.5 * temp) / (237.7 + temp)) * (humidity / 100)
  return Math.round(temp + (5 / 9) * (e - 10))
}

export const getHumidexClass = (
  value: number,
  type: 'card' | 'text' | 'foreground/50' | 'foreground/10' = 'card',
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
      'text-humidex-1',
      'text-humidex-2-foreground',
      'text-humidex-3-foreground',
      'text-humidex-4-foreground',
      'text-humidex-5-foreground',
    ],
  }

  const thresholds = [30, 39, 45, 54]

  for (let i = 0; i < thresholds.length; i++) {
    if (value < thresholds[i]) {
      return classes[type][i]
    }
  }

  return classes[type][3]
}
