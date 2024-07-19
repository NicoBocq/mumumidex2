import { Forecast } from '@/types/forecast'

import { getHumidexClass } from '@/lib/humidex'
import { cn, formatDateTime } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Skeleton } from '../ui/skeleton'
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
    <Card
      className={cn(
        'border-0 shadow-none',
        getHumidexClass(data.current.humidex),
        className,
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className={cn('font-bold')}>
            {data.location.name}{' '}
            <span
              className={cn(
                getHumidexClass(data.current.humidex, 'foreground/10'),
              )}
            >
              {data.location.country_code}
            </span>
          </CardTitle>
          <CardDescription
            className={cn(
              getHumidexClass(data.current.humidex, 'foreground/50'),
            )}
          >
            {formatDateTime(data.current.time)}
            {data.location.admin1 ? ` | ${data.location.admin1}` : ''}
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
  )
}
