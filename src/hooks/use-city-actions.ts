'use client'

import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import type { deleteCity, updateCity } from '@/actions/city'
import type { Forecast } from '@/types/forecast'

type UseCityActionsProps = {
  data: Forecast
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

export function useCityActions({ data, updateCityAction, deleteCityAction }: UseCityActionsProps) {
  const { execute: execUpdateCity, optimisticState: updateOptimisticState } = useOptimisticAction(
    updateCityAction,
    {
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
    }
  )

  const { execute: execDeleteCity } = useOptimisticAction(deleteCityAction, {
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

  // Merge optimistic states - if delete is active, technically data is gone, but we just return state
  // We prioritize the update state for modifications
  const optimisticData = updateOptimisticState.data

  return {
    execUpdateCity,
    execDeleteCity,
    optimisticData,
    // also return distinct states if needed, but optimisticData is usually what we want for rendering
  }
}
