import { Forecast } from '@/types/forecast'

import React from 'react'

import { getHumidexClass } from '@/lib/humidex'
import { cn, formatDateTime } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import CardActions from './card-actions'
import Kpi from './kpi'

export function SkeletonForecastCard() {
  return <Skeleton className="h-60" />
}

export default function ForecastCard({
  data,
  className,
  showCardActions = false,
  id,
  isExport = false,
}: {
  data: Forecast
  id?: string
  className?: string
  showCardActions?: boolean
  isExport?: boolean
}) {
  return (
    <Card
      id={id}
      className={cn(
        'border-0 shadow-none',
        isExport
          ? 'absolute left-[-9999px] top-[-9999px] w-[350px] rounded-none'
          : '',
        getHumidexClass(data.current.humidex),
        data.city.pinned &&
          !isExport &&
          getHumidexClass(data.current.humidex, 'ring'),
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className={cn('inline-flex items-center gap-1 font-bold')}>
            {data.city.name}
            <span
              className={cn(
                getHumidexClass(data.current.humidex, 'foreground/10'),
              )}
            >
              {data.city.country_code}
            </span>
          </CardTitle>
          <CardDescription
            className={cn(
              'leading-tight',
              getHumidexClass(data.current.humidex, 'foreground/50'),
            )}
          >
            {formatDateTime(data.current.time)}
          </CardDescription>
        </div>
        <figure className={cn('text-5xl font-extrabold tracking-tighter')}>
          <data value={data.current.humidex}>{data.current.humidex}</data>
          <figcaption className="sr-only">Current Humidex</figcaption>
        </figure>
      </CardHeader>
      <CardContent>
        <Kpi data={data} isExport={isExport} />
      </CardContent>
      {showCardActions && <CardActions data={data} />}
    </Card>
  )
}
