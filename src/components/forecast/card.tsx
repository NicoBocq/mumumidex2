'use client'

import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'

import { deleteCity, updateCity } from '@/actions/city'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { cn, formatDateTime } from '@/lib/utils'
import { METRIC_LABELS, getDisplayValue, getMetricClass } from '@/lib/weather-metrics'
import { useOptimisticAction } from 'next-safe-action/hooks'
import * as React from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import WeatherIcon from '../weather/weather-icon'
import Kpi from './kpi'

function getWeatherLabel(code: number): string {
  if (code === 0) return 'Ciel dégagé'
  if (code <= 3) return 'Nuageux'
  if (code <= 48) return 'Brume'
  if (code <= 67) return 'Pluie'
  if (code <= 77) return 'Neige'
  if (code <= 82) return 'Averses'
  if (code <= 86) return 'Averses de neige'
  if (code <= 99) return 'Orage'
  return 'Inconnu'
}

export function SkeletonForecastCard() {
  return <Skeleton className="h-60" />
}

type ForecastCardProps = {
  data: Forecast
  id?: string
  className?: string
  showActions?: boolean
  isExport?: boolean
  sortMetric?: SortMetric
}

export default function ForecastCard({
  data,
  className,
  showActions = false,
  id,
  isExport = false,
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
        'glass-card hover-scale group relative',
        isExport ? 'absolute left-[-9999px] top-[-9999px] w-[350px] rounded-none' : '',
        cardClass,
        optimisticState.data.city.pinned && !isExport && ringClass,
        className
      )}
    >
      {/* Desktop hover actions */}
      {showActions && !isExport && (
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

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {data.city.name}
            <span className="ml-2 text-lg font-normal text-muted-foreground">
              {data.city.country_code}
            </span>
          </CardTitle>
          <div className="flex items-center gap-3">
            <WeatherIcon
              code={data.current.weather_code}
              isDay={data.current.is_day}
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">
                {getWeatherLabel(data.current.weather_code)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(data.current.time)}
              </span>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center rounded-full bg-background/50 p-4 backdrop-blur-sm">
          <span className={cn('text-4xl font-black tracking-tighter', textClass)}>
            {displayValue}°
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {METRIC_LABELS[sortMetric]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Kpi data={data} isExport={isExport} sortMetric={sortMetric} />
      </CardContent>
    </Card>
  )
}
