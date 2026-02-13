'use client'

import { motion } from 'framer-motion'
import * as React from 'react'
import { getForecastDetails } from '@/actions/forecast'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { SortMetric } from '@/lib/weather-metrics'
import { getDisplayValue, getMetricClass } from '@/lib/weather-metrics'
import type { Forecast, ForecastDetails } from '@/types/forecast'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import WeatherIcon from '../weather/weather-icon'
import Kpi from './kpi'
import WeeklyForecast from './weekly-forecast'

type ForecastCardProps = {
  data: Forecast
  className?: string
  sortMetric?: SortMetric
  index?: number
  onExpandedChange?: (expanded: boolean) => void
}

export default function ForecastCard({
  data,
  className,
  sortMetric = 'apparent',
  index = 0,
  onExpandedChange,
}: ForecastCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [details, setDetails] = React.useState<ForecastDetails | null>(null)
  const [detailsLoading, setDetailsLoading] = React.useState(false)
  const [detailsError, setDetailsError] = React.useState<string | null>(null)

  const displayValue = getDisplayValue(data.current, sortMetric)
  const cardClass = getMetricClass(displayValue, sortMetric, 'card')
  const textClass = getMetricClass(displayValue, sortMetric, 'text')
  const groupHoverClass = getMetricClass(displayValue, sortMetric, 'groupHoverText')
  const hasServerDetails = data.daily.time.length > 0

  const loadDetails = React.useCallback(async () => {
    if (hasServerDetails || detailsLoading) return

    setDetailsLoading(true)
    setDetailsError(null)
    try {
      const result = await getForecastDetails({
        latitude: data.latitude,
        longitude: data.longitude,
      })
      if (!result.data || result.error) {
        throw new Error(result.error || 'Failed to fetch details')
      }
      setDetails(result.data)
    } catch (_error) {
      setDetailsError('Unable to load detailed forecast')
    } finally {
      setDetailsLoading(false)
    }
  }, [data.latitude, data.longitude, detailsLoading, hasServerDetails])

  React.useEffect(() => {
    if (!isExpanded || hasServerDetails || details || detailsLoading || detailsError) return
    void loadDetails()
  }, [details, detailsError, detailsLoading, hasServerDetails, isExpanded, loadDetails])

  const expandedData = React.useMemo(() => {
    if (hasServerDetails || !details) return data
    return {
      ...data,
      current: {
        ...data.current,
        ...details.current,
      },
      daily: details.daily,
    }
  }, [data, details, hasServerDetails])

  const toggleExpand = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  React.useEffect(() => {
    onExpandedChange?.(isExpanded)
  }, [isExpanded, onExpandedChange])

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.24,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 0.61, 0.36, 1],
      }}
    >
      <Card
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={toggleExpand}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleExpand()
          }
        }}
        className={cn(
          'glass group relative cursor-pointer overflow-hidden rounded-xl bg-background/60 transition-all hover:ring-2 hover:ring-primary/20',
          cardClass,
          className
        )}
      >
        {data.city.pinned && (
          <Icon
            name="Bookmark"
            size="xs"
            className="absolute bottom-2 left-2 fill-current text-muted-foreground/30"
          />
        )}

        <span className="absolute bottom-3 right-3 text-xs text-muted-foreground/70">
          {data.city.country_code} • {formatDateTime(data.current.time)}
        </span>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={cn('text-2xl font-bold tracking-tighter md:text-3xl', textClass)}>
            {data.city.name}
          </CardTitle>
          <div className="flex items-center gap-4">
            <WeatherIcon
              code={data.current.weather_code}
              isDay={data.current.is_day}
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <div className="text-right">
              <span className={cn('text-4xl font-black tracking-tighter md:text-5xl', textClass)}>
                {displayValue}
                {sortMetric === 'apparent' && '°'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Kpi data={data} sortMetric={sortMetric} mode="minimal" />

          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className="overflow-hidden">
              {detailsLoading ? (
                <div className="space-y-3 py-2">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-28" />
                </div>
              ) : detailsError ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-muted-foreground">{detailsError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      void loadDetails()
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Kpi data={expandedData} sortMetric={sortMetric} mode="extended" />
                  <div className="my-4 h-px w-full bg-border/50" />
                  <WeeklyForecast data={expandedData.daily} />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <div
          className={cn('flex w-full justify-center pb-2 pt-1 text-primary/80', groupHoverClass)}
        >
          <Icon
            name="ChevronDown"
            size="xs"
            className={cn('transition-transform duration-300', isExpanded && 'rotate-180')}
          />
        </div>
      </Card>
    </motion.div>
  )
}
