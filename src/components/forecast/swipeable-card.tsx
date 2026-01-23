'use client'

import type { SortMetric } from '@/lib/weather-metrics'
import type { Forecast } from '@/types/forecast'

import { deleteCity, updateCity } from '@/actions/city'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { useSwipe } from '@/hooks/use-swipe'
import { useOptimisticAction } from 'next-safe-action/hooks'
import * as React from 'react'
import { toast } from 'sonner'
import ForecastCard from './card'

type SwipeableCardProps = {
  data: Forecast
  sortMetric?: SortMetric
}

const ACTION_WIDTH = 120

export default function SwipeableCard({ data, sortMetric = 'apparent' }: SwipeableCardProps) {
  const { translateX, handlers, close } = useSwipe({ actionWidth: ACTION_WIDTH })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { execute: execUpdateCity, optimisticState } = useOptimisticAction(updateCity, {
    currentState: { data },
    updateFn: (state, newState) => ({
      data: {
        ...state.data,
        city: {
          ...state.data.city,
          ...newState,
        },
      },
    }),
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const { execute: execDeleteCity } = useOptimisticAction(deleteCity, {
    currentState: { data },
    updateFn: (state) => state,
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
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

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-lg">
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
          <span className="text-xs">{optimisticState.data.city.pinned ? 'Unpin' : 'Pin'}</span>
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
        <ForecastCard data={data} id={`card-${data.city.id}`} sortMetric={sortMetric} />
      </div>
    </div>
  )
}
