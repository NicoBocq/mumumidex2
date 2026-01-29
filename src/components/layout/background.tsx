'use client'

import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

// Thèmes séparés light/dark pour éviter les problèmes de détection Tailwind
// Dark mode: fond teinté + blobs subtils pour effet aurora
const WEATHER_THEMES = {
  extreme: {
    light: { bg: 'bg-red-50', blobs: ['bg-red-200', 'bg-orange-200', 'bg-rose-200'] },
    dark: { bg: 'bg-red-950', blobs: ['bg-red-500/15', 'bg-orange-500/15', 'bg-rose-500/15'] },
  },
  hot: {
    light: { bg: 'bg-orange-50', blobs: ['bg-orange-200', 'bg-amber-200', 'bg-yellow-200'] },
    dark: {
      bg: 'bg-orange-950',
      blobs: ['bg-orange-500/15', 'bg-amber-500/15', 'bg-yellow-500/15'],
    },
  },
  warm: {
    light: { bg: 'bg-amber-50', blobs: ['bg-amber-200', 'bg-yellow-200', 'bg-lime-200'] },
    dark: { bg: 'bg-amber-950', blobs: ['bg-amber-500/15', 'bg-yellow-500/15', 'bg-lime-500/15'] },
  },
  mild: {
    light: { bg: 'bg-teal-50', blobs: ['bg-teal-200', 'bg-emerald-200', 'bg-cyan-200'] },
    dark: { bg: 'bg-teal-950', blobs: ['bg-teal-500/15', 'bg-emerald-500/15', 'bg-cyan-500/15'] },
  },
  cold: {
    light: { bg: 'bg-sky-50', blobs: ['bg-sky-200', 'bg-blue-200', 'bg-indigo-200'] },
    dark: { bg: 'bg-sky-950', blobs: ['bg-sky-500/15', 'bg-blue-500/15', 'bg-indigo-500/15'] },
  },
  neutral: {
    light: { bg: 'bg-orange-50/50', blobs: ['bg-amber-100', 'bg-orange-100', 'bg-yellow-100'] },
    dark: {
      bg: 'bg-slate-950',
      blobs: ['bg-amber-500/15', 'bg-orange-500/15', 'bg-yellow-500/15'],
    },
  },
} as const

type ThemeKey = keyof typeof WEATHER_THEMES

function getWeatherTheme(temperature: number | undefined): ThemeKey {
  if (temperature === undefined) return 'neutral'
  if (temperature >= 35) return 'extreme'
  if (temperature >= 28) return 'hot'
  if (temperature >= 20) return 'warm'
  if (temperature >= 10) return 'mild'
  return 'cold'
}

export default function Background() {
  const { weather } = useLocalWeatherContext()
  const { resolvedTheme } = useTheme()

  const themeKey = getWeatherTheme(weather?.temperature)
  const weatherTheme = WEATHER_THEMES[themeKey]
  const isDark = resolvedTheme === 'dark'
  const colors = isDark ? weatherTheme.dark : weatherTheme.light

  return (
    <div
      className={cn(
        'fixed inset-0 -z-50 overflow-hidden transition-colors duration-1000',
        colors.bg
      )}
    >
      <div
        className={cn(
          'absolute -left-[10%] -top-[10%] h-[70vh] w-[70vw] animate-aurora-1 rounded-full opacity-50 blur-[120px] transition-colors duration-1000',
          colors.blobs[0]
        )}
      />
      <div
        className={cn(
          'absolute -right-[10%] top-[20%] h-[60vh] w-[60vw] animate-aurora-2 rounded-full opacity-50 blur-[120px] transition-colors duration-1000',
          colors.blobs[1]
        )}
      />
      <div
        className={cn(
          'absolute -bottom-[20%] left-[20%] h-[70vh] w-[70vw] animate-aurora-3 rounded-full opacity-50 blur-[120px] transition-colors duration-1000',
          colors.blobs[2]
        )}
      />
    </div>
  )
}
