export type SortMetric = 'apparent' | 'humidex' | 'windchill'

export type MetricThresholds = {
  level1: number
  level2: number
  level3: number
  level4: number
}

// Thresholds for each metric (values >= threshold get that level)
export const METRIC_THRESHOLDS: Record<SortMetric, MetricThresholds> = {
  apparent: {
    level1: 15, // < 15 = level 1 (cold/blue)
    level2: 22, // 15-22 = level 2 (yellow)
    level3: 28, // 22-28 = level 3 (orange)
    level4: 35, // 28-35 = level 4, > 35 = level 5
  },
  humidex: {
    level1: 25, // < 25 = level 1
    level2: 30, // 25-30 = level 2
    level3: 35, // 30-35 = level 3
    level4: 40, // 35-40 = level 4, > 40 = level 5
  },
  windchill: {
    // For wind chill, lower is worse (inverted)
    level1: 5, // > 5 = level 1 (comfortable)
    level2: 0, // 0-5 = level 2
    level3: -5, // -5 to 0 = level 3
    level4: -15, // -15 to -5 = level 4, < -15 = level 5
  },
}

export const METRIC_LABELS: Record<SortMetric, string> = {
  apparent: 'Ressenti',
  humidex: 'Humidex',
  windchill: 'Wind Chill',
}

/**
 * Calculate humidex from temperature and dew point
 * Only meaningful when temperature > 20°C
 */
export function calculateHumidex(temperature: number, dewPoint: number): number {
  if (temperature < 20) {
    return temperature
  }
  const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / (dewPoint + 273.15)))
  return Math.round(temperature + (5 / 9) * (e - 10))
}

/**
 * Calculate wind chill from temperature and wind speed
 * Only meaningful when temperature <= 10°C and wind >= 4.8 km/h
 */
export function calculateWindChill(temperature: number, windSpeed: number): number {
  if (temperature > 10 || windSpeed < 4.8) {
    return temperature
  }
  return Math.round(
    13.12 +
      0.6215 * temperature -
      11.37 * windSpeed ** 0.16 +
      0.3965 * temperature * windSpeed ** 0.16
  )
}

/**
 * Get the color level (1-5) based on value and metric type
 */
export function getMetricLevel(value: number, metric: SortMetric): number {
  const thresholds = METRIC_THRESHOLDS[metric]

  if (metric === 'windchill') {
    // Wind chill: lower is worse (inverted scale)
    if (value > thresholds.level1) return 1
    if (value > thresholds.level2) return 2
    if (value > thresholds.level3) return 3
    if (value > thresholds.level4) return 4
    return 5
  }

  // Apparent temp and humidex: higher is worse
  if (value < thresholds.level1) return 1
  if (value < thresholds.level2) return 2
  if (value < thresholds.level3) return 3
  if (value < thresholds.level4) return 4
  return 5
}

/**
 * Get CSS classes for the metric level
 */
export function getMetricClass(
  value: number,
  metric: SortMetric,
  type: 'card' | 'text' | 'ring' | 'stroke' = 'card'
): string {
  const level = getMetricLevel(value, metric)

  const classes = {
    card: [
      '',
      'border-humidex-1 shadow-[0_0_15px_-5px_hsl(var(--humidex-1))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-1))]',
      'border-humidex-2 shadow-[0_0_15px_-5px_hsl(var(--humidex-2))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-2))]',
      'border-humidex-3 shadow-[0_0_15px_-5px_hsl(var(--humidex-3))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-3))]',
      'border-humidex-4 shadow-[0_0_15px_-5px_hsl(var(--humidex-4))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-4))]',
      'border-humidex-5 shadow-[0_0_15px_-5px_hsl(var(--humidex-5))] hover:shadow-[0_0_20px_-3px_hsl(var(--humidex-5))]',
    ],
    text: [
      '',
      'text-humidex-1',
      'text-humidex-2',
      'text-humidex-3',
      'text-humidex-4',
      'text-humidex-5',
    ],
    ring: [
      '',
      'ring-2 ring-humidex-1 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-2 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-3 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-4 ring-offset-2 ring-offset-background',
      'ring-2 ring-humidex-5 ring-offset-2 ring-offset-background',
    ],
    stroke: [
      '',
      'stroke-humidex-1',
      'stroke-humidex-2',
      'stroke-humidex-3',
      'stroke-humidex-4',
      'stroke-humidex-5',
    ],
  }

  return classes[type][level]
}

/**
 * Get the sort value for a forecast item based on the selected metric
 */
export function getSortValue(
  current: { apparent_temperature: number; humidex: number; windChill: number },
  metric: SortMetric
): number {
  switch (metric) {
    case 'apparent':
      return current.apparent_temperature
    case 'humidex':
      return current.humidex
    case 'windchill':
      // Invert for sorting (lower wind chill = worse = should be first)
      return -current.windChill
  }
}

/**
 * Get the display value for a forecast item based on the selected metric
 */
export function getDisplayValue(
  current: { apparent_temperature: number; humidex: number; windChill: number },
  metric: SortMetric
): number {
  switch (metric) {
    case 'apparent':
      return Math.round(current.apparent_temperature)
    case 'humidex':
      return Math.round(current.humidex)
    case 'windchill':
      return Math.round(current.windChill)
  }
}
