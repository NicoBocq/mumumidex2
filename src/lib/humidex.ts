type getHumidexProps = {
  temperature?: number
  humidity?: number
  dewPoint?: number
}

export const getHumidex = ({
  temperature,
  humidity,
  dewPoint,
}: getHumidexProps): number => {
  if (!temperature || !humidity || !dewPoint) {
    return 0
  }
  let humidex: number

  humidex = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (dewPoint + 273.15)))

  return Math.round(temperature + (5 / 9) * (humidex - 10))
}

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
