import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'
import { ArrowUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { getDisplayValue, getMetricClass } from '@/lib/weather-metrics'

import Gauge from '../custom-ui/gauge'
import Sparkline from '../custom-ui/sparkline'

export default function ForecastKpi({
  data,
  isExport,
  sortMetric = 'apparent',
}: {
  data: Forecast
  isExport?: boolean
  sortMetric?: SortMetric
}) {
  const next24hTemps = data.hourly.temperature_2m.slice(0, 24)
  const displayValue = getDisplayValue(data.current, sortMetric)
  const strokeClass = getMetricClass(displayValue, sortMetric, 'stroke')
  const textClass = getMetricClass(displayValue, sortMetric, 'text')
  const bgClass = getMetricClass(displayValue, sortMetric, 'bg')

  return (
    <div className={cn('grid grid-cols-4 gap-2 py-2', isExport && 'grid-cols-2')}>
      {/* 1. Temp Trend */}
      <div className="flex flex-col items-center justify-end gap-2">
        <Sparkline
          data={next24hTemps}
          color={cn(strokeClass, 'opacity-90 stroke-2')}
          className="h-8 w-16"
        />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm font-bold leading-none">
              {Math.round(data.current.temperature_2m)}°
            </span>
            <span
              className={cn(
                'rounded-sm flex items-center justify-center px-2 py-0.5 text-xs font-medium backdrop-blur-sm',
                bgClass
              )}
            >
              {Math.round(data.current.apparent_temperature)}°
            </span>
          </div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
            Température
          </div>
        </div>
      </div>

      {/* 2. Wind */}
      <div className="flex flex-col items-center justify-end gap-2">
        <Gauge
          value={Math.min(data.current.wind_speed_10m, 100)}
          colorClass={textClass}
          icon={
            <ArrowUp
              className="h-4 w-4 text-foreground/80"
              style={{ transform: `rotate(${data.current.wind_direction_10m}deg)` }}
            />
          }
        />
        <div className="text-center">
          <div className="text-sm font-bold leading-none">{data.current.wind_speed_10m}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70">km/h</div>
        </div>
      </div>

      {/* 3. Humidity */}
      <div className="flex flex-col items-center justify-end gap-2">
        <Gauge value={data.current.relative_humidity_2m} colorClass={textClass} />
        <div className="text-center">
          <div className="text-sm font-bold leading-none">{data.current.relative_humidity_2m}%</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
            Humidité
          </div>
        </div>
      </div>

      {/* 4. Clouds */}
      <div className="flex flex-col items-center justify-end gap-2">
        <Gauge value={data.current.cloud_cover} className="scale-90" colorClass={textClass} />
        <div className="text-center">
          <div className="text-sm font-bold leading-none">{data.current.cloud_cover}%</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground/70">Nuages</div>
        </div>
      </div>
    </div>
  )
}
