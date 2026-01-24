'use client'

import { useLocalWeatherContext } from '@/contexts/local-weather-context'

// Color themes aligned with metric levels (blue → teal → amber → orange → red)
const WEATHER_THEMES = {
  // Level 5: Extreme heat (>35°C or humidex >40)
  extreme: {
    light: {
      bg: 'bg-red-50',
      blobs: ['bg-red-200', 'bg-orange-200', 'bg-rose-200'],
    },
    dark: {
      bg: 'bg-red-950/20',
      blobs: ['bg-red-900/60', 'bg-orange-900/60', 'bg-rose-900/60'],
    },
  },
  // Level 4: Hot (28-35°C)
  hot: {
    light: {
      bg: 'bg-orange-50',
      blobs: ['bg-orange-200', 'bg-amber-200', 'bg-yellow-200'],
    },
    dark: {
      bg: 'bg-orange-950/20',
      blobs: ['bg-orange-900/60', 'bg-amber-900/60', 'bg-yellow-900/60'],
    },
  },
  // Level 3: Warm (20-28°C)
  warm: {
    light: {
      bg: 'bg-amber-50',
      blobs: ['bg-amber-200', 'bg-yellow-200', 'bg-lime-200'],
    },
    dark: {
      bg: 'bg-amber-950/20',
      blobs: ['bg-amber-900/60', 'bg-yellow-900/60', 'bg-lime-900/60'],
    },
  },
  // Level 2: Mild (10-20°C)
  mild: {
    light: {
      bg: 'bg-teal-50',
      blobs: ['bg-teal-200', 'bg-emerald-200', 'bg-cyan-200'],
    },
    dark: {
      bg: 'bg-teal-950/20',
      blobs: ['bg-teal-900/60', 'bg-emerald-900/60', 'bg-cyan-900/60'],
    },
  },
  // Level 1: Cold (<10°C)
  cold: {
    light: {
      bg: 'bg-sky-50',
      blobs: ['bg-sky-200', 'bg-blue-200', 'bg-indigo-200'],
    },
    dark: {
      bg: 'bg-sky-950/20',
      blobs: ['bg-sky-900/60', 'bg-blue-900/60', 'bg-indigo-900/60'],
    },
  },
  // Default: No location data - warm neutral tones
  neutral: {
    light: {
      bg: 'bg-orange-50/50',
      blobs: ['bg-amber-100', 'bg-orange-100', 'bg-yellow-100'],
    },
    dark: {
      bg: 'bg-slate-950',
      blobs: ['bg-amber-900/40', 'bg-orange-900/40', 'bg-yellow-900/40'],
    },
  },
}

function getWeatherTheme(temperature: number | undefined) {
  if (temperature === undefined) return 'neutral'
  if (temperature >= 35) return 'extreme'
  if (temperature >= 28) return 'hot'
  if (temperature >= 20) return 'warm'
  if (temperature >= 10) return 'mild'
  return 'cold'
}

export default function Background() {
  const { weather } = useLocalWeatherContext()

  const themeKey = getWeatherTheme(weather?.temperature)
  const theme = WEATHER_THEMES[themeKey]

  return (
    <div
      className={`fixed inset-0 -z-50 overflow-hidden transition-colors duration-1000 ${theme.light.bg} dark:bg-slate-950 ${theme.dark.bg.replace('bg-', 'dark:bg-')}`}
    >
      <div
        className={`absolute -left-[10%] -top-[10%] h-[70vh] w-[70vw] animate-aurora-1 rounded-full opacity-50 blur-[120px] filter transition-colors duration-1000 ${theme.light.blobs[0]} ${theme.dark.blobs[0].replace('bg-', 'dark:bg-')}`}
      />
      <div
        className={`absolute -right-[10%] top-[20%] h-[60vh] w-[60vw] animate-aurora-2 rounded-full opacity-50 blur-[120px] filter transition-colors duration-1000 ${theme.light.blobs[1]} ${theme.dark.blobs[1].replace('bg-', 'dark:bg-')}`}
      />
      <div
        className={`absolute -bottom-[20%] left-[20%] h-[70vh] w-[70vw] animate-aurora-3 rounded-full opacity-50 blur-[120px] filter transition-colors duration-1000 ${theme.light.blobs[2]} ${theme.dark.blobs[2].replace('bg-', 'dark:bg-')}`}
      />
    </div>
  )
}
