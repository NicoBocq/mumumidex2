'use client'

import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLocalWeatherContext } from '@/contexts/local-weather-context'
import { getSuggestedMetric } from '@/hooks/use-local-weather'
import { cn } from '@/lib/utils'
import { METRIC_LABELS, type SortMetric } from '@/lib/weather-metrics'

type SortSelectorProps = {
  value: SortMetric
  onChange: (value: SortMetric) => void
}

const METRIC_ICONS: Record<SortMetric, 'Thermometer' | 'Droplets' | 'Wind'> = {
  apparent: 'Thermometer',
  humidex: 'Droplets',
  windchill: 'Wind',
}

export default function SortSelector({ value, onChange }: SortSelectorProps) {
  const { weather, permission, requestLocation, loading } = useLocalWeatherContext()

  const suggestedMetric = getSuggestedMetric(weather)
  const showAutoButton = permission !== 'granted' || !weather

  const handleAutoDetect = () => {
    if (permission !== 'granted') {
      requestLocation()
    } else if (weather) {
      onChange(suggestedMetric)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 pb-4">
      <div className="flex items-center gap-2">
        <ToggleGroup
          value={value}
          onValueChange={(v) => onChange(v as SortMetric)}
          size="sm"
          className="glass-card"
        >
          {(Object.keys(METRIC_LABELS) as SortMetric[]).map((metric) => (
            <ToggleGroupItem
              key={metric}
              value={metric}
              className={cn(
                'gap-1.5',
                weather && metric === suggestedMetric && value !== metric && 'animate-pulse'
              )}
            >
              <Icon name={METRIC_ICONS[metric]} size="sm" />
              <span className="hidden sm:inline">{METRIC_LABELS[metric]}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {showAutoButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAutoDetect}
            disabled={loading}
            className="gap-1.5"
            title={permission === 'denied' ? 'Localisation refusée' : 'Détection automatique'}
          >
            <Icon
              name={permission === 'denied' ? 'MapPinOff' : 'MapPin'}
              size="sm"
              className={loading ? 'animate-pulse' : ''}
            />
            <span className="hidden sm:inline">Auto</span>
          </Button>
        )}
      </div>

      {weather && (
        <p className="text-xs text-muted-foreground">
          Chez vous : {Math.round(weather.temperature)}°C
          {weather.temperature > 20 && ` (humidex ${Math.round(weather.humidex)}°)`}
          {weather.temperature <= 5 && ` (ressenti ${Math.round(weather.windChill)}°)`}
        </p>
      )}
    </div>
  )
}
