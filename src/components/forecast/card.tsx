'use client'

import * as React from 'react'

import type { deleteCity, updateCity } from '@/actions/city'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { useCityActions } from '@/hooks/use-city-actions'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { SortMetric } from '@/lib/weather-metrics'
import { getDisplayValue, getMetricClass } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import WeatherIcon from '../weather/weather-icon'
import Kpi from './kpi'
import WeeklyForecast from './weekly-forecast'

export function SkeletonForecastCard() {
  return <Skeleton className="h-60" />
}

type ForecastCardProps = {
  data: Forecast
  id?: string
  className?: string
  showActions?: boolean
  sortMetric?: SortMetric
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

export default function ForecastCard({
  data,
  className,
  showActions = false,
  id,
  sortMetric = 'apparent',
  updateCityAction,
  deleteCityAction,
}: ForecastCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const displayValue = getDisplayValue(data.current, sortMetric)
  const cardClass = getMetricClass(displayValue, sortMetric, 'card')
  const textClass = getMetricClass(displayValue, sortMetric, 'text')
  const groupHoverClass = getMetricClass(displayValue, sortMetric, 'groupHoverText')

  const { execUpdateCity, execDeleteCity, optimisticData, isDeleted } = useCityActions({
    data,
    updateCityAction,
    deleteCityAction,
  })

  const handlePin = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      execUpdateCity({
        id: data.city.id,
        pinned: !data.city.pinned,
      })
    },
    [execUpdateCity, data.city.id, data.city.pinned]
  )

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      execDeleteCity(data.city.id)
    },
    [execDeleteCity, data.city.id]
  )

  const toggleExpand = React.useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  if (showActions && isDeleted) return null

  return (
    <div className="group flex items-start hover:gap-2">
      <Card
        id={id}
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
          'glass relative flex-1 cursor-pointer overflow-hidden rounded-xl transition-all hover:ring-2 hover:ring-primary/20 bg-background/60',
          cardClass,
          className
        )}
      >
        {/* Pinned indicator */}
        {optimisticData.city.pinned && (
          <Icon
            name="Bookmark"
            size="xs"
            className="absolute bottom-2 left-2 fill-current text-muted-foreground/30"
          />
        )}

        {/* Metadata: country + time */}
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
              {/* <div
                className={cn(
                  'text-xxs font-medium uppercase tracking-wider',
                  textClass,
                  'opacity-70'
                )}
              >
                {getMetricLevelLabel(displayValue, sortMetric)}
              </div> */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="">
            <Kpi data={data} sortMetric={sortMetric} mode="minimal" />
          </div>

          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
              isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <div className="overflow-hidden">
              <div className="">
                <Kpi data={data} sortMetric={sortMetric} mode="extended" />
                <div className="my-4 h-px w-full bg-border/50" />
                <WeeklyForecast data={data.daily} />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Expand Handle */}
        <div
          className={cn(
            'flex w-full justify-center pb-2 pt-1 text-primary/80 transition-colors',
            groupHoverClass
          )}
        >
          <Icon
            name="ChevronDown"
            size="xs"
            className={cn('transition-transform duration-300', isExpanded && 'rotate-180')}
          />
        </div>
      </Card>

      {/* Actions outside card */}
      {showActions && (
        <div className="hidden w-0 flex-col justify-center gap-1 overflow-hidden opacity-0 transition-all duration-200 group-hover:w-10 group-hover:opacity-100 md:flex sticky top-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full backdrop-blur-sm hover:bg-muted"
            onClick={handlePin}
            aria-label={optimisticData.city.pinned ? 'Unpin' : 'Pin'}
          >
            <Icon
              name="Bookmark"
              size="sm"
              className={cn(optimisticData.city.pinned && 'fill-current')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-destructive backdrop-blur-sm hover:bg-destructive/10"
            onClick={handleDelete}
            aria-label="Delete"
          >
            <Icon name="Trash2" size="sm" />
          </Button>
        </div>
      )}
    </div>
  )
}
