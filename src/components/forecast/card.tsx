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
import Kpi from './kpi'

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
          </CardDescription>
        </div>
        <div className={cn('text-5xl font-extrabold tracking-tighter')}>
          {data.current.humidex}
        </div>
      </CardHeader>
      <CardContent>
        <Kpi data={data} />
      </CardContent>
    </Card>
  )
}
