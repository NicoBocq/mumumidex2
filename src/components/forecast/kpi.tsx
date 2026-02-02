import { ArrowUp, Cloud, Droplets, Sun, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SortMetric } from '@/lib/weather-metrics'
import { getDisplayValue, getMetricClass } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'

import Gauge from '../custom-ui/gauge'
import Sparkline from '../custom-ui/sparkline'

export default function ForecastKpi({
  data,
  isExport,
  sortMetric = 'apparent',
  mode = 'full',
}: {
  data: Forecast
  isExport?: boolean
  sortMetric?: SortMetric
  mode?: 'minimal' | 'full' | 'extended'
}) {
  const next24hTemps = data.hourly.temperature_2m.slice(0, 24)
  const displayValue = getDisplayValue(data.current, sortMetric)
  const strokeClass = getMetricClass(displayValue, sortMetric, 'stroke')
  const textClass = getMetricClass(displayValue, sortMetric, 'text')
  const bgClass = getMetricClass(displayValue, sortMetric, 'bg')

  const isExtendedOnly = mode === 'extended'
  const isMinimal = mode === 'minimal'
  const isFull = mode === 'full'

  // Primary Metrics (Temp, Wind, Humidex/Humidity)
  const showPrimary = isMinimal || isFull
  // Secondary Metrics (Clouds, UV, AQI)
  const showSecondary = isExtendedOnly || isFull

  return (
    <div className={cn('grid grid-cols-3 gap-2 py-2', isExport && 'grid-cols-2')}>
      {/* Primary Metrics */}
      {showPrimary && (
        <>
          {/* 1. Temp Trend (Primary) */}
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70">Temp.</div>
            </div>
          </div>

          {/* 2. Wind (Primary) */}
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
              <div className="text-sm font-bold leading-none">
                {Math.round(data.current.wind_speed_10m)} km/h
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70">Wind</div>
            </div>
          </div>

          {/* 3. Humidity (Primary) */}
          <div className="flex flex-col items-center justify-end gap-2">
            <Gauge
              value={data.current.relative_humidity_2m}
              max={100}
              colorClass={textClass}
              icon={<Droplets className="h-5 w-5 text-muted-foreground/25" />}
            />
            <div className="text-center">
              <div className="text-sm font-bold leading-none">
                {data.current.relative_humidity_2m}%
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70">
                Humidity
              </div>
            </div>
          </div>
        </>
      )}

      {/* Secondary Metrics */}
      {showSecondary && (
        <>
          {/* 4. Clouds */}
          <div className="flex flex-col items-center justify-end gap-2">
            <Gauge
              value={data.current.cloud_cover}
              max={100}
              className="scale-90"
              colorClass={textClass}
              icon={<Cloud className="h-5 w-5 text-muted-foreground/25" />}
            />
            <div className="text-center">
              <div className="text-sm font-bold leading-none">{data.current.cloud_cover}%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70">
                Clouds
              </div>
            </div>
          </div>

          {/* 5. UV Index */}
          <div className="flex flex-col items-center justify-end gap-2">
            <Gauge
              value={data.current.uv_index}
              max={11}
              colorClass={textClass}
              icon={<Sun className="h-5 w-5 text-muted-foreground/25" />}
            />
            <div className="text-center">
              <div className="text-sm font-bold leading-none">
                {data.current.uv_index?.toFixed(0) ?? 0}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70">
                UV Index
              </div>
            </div>
          </div>

          {/* 6. AQI */}
          <div className="flex flex-col items-center justify-end gap-2">
            <Gauge
              value={data.current.european_aqi}
              max={100}
              colorClass={textClass}
              icon={<Wind className="h-5 w-5 text-muted-foreground/25" />}
            />
            <div className="text-center">
              <div className="text-sm font-bold leading-none">
                {data.current.european_aqi?.toFixed(0) ?? 0}
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70">AQI</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
