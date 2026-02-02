'use client'

import { motion } from 'framer-motion'
import type { deleteCity, updateCity } from '@/actions/city'
import ForecastCard from '@/components/forecast/card'
import SwipeableCard from '@/components/forecast/swipeable-card'
import { useSortMetricContext } from '@/contexts/sort-metric-context'
import type { Forecast } from '@/types/forecast'

type ForecastItemProps = {
  item: Forecast
  index: number
  isAuthenticated: boolean
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

export default function ForecastItem({
  item,
  index,
  isAuthenticated,
  updateCityAction,
  deleteCityAction,
}: ForecastItemProps) {
  const { sortMetric } = useSortMetricContext()

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
        <>
          {/* Desktop View */}
          <div className="hidden md:block">
            <ForecastCard
              data={item}
              id={`card-${item.city.id}`}
              showActions
              sortMetric={sortMetric}
              updateCityAction={updateCityAction}
              deleteCityAction={deleteCityAction}
            />
          </div>
          {/* Mobile View */}
          <div className="block md:hidden">
            <SwipeableCard
              data={item}
              sortMetric={sortMetric}
              updateCityAction={updateCityAction}
              deleteCityAction={deleteCityAction}
            />
          </div>
        </>
      ) : (
        /* Unauthenticated View - Always ForecastCard */
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
