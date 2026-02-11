'use client'

import React from 'react'
import type { deleteCity, updateCity } from '@/actions/city'
import AddCityCard from '@/components/city/add-city-card'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import ForecastAddItem from '@/components/forecast/forecast-add-item'
import ForecastItem from '@/components/forecast/forecast-item'
import { getSortValue } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'

const SWIPE_HINT_KEY = 'mumumidex-swipe-hint-shown'

type ForecastListProps = {
  data: Forecast[]
  isAuthenticated: boolean
  showAddCard?: boolean
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
  sortMetric?: 'apparent' | 'humidex' | 'windchill'
}

export default function ForecastList({
  data,
  isAuthenticated,
  showAddCard = false,
  updateCityAction,
  deleteCityAction,
  sortMetric = 'apparent',
}: ForecastListProps) {
  const [showSwipeHint] = React.useState(() => {
    if (typeof window === 'undefined') return false
    const shown = localStorage.getItem(SWIPE_HINT_KEY)
    if (!shown) {
      localStorage.setItem(SWIPE_HINT_KEY, 'true')
      return true
    }
    return false
  })

  // Server-side sort based on prop
  const sortedData = [...data].sort(
    (a, b) => getSortValue(b.current, sortMetric) - getSortValue(a.current, sortMetric)
  )

  const pinnedCities = sortedData.filter((item) => item.city.pinned)
  const unpinnedCities = sortedData.filter((item) => !item.city.pinned)

  // Empty state for authenticated users with no cities
  if (isAuthenticated && data.length === 0) {
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

  let firstSwipeableRendered = false

  return (
    <Grid>
      {pinnedCities.map((item, index) => {
        const hint = isAuthenticated && showSwipeHint && !firstSwipeableRendered
        if (hint) firstSwipeableRendered = true
        return (
          <ForecastItem
            key={item.city.id}
            item={item}
            index={index}
            isAuthenticated={isAuthenticated}
            showSwipeHint={hint}
            updateCityAction={updateCityAction}
            deleteCityAction={deleteCityAction}
          />
        )
      })}
      {unpinnedCities.map((item, index) => {
        const hint = isAuthenticated && showSwipeHint && !firstSwipeableRendered
        if (hint) firstSwipeableRendered = true
        return (
          <ForecastItem
            key={item.city.id}
            item={item}
            index={pinnedCities.length + index}
            isAuthenticated={isAuthenticated}
            showSwipeHint={hint}
            updateCityAction={updateCityAction}
            deleteCityAction={deleteCityAction}
          />
        )
      })}
      {showAddCard && <ForecastAddItem />}
    </Grid>
  )
}
