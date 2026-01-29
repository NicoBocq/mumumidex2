'use client'

import type { Forecast } from '@/types/forecast'

import AddCityCard from '@/components/city/add-city-card'
import Grid from '@/components/custom-ui/grid'
import ForecastCard from '@/components/forecast/card'
import SwipeableCard from '@/components/forecast/swipeable-card'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import { getSortValue } from '@/lib/weather-metrics'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'

type ForecastListClientProps = {
  data: Forecast[]
  isAuthenticated: boolean
  showAddCard?: boolean
}

export default function ForecastListClient({
  data,
  isAuthenticated,
  showAddCard = false,
}: ForecastListClientProps) {
  const { sortMetric } = useSortMetricContext()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => getSortValue(b.current, sortMetric) - getSortValue(a.current, sortMetric)
    )
  }, [data, sortMetric])

  const pinnedCities = sortedData.filter((item) => item.city.pinned)
  const unpinnedCities = sortedData.filter((item) => !item.city.pinned)

  const renderCard = (item: Forecast, index: number) => {
    const cardContent = !isAuthenticated ? (
      <ForecastCard data={item} id={`card-${item.city.id}`} sortMetric={sortMetric} />
    ) : isDesktop ? (
      <ForecastCard data={item} id={`card-${item.city.id}`} showActions sortMetric={sortMetric} />
    ) : (
      <SwipeableCard data={item} sortMetric={sortMetric} />
    )

    return (
      <motion.div
        key={item.city.id}
        layout
        initial={{ opacity: 0, scale: 0.9, y: 20 + index * 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          duration: 0.25,
          delay: index * 0.08,
          layout: { duration: 0.3 },
        }}
      >
        {cardContent}
      </motion.div>
    )
  }

  return (
    <Grid>
      <AnimatePresence mode="popLayout">
        {pinnedCities.map((item, index) => renderCard(item, index))}
        {unpinnedCities.map((item, index) => renderCard(item, pinnedCities.length + index))}
        {showAddCard && (
          <motion.div
            key="add-city"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AddCityCard />
          </motion.div>
        )}
      </AnimatePresence>
    </Grid>
  )
}
