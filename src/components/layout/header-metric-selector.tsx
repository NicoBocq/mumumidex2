'use client'

import Icon from '@/components/custom-ui/icon'
import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import { getSuggestedMetric } from '@/hooks/use-local-weather'
import { cn } from '@/lib/utils'
import { METRIC_LABELS, type SortMetric } from '@/lib/weather-metrics'
import { useCallback, useEffect, useRef, useState } from 'react'

const METRICS: { key: SortMetric; icon: 'Thermometer' | 'Droplets' | 'Wind' }[] = [
  { key: 'apparent', icon: 'Thermometer' },
  { key: 'humidex', icon: 'Droplets' },
  { key: 'windchill', icon: 'Wind' },
]

const METRIC_COLORS: Record<SortMetric, string> = {
  apparent: 'bg-humidex-3 text-humidex-3-foreground',
  humidex: 'bg-humidex-4 text-humidex-4-foreground',
  windchill: 'bg-humidex-1 text-humidex-1-foreground',
}

export function HeaderMetricSelector() {
  const { sortMetric, setSortMetric, setAutoMetric } = useSortMetricContext()
  const { weather, permission, requestLocation, loading } = useLocalWeatherContext()
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showLabel, setShowLabel] = useState(false)
  const [isLabelVisible, setIsLabelVisible] = useState(false)
  const prevMetricRef = useRef<SortMetric | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-select metric based on local weather (only if user hasn't chosen)
  const temperature = weather?.temperature
  useEffect(() => {
    if (temperature !== undefined) {
      setAutoMetric(getSuggestedMetric(temperature))
    }
  }, [temperature, setAutoMetric])

  // Show label temporarily when metric changes (not on initial render)
  useEffect(() => {
    if (prevMetricRef.current !== null && prevMetricRef.current !== sortMetric) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Show label with animation
      setShowLabel(true)
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        setIsLabelVisible(true)
      })

      // Start fade-out after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsLabelVisible(false)
        // Remove from DOM after fade-out animation
        setTimeout(() => {
          setShowLabel(false)
        }, 300)
      }, 2000)
    }
    prevMetricRef.current = sortMetric

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [sortMetric])

  // Handle click outside to close
  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isExpanded])

  const handleMetricClick = useCallback(
    (key: SortMetric) => {
      if (!isExpanded) {
        setIsExpanded(true)
        return
      }
      if (key !== sortMetric) {
        setSortMetric(key)
      }
      setIsExpanded(false)
    },
    [isExpanded, sortMetric, setSortMetric]
  )

  // Reorder metrics to put active one first
  const orderedMetrics = [
    METRICS.find((m) => m.key === sortMetric)!,
    ...METRICS.filter((m) => m.key !== sortMetric),
  ]

  return (
    <div ref={containerRef} className="flex items-center overflow-visible">
      {orderedMetrics.map(({ key, icon }, index) => {
        const isActive = sortMetric === key

        // Active button with label container
        if (isActive) {
          return (
            <div key={key} className="relative">
              <button
                type="button"
                onClick={() => handleMetricClick(key)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ease-out',
                  METRIC_COLORS[key],
                  'shadow-md scale-110'
                )}
                title={METRIC_LABELS[key]}
                aria-label={METRIC_LABELS[key]}
                aria-pressed={true}
                aria-expanded={isExpanded}
              >
                <Icon name={icon} size="sm" />
              </button>
              {showLabel && (
                <span
                  className={cn(
                    'absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap pointer-events-none',
                    'transition-all duration-300 ease-out',
                    isLabelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                  )}
                >
                  {METRIC_LABELS[sortMetric]}
                </span>
              )}
            </div>
          )
        }

        // Inactive buttons
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleMetricClick(key)}
            className={cn(
              'flex h-10 items-center justify-center rounded-full transition-all duration-200 ease-out',
              'bg-white/10 text-foreground/70 hover:bg-white/20 hover:text-foreground',
              !isExpanded && 'w-0 opacity-0 overflow-hidden',
              isExpanded && 'w-10 opacity-100 ml-1'
            )}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
            title={METRIC_LABELS[key]}
            aria-label={METRIC_LABELS[key]}
            aria-pressed={false}
          >
            <Icon name={icon} size="sm" />
          </button>
        )
      })}
    </div>
  )
}
