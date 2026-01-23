'use client'

import type { Forecast } from '@/types/forecast'

import Grid from '@/components/custom-ui/grid'
import ForecastCard from '@/components/forecast/card'
import SwipeableCard from '@/components/forecast/swipeable-card'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import { getSortValue } from '@/lib/weather-metrics'
import { useMemo } from 'react'

type ForecastListClientProps = {
  data: Forecast[]
  isAuthenticated: boolean
}

export default function ForecastListClient({ data, isAuthenticated }: ForecastListClientProps) {
  const { sortMetric } = useSortMetricContext()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => getSortValue(b.current, sortMetric) - getSortValue(a.current, sortMetric)
    )
  }, [data, sortMetric])

  const pinnedCities = sortedData.filter((item) => item.city.pinned)
  const unpinnedCities = sortedData.filter((item) => !item.city.pinned)

  const renderCard = (item: Forecast) => {
    if (!isAuthenticated) {
      return (
        <ForecastCard
          key={item.city.id}
          data={item}
          id={`card-${item.city.id}`}
          sortMetric={sortMetric}
        />
      )
    }

    // Mobile: swipeable, Desktop: hover actions
    if (isDesktop) {
      return (
        <ForecastCard
          key={item.city.id}
          data={item}
          id={`card-${item.city.id}`}
          showActions
          sortMetric={sortMetric}
        />
      )
    }

    return <SwipeableCard key={item.city.id} data={item} sortMetric={sortMetric} />
  }

  return (
    <Grid>
      {pinnedCities.map(renderCard)}
      {unpinnedCities.map(renderCard)}
    </Grid>
  )
}
