import type { deleteCity, updateCity } from '@/actions/city'
import Grid from '@/components/custom-ui/grid'
import ForecastAddItem from '@/components/forecast/forecast-add-item'
import ForecastItem from '@/components/forecast/forecast-item'
import { getSortValue } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'

type ForecastListProps = {
  data: Forecast[]
  isAuthenticated: boolean
  showAddCard?: boolean
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

export default function ForecastList({
  data,
  isAuthenticated,
  showAddCard = false,
  updateCityAction,
  deleteCityAction,
}: ForecastListProps) {
  // Server-side sort (default to 'apparent' as we don't have client context access here easily without cookies)
  // If strict server component, we accept the data order or sort by default.
  const sortedData = [...data].sort(
    (a, b) => getSortValue(b.current, 'apparent') - getSortValue(a.current, 'apparent')
  )

  const pinnedCities = sortedData.filter((item) => item.city.pinned)
  const unpinnedCities = sortedData.filter((item) => !item.city.pinned)

  return (
    <Grid>
      {pinnedCities.map((item, index) => (
        <ForecastItem
          key={item.city.id}
          item={item}
          index={index}
          isAuthenticated={isAuthenticated}
          updateCityAction={updateCityAction}
          deleteCityAction={deleteCityAction}
        />
      ))}
      {unpinnedCities.map((item, index) => (
        <ForecastItem
          key={item.city.id}
          item={item}
          index={pinnedCities.length + index}
          isAuthenticated={isAuthenticated}
          updateCityAction={updateCityAction}
          deleteCityAction={deleteCityAction}
        />
      ))}
      {showAddCard && <ForecastAddItem />}
    </Grid>
  )
}
