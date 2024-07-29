import { Forecast } from '@/types/forecast'

import { getHumidexClass } from '@/lib/humidex'
import { cn, formatDateTime } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ContextMenu, ContextMenuTrigger } from '../ui/context-menu'
import { Skeleton } from '../ui/skeleton'
import CardActions from './card-actions'
import Kpi from './kpi'

export function SkeletonForecastCard() {
  return <Skeleton className="h-48" />
}

export default function ForecastCard({
  data,
  className,
}: {
  data: Forecast
  className?: string
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild className="select-none md:select-auto">
        <Card
          className={cn(
            'relative border-0 shadow-none',
            getHumidexClass(data.current.humidex),
            className,
          )}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle
                className={cn('inline-flex items-center gap-1 font-bold')}
              >
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
            <Kpi data={data} />
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <CardActions data={data} />
    </ContextMenu>
  )
}
