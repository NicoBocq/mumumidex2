import AddCityCard from '@/components/city/add-city-card'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import Section from '@/components/custom-ui/section'
import ForecastAddItem from '@/components/forecast/forecast-add-item'
import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'
import ForecastCardItem from './card-item'

type ForecastListServerProps = {
  pinnedCities: Forecast[]
  unpinnedCities: Forecast[]
  isAuthenticated?: boolean
  sortMetric?: SortMetric
}

export default function ForecastListServer({
  pinnedCities,
  unpinnedCities,
  isAuthenticated = false,
  sortMetric = 'apparent',
}: ForecastListServerProps) {
  const totalCount = pinnedCities.length + unpinnedCities.length

  if (totalCount === 0) {
    if (isAuthenticated) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <Icon name="MapPin" size="xl" className="text-muted-foreground/50" />
            <h2 className="text-2xl font-bold tracking-tight">No cities yet</h2>
            <p className="max-w-sm text-muted-foreground">
              Add your first city to start comparing weather and see which places feel the hottest.
            </p>
          </div>
          <AddCityCard />
        </div>
      )
    }
    return (
      <Section withoutCard className="text-muted-foreground">
        <Icon name="CloudOff" size="xl" />
        <p className="text-lg font-medium">Unable to load weather data</p>
        <p className="text-sm">Please check your connection and try again.</p>
      </Section>
    )
  }

  return (
    <Grid>
      {pinnedCities.map((item, index) => (
        <ForecastCardItem
          key={item.city.id}
          data={item}
          sortMetric={sortMetric}
          isEditable={isAuthenticated}
          index={index}
        />
      ))}
      {unpinnedCities.map((item, index) => (
        <ForecastCardItem
          key={item.city.id}
          data={item}
          sortMetric={sortMetric}
          isEditable={isAuthenticated}
          index={pinnedCities.length + index}
        />
      ))}
      {isAuthenticated && <ForecastAddItem />}
    </Grid>
  )
}
