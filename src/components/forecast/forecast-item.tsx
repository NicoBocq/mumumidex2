'use client'

import { motion } from 'framer-motion'
import type { deleteCity, updateCity } from '@/actions/city'
import ForecastCard from '@/components/forecast/card'
import SwipeableCard from '@/components/forecast/swipeable-card'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { Forecast } from '@/types/forecast'

type ForecastItemProps = {
  item: Forecast
  index: number
  isAuthenticated: boolean
  showSwipeHint?: boolean
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

export default function ForecastItem({
  item,
  index,
  isAuthenticated,
  showSwipeHint = false,
  updateCityAction,
  deleteCityAction,
}: ForecastItemProps) {
  const { sortMetric } = useSortMetricContext()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <motion.div
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
      {isAuthenticated ? (
        isDesktop ? (
          <ForecastCard
            data={item}
            id={`card-${item.city.id}`}
            showActions
            sortMetric={sortMetric}
            updateCityAction={updateCityAction}
            deleteCityAction={deleteCityAction}
          />
        ) : (
          <SwipeableCard
            data={item}
            sortMetric={sortMetric}
            showSwipeHint={showSwipeHint}
            updateCityAction={updateCityAction}
            deleteCityAction={deleteCityAction}
          />
        )
      ) : (
        <ForecastCard
          data={item}
          id={`card-${item.city.id}`}
          sortMetric={sortMetric}
          updateCityAction={updateCityAction}
          deleteCityAction={deleteCityAction}
        />
      )}
    </motion.div>
  )
}
