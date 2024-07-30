import { Forecast } from '@/types/forecast'

import { getHumidexClass } from '@/lib/humidex'
import { cn } from '@/lib/utils'

import Icon from '../custom-ui/icon'

interface KpiItemProps {
  icon: React.ReactNode
  label: string
  value: string | number
  unit: string
  humidex: number
}

const KpiItem = ({ icon, label, value, unit, humidex }: KpiItemProps) => {
  const IconComponent = icon
  return (
    <div className="relative">
      <dt>
        <div className="absolute bottom-1">{IconComponent}</div>
        <p
          className={cn(
            'ml-6 text-xs',
            getHumidexClass(humidex, 'foreground/50'),
          )}
        >
          {label}
        </p>
      </dt>
      <dd className="ml-6">
        {value} {unit}
      </dd>
    </div>
  )
}

export default function ForecastKpi({
  data,
  forceMobile,
}: {
  data: Forecast
  forceMobile?: boolean
}) {
  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-2 sm:grid-cols-4',
        forceMobile && 'sm:grid-cols-2',
      )}
    >
      <KpiItem
        icon={<Icon name="Thermometer" />}
        label="Temperature"
        value={data.current.temperature_2m}
        unit={data.current_units.temperature_2m}
        humidex={data.current.humidex}
      />
      <KpiItem
        icon={<Icon name="Thermometer" />}
        label="Feels Like"
        value={data.current.apparent_temperature}
        unit={data.current_units.apparent_temperature}
        humidex={data.current.humidex}
      />
      <KpiItem
        icon={<Icon name="Droplet" />}
        label="Humidity"
        value={data.current.relative_humidity_2m}
        unit={data.current_units.relative_humidity_2m}
        humidex={data.current.humidex}
      />
      <KpiItem
        icon={<Icon name="Wind" />}
        label="Wind Speed"
        value={data.current.wind_speed_10m}
        unit={data.current_units.wind_speed_10m}
        humidex={data.current.humidex}
      />
    </dl>
  )
}
