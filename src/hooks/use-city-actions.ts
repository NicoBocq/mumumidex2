'use client'

import { useAction, useOptimisticAction } from 'next-safe-action/hooks'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import type { deleteCity, updateCity } from '@/actions/city'
import type { Forecast } from '@/types/forecast'

type UseCityActionsProps = {
  data: Forecast
  updateCityAction: typeof updateCity
  deleteCityAction: typeof deleteCity
}

export function useCityActions({ data, updateCityAction, deleteCityAction }: UseCityActionsProps) {
  const [isDeleted, setIsDeleted] = useState(false)

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

  const { execute: executeDelete } = useAction(deleteCityAction, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        setIsDeleted(false)
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
      }
    },
    onError: () => {
      setIsDeleted(false)
      toast.error('Something went wrong')
    },
  })

  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const execDeleteCity = useCallback(
    (id: string) => {
      setIsDeleted(true)
      toast(`${data.city.name} removed`, {
        action: {
          label: 'Undo',
          onClick: () => {
            if (deleteTimerRef.current) {
              clearTimeout(deleteTimerRef.current)
              deleteTimerRef.current = null
            }
            setIsDeleted(false)
          },
        },
        duration: 4000,
        onDismiss: () => {
          if (deleteTimerRef.current) {
            clearTimeout(deleteTimerRef.current)
          }
          executeDelete(id)
        },
        onAutoClose: () => {
          executeDelete(id)
        },
      })
    },
    [executeDelete, data.city.name]
  )

  const optimisticData = updateOptimisticState.data

  return {
    execUpdateCity,
    execDeleteCity,
    optimisticData,
    isDeleted,
  }
}
