'use client'

import { useLocalWeatherContext } from '@/contexts/local-weather-context'

// Define color palettes based on weather conditions
const WEATHER_THEMES = {
  // Hot weather (humidex > 30)
  hot: {
    bg: 'bg-orange-50 dark:bg-slate-950',
    blobs: [
      'bg-orange-300 dark:bg-orange-900',
      'bg-amber-300 dark:bg-amber-900',
      'bg-red-300 dark:bg-red-900',
    ],
  },
  // Warm weather (20-30°C)
  warm: {
    bg: 'bg-amber-50 dark:bg-slate-950',
    blobs: [
      'bg-amber-200 dark:bg-yellow-900',
      'bg-yellow-200 dark:bg-amber-900',
      'bg-orange-200 dark:bg-orange-900',
    ],
  },
  // Mild weather (10-20°C)
  mild: {
    bg: 'bg-emerald-50 dark:bg-slate-950',
    blobs: [
      'bg-emerald-200 dark:bg-emerald-900',
      'bg-teal-200 dark:bg-teal-900',
      'bg-green-200 dark:bg-green-900',
    ],
  },
  // Cool weather (0-10°C)
  cool: {
    bg: 'bg-cyan-50 dark:bg-slate-950',
    blobs: [
      'bg-cyan-300 dark:bg-cyan-900',
      'bg-sky-300 dark:bg-sky-900',
      'bg-blue-300 dark:bg-blue-900',
    ],
  },
  // Cold weather (<0°C)
  cold: {
    bg: 'bg-blue-50 dark:bg-slate-950',
    blobs: [
      'bg-blue-300 dark:bg-blue-900',
      'bg-indigo-300 dark:bg-indigo-900',
      'bg-violet-300 dark:bg-violet-900',
    ],
  },
  // Default/neutral (no location data)
  neutral: {
    bg: 'bg-slate-50 dark:bg-slate-950',
    blobs: [
      'bg-slate-200 dark:bg-slate-800',
      'bg-slate-300 dark:bg-slate-700',
      'bg-slate-200 dark:bg-slate-800',
    ],
  },
}

function getWeatherTheme(temperature: number | undefined, humidex: number | undefined) {
  if (temperature === undefined) return WEATHER_THEMES.neutral

  // Use humidex if available and temperature is warm enough
  const effectiveTemp = humidex !== undefined && temperature > 20 ? humidex : temperature

  if (effectiveTemp > 30) return WEATHER_THEMES.hot
  if (effectiveTemp > 20) return WEATHER_THEMES.warm
  if (effectiveTemp > 10) return WEATHER_THEMES.mild
  if (effectiveTemp > 0) return WEATHER_THEMES.cool
  return WEATHER_THEMES.cold
}

export default function Background() {
  const { weather } = useLocalWeatherContext()

  const theme = getWeatherTheme(weather?.temperature, weather?.humidex)

  return (
    <div
      className={`fixed inset-0 -z-50 overflow-hidden transition-colors duration-1000 ${theme.bg}`}
    >
      <div
        className={`absolute -left-[10%] -top-[10%] h-[70vh] w-[70vw] animate-aurora-1 rounded-full opacity-60 blur-[120px] filter transition-colors duration-1000 ${theme.blobs[0]}`}
      />
      <div
        className={`absolute -right-[10%] top-[20%] h-[60vh] w-[60vw] animate-aurora-2 rounded-full opacity-60 blur-[120px] filter transition-colors duration-1000 ${theme.blobs[1]}`}
      />
      <div
        className={`absolute -bottom-[20%] left-[20%] h-[70vh] w-[70vw] animate-aurora-3 rounded-full opacity-60 blur-[120px] filter transition-colors duration-1000 ${theme.blobs[2]}`}
      />
    </div>
  )
}
