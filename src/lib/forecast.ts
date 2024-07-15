type getHumidexProps = {
  temp?: number
  humidity?: number
}

export const getHumidex = ({
  temp,
  humidity,
}: getHumidexProps): number | null => {
  if (!temp || !humidity) {
    return null
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

  switch (true) {
    case value <= 29:
      return type === 'card'
        ? 'bg-gradient-to-b from-humidex-1 to-humidex-1/90 text-humidex-1-foreground'
        : type === 'foreground/50'
          ? 'text-humidex-1-foreground/50'
          : type === 'foreground/10'
            ? 'text-humidex-1-foreground/10'
            : 'text-humidex-1'
    case value <= 39:
      return type === 'card'
        ? 'bg-gradient-to-b from-humidex-2 to-humidex-2/90 text-humidex-2-foreground'
        : type === 'foreground/50'
          ? 'text-humidex-2-foreground/50'
          : type === 'foreground/10'
            ? 'text-humidex-2-foreground/10'
            : 'text-humidex-2-foreground'
    case value <= 45:
      return type === 'card'
        ? 'bg-gradient-to-b from-humidex-3 to-humidex-3/90 text-humidex-3-foreground'
        : type === 'foreground/50'
          ? 'text-humidex-3-foreground/50'
          : type === 'foreground/10'
            ? 'text-humidex-3-foreground/10'
            : 'text-humidex-3-foreground'
    default:
      return type === 'card'
        ? 'bg-gradient-to-b from-humidex-4 to-humidex-4/90 text-humidex-4-foreground'
        : type === 'foreground/50'
          ? 'text-humidex-4-foreground/50'
          : type === 'foreground/10'
            ? 'text-humidex-4-foreground/10'
            : 'text-humidex-4-foreground'
  }
}
