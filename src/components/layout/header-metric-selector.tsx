'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/custom-ui/icon'
import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { cn } from '@/lib/utils'
import { METRIC_LABELS, type SortMetric } from '@/lib/weather-metrics'

const METRICS: { key: SortMetric; icon: 'Thermometer' | 'Droplets' | 'Wind'; suffix?: string }[] = [
  { key: 'apparent', icon: 'Thermometer', suffix: '°' },
  { key: 'humidex', icon: 'Droplets' },
  { key: 'windchill', icon: 'Wind' },
]

export function HeaderMetricSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { weather } = useLocalWeatherContext()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get active metric from URL or default to 'apparent'
  const sortMetric = (searchParams.get('sort') as SortMetric) || 'apparent'

  const setSortMetric = (metric: SortMetric) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', metric)
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  const getValue = (key: SortMetric) => {
    if (!weather) return null
    switch (key) {
      case 'apparent':
        return Math.round(weather.apparentTemperature)
      case 'humidex':
        return Math.round(weather.humidex)
      case 'windchill':
        return Math.round(weather.windChill)
    }
  }

  const activeValue = getValue(sortMetric)

  // Sync mounted state to avoid hydration mismatch for location name
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  /* Removed blocking states per user request */

  return (
    <div className="relative z-20" ref={containerRef}>
      <motion.div
        layout
        className={cn(
          'flex items-center whitespace-nowrap overflow-hidden',
          'bg-background/80 backdrop-blur-md border border-border/50 shadow-sm',
          'rounded-full cursor-pointer select-none',
          'hover:bg-accent/50 transition-colors duration-200',
          !isOpen &&
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        initial={false}
        animate={{
          gap: isOpen ? '4px' : '0px',
          padding: isOpen ? '4px' : '0px',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={() => !isOpen && setIsOpen(true)}
        onKeyDown={(e) => {
          if (!isOpen && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            setIsOpen(true)
          }
        }}
        tabIndex={!isOpen ? 0 : -1}
        role={isOpen ? undefined : 'button'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isOpen ? (
            // Expanded State: Show all options
            METRICS.map(({ key, icon, suffix }) => {
              const isActive = sortMetric === key
              const value = getValue(key)

              return (
                <motion.button
                  layout
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSortMetric(key)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'relative h-10 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 rounded-full text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'text-foreground'
                      : 'hover:bg-accent/50 hover:text-foreground text-muted-foreground'
                  )}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ layout: { type: 'spring', bounce: 0.2, duration: 0.3 } }}
                >
                  <Icon name={icon} size="sm" />
                  {value !== null && (
                    <span className="text-xs font-semibold">
                      {value}
                      {suffix}
                    </span>
                  )}

                  {isActive && (
                    <motion.span
                      layoutId="active-pill-bg"
                      className="absolute inset-0 bg-foreground/10 rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })
          ) : (
            // Collapsed State: Smart Badge (Icon + Value + Location)
            <motion.div
              layout
              key="collapsed-badge"
              className={cn(
                'flex h-10 items-center gap-1 sm:gap-2 px-2 sm:px-3 rounded-full',
                'bg-foreground/5 text-foreground' // Minimalist style
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {mounted && weather?.locationName && (
                <span className="text-sm font-semibold border-r border-white/20 pr-2 mr-2 max-w-[60px] sm:max-w-[150px] truncate">
                  {weather.locationName}
                </span>
              )}
              {activeValue !== null && mounted && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold min-w-[1.5em] text-center">
                    {activeValue} {METRICS.find((m) => m.key === sortMetric)?.suffix}
                  </span>
                </div>
              )}
              <span className="text-[9px] text-muted-foreground uppercase tracking-tighter">
                {METRIC_LABELS[sortMetric]}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
