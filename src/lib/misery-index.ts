import { getHumidex } from './humidex'

type WeatherData = {
  temperature: number
  dewPoint: number
  humidity: number
  windSpeed: number
  precipitation: number
}

/**
 * Calcule le Wind Chill (refroidissement éolien)
 * Formule standard utilisée au Canada et aux USA
 */
export const getWindChill = (temperature: number, windSpeed: number): number => {
  // Le wind chill n'est calculé que si T <= 10°C et vent >= 4.8 km/h
  if (temperature > 10 || windSpeed < 4.8) {
    return temperature
  }

  return (
    13.12 +
    0.6215 * temperature -
    11.37 * windSpeed ** 0.16 +
    0.3965 * temperature * windSpeed ** 0.16
  )
}

/**
 * Calcule l'Indice de Galère Météo (IGM)
 * Score unique mesurant à quel point la météo est pourrie
 */
export const getMiseryIndex = (weather: WeatherData): number => {
  let score = 0

  // Calcul de l'humidex pour la chaleur
  const humidex = getHumidex({
    temperature: weather.temperature,
    dewPoint: weather.dewPoint,
  })

  // Chaleur : +2 pts par degré d'humidex au-dessus de 30
  if (humidex > 30) {
    score += (humidex - 30) * 2
  }

  // Froid : +1.5 pts par degré de wind chill en dessous de 10
  const windChill = getWindChill(weather.temperature, weather.windSpeed)
  if (windChill < 10) {
    score += (10 - windChill) * 1.5
  }

  // Pluie : +10 pts par mm/h
  score += weather.precipitation * 10

  // Vent fort : +0.5 pts par km/h au-dessus de 20
  if (weather.windSpeed > 20) {
    score += (weather.windSpeed - 20) * 0.5
  }

  // Humidité étouffante (>80% et T>20°C) : +0.3 pts par % au-dessus
  if (weather.humidity > 80 && weather.temperature > 20) {
    score += (weather.humidity - 80) * 0.3
  }

  return Math.round(score)
}

/**
 * Retourne le niveau de galère (0-4)
 */
export const getMiseryLevel = (score: number): number => {
  if (score < 10) return 0 // Tranquille
  if (score < 25) return 1 // Bof
  if (score < 40) return 2 // Galère
  if (score < 60) return 3 // Enfer
  return 4 // Apocalypse
}

/**
 * Retourne l'emoji correspondant au niveau de galère
 */
export const getMiseryEmoji = (score: number): string => {
  const emojis = ['😎', '😐', '😤', '🥵', '☠️']
  return emojis[getMiseryLevel(score)]
}

/**
 * Retourne les classes CSS pour le niveau de galère
 * Compatible avec l'ancien système humidex (réutilise les couleurs)
 */
export const getMiseryClass = (
  score: number,
  type: 'card' | 'text' | 'foreground/50' | 'foreground/10' | 'ring' | 'stroke' = 'card'
): string => {
  if (score === 0) {
    return ''
  }

  const classes = {
    card: [
      'border-humidex-1 shadow-[0_0_15px_-5px_hsl(var(--humidex-1))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-1))]',
      'border-humidex-2 shadow-[0_0_15px_-5px_hsl(var(--humidex-2))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-2))]',
      'border-humidex-3 shadow-[0_0_15px_-5px_hsl(var(--humidex-3))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-3))]',
      'border-humidex-4 shadow-[0_0_15px_-5px_hsl(var(--humidex-4))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-4))]',
      'border-humidex-5 shadow-[0_0_15px_-5px_hsl(var(--humidex-5))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-5))]',
    ],
    'foreground/50': [
      'text-foreground/50',
      'text-foreground/50',
      'text-foreground/50',
      'text-foreground/50',
      'text-foreground/50',
    ],
    'foreground/10': [
      'text-foreground/10',
      'text-foreground/10',
      'text-foreground/10',
      'text-foreground/10',
      'text-foreground/10',
    ],
    text: [
      'text-humidex-1',
      'text-humidex-2',
      'text-humidex-3',
      'text-humidex-4',
      'text-humidex-5',
    ],
    ring: [
      'ring-2 ring-humidex-1 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-2 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-3 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-4 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-5 ring-offset-2 ring-offset-background',
    ],
    stroke: [
      'stroke-humidex-1',
      'stroke-humidex-2',
      'stroke-humidex-3',
      'stroke-humidex-4',
      'stroke-humidex-5',
    ],
  }

  return classes[type][getMiseryLevel(score)]
}
