'use client'

import Icon from '@/components/custom-ui/icon'
import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import { getSuggestedMetric } from '@/hooks/use-local-weather'
import { cn } from '@/lib/utils'
import type { SortMetric } from '@/lib/weather-metrics'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const METRICS: { key: SortMetric; icon: 'Thermometer' | 'Droplets' | 'Wind' }[] = [
  { key: 'apparent', icon: 'Thermometer' },
  { key: 'humidex', icon: 'Droplets' },
  { key: 'windchill', icon: 'Wind' },
]

// Removed METRIC_COLORS as we are using a unified glass style

export function HeaderMetricSelector() {
  const { sortMetric, setSortMetric, setAutoMetric } = useSortMetricContext()
  const { weather } = useLocalWeatherContext()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-select metric based on local weather
  const temperature = weather?.temperature
  useEffect(() => {
    if (temperature !== undefined) {
      setAutoMetric(getSuggestedMetric(temperature))
    }
  }, [temperature, setAutoMetric])

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

  /* Removed blocking states per user request */

  return (
    <div className="relative z-20" ref={containerRef}>
      <motion.div
        layout
        className={cn(
          'flex items-center whitespace-nowrap',
          'bg-background/80 backdrop-blur-md border border-border/50 shadow-sm',
          'rounded-full cursor-pointer select-none',
          'hover:bg-accent/50 transition-colors duration-200',
          !isOpen &&
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        )}
        initial={false}
        animate={{
          width: isOpen ? 'auto' : 'auto',
          gap: isOpen ? '4px' : '0px',
          padding: isOpen ? '4px' : '0px',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
            METRICS.map(({ key, icon }) => {
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
                    'relative h-10 flex items-center justify-center gap-2 px-3 rounded-full text-sm font-medium transition-colors',
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
                  {value !== null && <span className="text-xs font-semibold">{value}°</span>}

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
                'flex h-10 items-center gap-2 px-3 rounded-full',
                'bg-foreground/5 text-foreground' // Minimalist style
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {METRICS.find((m) => m.key === sortMetric) && (
                <Icon name={METRICS.find((m) => m.key === sortMetric)!.icon} size="sm" />
              )}
              {weather?.locationName && (
                <span className="text-sm font-semibold border-r border-white/20 pr-2 mr-2 max-w-[80px] sm:max-w-[150px] truncate">
                  {weather.locationName}
                </span>
              )}
              {activeValue !== null && (
                <span className="text-sm font-bold min-w-[1.5em] text-center">{activeValue}°</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
