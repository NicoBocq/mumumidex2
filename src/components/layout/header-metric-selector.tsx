'use client'

import Icon from '@/components/custom-ui/icon'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import { getSuggestedMetric } from '@/hooks/use-local-weather'
import { cn } from '@/lib/utils'
import { METRIC_LABELS, type SortMetric } from '@/lib/weather-metrics'

const METRIC_ICONS: Record<SortMetric, 'Thermometer' | 'Droplets' | 'Wind'> = {
  apparent: 'Thermometer',
  humidex: 'Droplets',
  windchill: 'Wind',
}

export function HeaderMetricSelector() {
  const { sortMetric, setSortMetric } = useSortMetricContext()
  const { weather, permission, requestLocation, loading } = useLocalWeatherContext()

  const suggestedMetric = getSuggestedMetric(weather)
  const showAutoButton = permission !== 'granted' || !weather

  const handleAutoDetect = () => {
    if (permission !== 'granted') {
      requestLocation()
    } else if (weather) {
      setSortMetric(suggestedMetric)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ToggleGroup
        value={sortMetric}
        onValueChange={(v) => v && setSortMetric(v as SortMetric)}
        size="sm"
        className="glass-card"
      >
        {(Object.keys(METRIC_LABELS) as SortMetric[]).map((metric) => (
          <ToggleGroupItem
            key={metric}
            value={metric}
            className={cn(
              'gap-1.5 px-2 sm:px-3',
              weather && metric === suggestedMetric && sortMetric !== metric && 'animate-pulse'
            )}
          >
            <Icon name={METRIC_ICONS[metric]} size="sm" />
            <span className="hidden sm:inline">{METRIC_LABELS[metric]}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {showAutoButton && (
        <button
          type="button"
          onClick={handleAutoDetect}
          disabled={loading}
          className="flex h-8 w-8 items-center justify-center rounded-full glass hover-scale transition-all"
          title={permission === 'denied' ? 'Localisation refusée' : 'Détection automatique'}
        >
          <Icon
            name={permission === 'denied' ? 'MapPinOff' : 'MapPin'}
            size="sm"
            className={loading ? 'animate-pulse' : ''}
          />
        </button>
      )}
    </div>
  )
}
