'use client'

import { Forecast } from '@/types/forecast'

import React from 'react'
import { deleteCity, updateCity } from '@/actions/city'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import Icon from '@/components/custom-ui/icon'

type CardActionsProps = {
  data: Forecast
}

export default function CardActions({ data }: CardActionsProps) {
  const { execute: execUpdateCity, optimisticState } = useOptimisticAction(
    updateCity,
    {
      currentState: { data },
      updateFn: (state, newState) => {
        return {
          data: {
            ...state.data,
            city: {
              ...state.data.city,
              ...newState,
            },
          },
        }
      },
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
    },
  )

  const { execute: execDeleteCity } = useOptimisticAction(deleteCity, {
    currentState: { data },
    updateFn: (state) => {
      return {
        data: {
          ...state.data,
        },
      }
    },
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
      }
    },
  })

  const handleUpdate = (context: 'pinned' | 'hidden') => {
    execUpdateCity({
      id: data.city.id,
      [context]: !data.city[context],
    })
  }

  const handleDelete = () => {
    execDeleteCity(data.city.id)
  }

  return (
    <ContextMenuContent>
      <ContextMenuLabel>Settings</ContextMenuLabel>
      <ContextMenuItem
        className="flex items-center gap-2"
        onClick={() => handleUpdate('pinned')}
      >
        <Icon name={optimisticState.data.city.pinned ? 'PinOff' : 'Pin'} />
        {optimisticState.data.city.pinned ? 'Unpin' : 'Pin'}
      </ContextMenuItem>
      <ContextMenuItem
        className="flex items-center gap-2"
        onClick={() => handleUpdate('hidden')}
      >
        <Icon name={optimisticState.data.city.hidden ? 'EyeOff' : 'Eye'} />
        {optimisticState.data.city.hidden ? 'Show' : 'Hide'}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        className="flex items-center gap-2"
        onClick={handleDelete}
      >
        <Icon name="Trash" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  )
}
