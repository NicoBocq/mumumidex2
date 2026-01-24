'use client'

import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'

import { deleteCity, updateCity } from '@/actions/city'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { cn, formatDateTime } from '@/lib/utils'
import { getDisplayValue, getMetricClass } from '@/lib/weather-metrics'
import { useOptimisticAction } from 'next-safe-action/hooks'
import * as React from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import WeatherIcon from '../weather/weather-icon'
import Kpi from './kpi'

export function SkeletonForecastCard() {
  return <Skeleton className="h-60" />
}

type ForecastCardProps = {
  data: Forecast
  id?: string
  className?: string
  showActions?: boolean
  sortMetric?: SortMetric
}

export default function ForecastCard({
  data,
  className,
  showActions = false,
  id,
  sortMetric = 'apparent',
}: ForecastCardProps) {
  const displayValue = getDisplayValue(data.current, sortMetric)
  const cardClass = getMetricClass(displayValue, sortMetric, 'card')
  const ringClass = getMetricClass(displayValue, sortMetric, 'ring')
  const textClass = getMetricClass(displayValue, sortMetric, 'text')

  const { execute: execUpdateCity, optimisticState } = useOptimisticAction(updateCity, {
    currentState: { data },
    updateFn: (state, newState) => ({
      data: {
        ...state.data,
        city: {
          ...state.data.city,
          ...newState,
        },
      },
    }),
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const { execute: execDeleteCity } = useOptimisticAction(deleteCity, {
    currentState: { data },
    updateFn: (state) => state,
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const handlePin = React.useCallback(() => {
    execUpdateCity({
      id: data.city.id,
      pinned: !data.city.pinned,
    })
  }, [execUpdateCity, data.city.id, data.city.pinned])

  const handleDelete = React.useCallback(() => {
    execDeleteCity(data.city.id)
  }, [execDeleteCity, data.city.id])

  return (
    <Card
      id={id}
      className={cn(
        'group relative overflow-hidden border bg-white/10 backdrop-blur-md rounded-xl transition-all duration-500 active:scale-[0.98]',
        'dark:bg-black/20',
        cardClass,
        optimisticState.data.city.pinned && ringClass,
        className
      )}
    >
      {/* Desktop hover actions */}
      {showActions && (
        <div className="absolute right-2 top-2 z-10 hidden gap-1 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handlePin}
            title={optimisticState.data.city.pinned ? 'Unpin' : 'Pin'}
          >
            <Icon
              name="Pin"
              size="sm"
              className={cn(optimisticState.data.city.pinned && 'fill-current')}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 text-destructive backdrop-blur-sm hover:bg-background hover:text-destructive"
            onClick={handleDelete}
            title="Delete"
          >
            <Icon name="Trash2" size="sm" />
          </Button>
        </div>
      )}

      {/* Metadata: country + time */}
      <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/70">
        {data.city.country_code} • {formatDateTime(data.current.time)}
      </span>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={cn('text-xl font-bold tracking-tight md:text-2xl', textClass)}>
          {data.city.name}
        </CardTitle>
        <div className="flex items-center gap-4">
          <WeatherIcon
            code={data.current.weather_code}
            isDay={data.current.is_day}
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <div>
            <span className={cn('text-4xl font-black tracking-tighter md:text-5xl', textClass)}>
              {displayValue}
              {sortMetric === 'apparent' && '°'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Kpi data={data} sortMetric={sortMetric} />
      </CardContent>
    </Card>
  )
}
