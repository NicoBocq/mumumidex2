'use client'

import * as React from 'react'
import type { deleteCity, updateCity } from '@/actions/city'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { useCityActions } from '@/hooks/use-city-actions'
import { useSwipe } from '@/hooks/use-swipe'
import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'
import ForecastCard from './card'

type SwipeableCardProps = {
  data: Forecast
  sortMetric?: SortMetric
  showSwipeHint?: boolean
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

const ACTION_WIDTH = 120

export default function SwipeableCard({
  data,
  sortMetric = 'apparent',
  showSwipeHint = false,
  updateCityAction,
  deleteCityAction,
}: SwipeableCardProps) {
  const { translateX, handlers, close } = useSwipe({ actionWidth: ACTION_WIDTH })
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [hintVisible, setHintVisible] = React.useState(showSwipeHint)

  // Dismiss hint after first swipe or after 4 seconds
  React.useEffect(() => {
    if (!hintVisible) return
    const timer = setTimeout(() => setHintVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [hintVisible])

  React.useEffect(() => {
    if (hintVisible && translateX > 0) {
      setHintVisible(false)
    }
  }, [hintVisible, translateX])

  const { execUpdateCity, execDeleteCity, optimisticData, isDeleted } = useCityActions({
    data,
    updateCityAction,
    deleteCityAction,
  })

  const handlePin = React.useCallback(() => {
    execUpdateCity({
      id: data.city.id,
      pinned: !data.city.pinned,
    })
    close()
  }, [execUpdateCity, data.city.id, data.city.pinned, close])

  const handleDelete = React.useCallback(() => {
    execDeleteCity(data.city.id)
  }, [execDeleteCity, data.city.id])

  // Close swipe when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [close])

  if (isDeleted) return null

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-xl">
      {/* Action buttons behind the card - only visible during swipe */}
      <div
        className="absolute inset-y-0 right-0 flex items-stretch transition-opacity duration-150"
        style={{
          width: ACTION_WIDTH,
          opacity: translateX > 0 ? 1 : 0,
          pointerEvents: translateX > 0 ? 'auto' : 'none',
        }}
      >
        <Button
          variant="ghost"
          className="flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none bg-primary/20 text-primary hover:bg-primary/30"
          onClick={handlePin}
        >
          <Icon name="Pin" size="sm" />
          <span className="text-xs">{optimisticData.city.pinned ? 'Unpin' : 'Pin'}</span>
        </Button>
        <Button
          variant="ghost"
          className="flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-none bg-destructive/20 text-destructive hover:bg-destructive/30"
          onClick={handleDelete}
        >
          <Icon name="Trash2" size="sm" />
          <span className="text-xs">Delete</span>
        </Button>
      </div>

      {/* Swipeable card */}
      <div
        {...handlers}
        className="relative transition-transform duration-200 ease-out"
        style={{ transform: `translateX(-${translateX}px)` }}
      >
        <ForecastCard
          data={data}
          id={`card-${data.city.id}`}
          sortMetric={sortMetric}
          updateCityAction={updateCityAction}
          deleteCityAction={deleteCityAction}
        />

        {/* Swipe hint indicator */}
        {hintVisible && (
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center animate-[swipe-hint_1.5s_ease-in-out_infinite]">
            <Icon name="ChevronsLeft" size="sm" className="text-muted-foreground/50" />
          </div>
        )}
      </div>
    </div>
  )
}
