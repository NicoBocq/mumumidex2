'use client'

import * as React from 'react'
import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'
import ForecastCard from './card'
import ForecastCardActions from './card-actions'

type ForecastCardItemProps = {
  data: Forecast
  sortMetric?: SortMetric
  isEditable?: boolean
  index?: number
}

export default function ForecastCardItem({
  data,
  sortMetric = 'apparent',
  isEditable = false,
  index = 0,
}: ForecastCardItemProps) {
  const [isDeleted, setIsDeleted] = React.useState(false)
  const [isPinned, setIsPinned] = React.useState(data.city.pinned)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const cardData = React.useMemo(
    () => ({
      ...data,
      city: {
        ...data.city,
        pinned: isPinned,
      },
    }),
    [data, isPinned]
  )

  if (isDeleted) return null

  return (
    <div className="group relative w-full">
      <ForecastCard
        data={cardData}
        sortMetric={sortMetric}
        index={index}
        className="w-full"
        onExpandedChange={setIsExpanded}
      />
      {isEditable && (
        <>
          {isExpanded && (
            <div className="mt-2 flex justify-end md:hidden">
              <ForecastCardActions
                cityId={data.city.id}
                pinned={isPinned}
                onPinnedChange={setIsPinned}
                onDeleted={() => setIsDeleted(true)}
                orientation="horizontal"
              />
            </div>
          )}
          <div className="pointer-events-none absolute -right-12 top-12 z-20 hidden -translate-y-1/2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 md:flex">
            <ForecastCardActions
              cityId={data.city.id}
              pinned={isPinned}
              onPinnedChange={setIsPinned}
              onDeleted={() => setIsDeleted(true)}
              orientation="vertical"
            />
          </div>
        </>
      )}
    </div>
  )
}
