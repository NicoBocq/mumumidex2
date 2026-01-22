import type { Forecast } from '@/types/forecast'

import { getMiseryClass } from '@/lib/misery-index'
import { cn, formatDateTime } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import WeatherIcon from '../weather/weather-icon'
import CardActions from './card-actions'
import Kpi from './kpi'
import MiseryGauge from './misery-gauge'

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
        'glass-card hover-scale',
        isExport ? 'absolute left-[-9999px] top-[-9999px] w-[350px] rounded-none' : '',
        getMiseryClass(data.current.miseryIndex),
        data.city.pinned && !isExport && getMiseryClass(data.current.miseryIndex, 'ring'),
        className
      )}
    >
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
        <MiseryGauge score={data.current.miseryIndex} className="scale-90" />
      </CardHeader>
      <CardContent>
        <Kpi data={data} isExport={isExport} />
      </CardContent>
      {showCardActions && <CardActions data={data} />}
    </Card>
  )
}
