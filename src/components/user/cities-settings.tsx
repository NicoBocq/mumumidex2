'use client'

import React from 'react'
import { deleteCity, updateCity } from '@/actions/city'
import { CitySchemaType } from '@/validation/city'
import { City } from '@prisma/client'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import Icon from '../custom-ui/icon'
import { Button } from '../ui/button'

export default function UserCitiesSettings({ data }: { data: City[] }) {
  const { execute: executeDelete } = useOptimisticAction(deleteCity, {
    currentState: { data },
    updateFn: (state, newState) => {
      return {
        data: state.data.filter((city) => city.id !== newState),
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
  })

  const { execute: executeUpdate } = useOptimisticAction(updateCity, {
    currentState: { data },
    updateFn: (state, newState) => {
      return {
        data: {
          ...state.data,
          ...newState,
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
  })

  const handleDelete = React.useCallback(
    (id: string) => {
      executeDelete(id)
    },
    [executeDelete],
  )

  const handleUpdate = React.useCallback(
    ({ id, ...rest }: CitySchemaType) => {
      executeUpdate({ id, ...rest })
    },
    [executeUpdate],
  )

  if (!data.length) return null

  return (
    <div className="w-full">
      <p className="text-sm font-medium leading-none">Remove or hide cities</p>
      <div className="mt-4 divide-y">
        {data.map((city) => (
          <div
            key={city.id}
            className="flex items-center justify-between gap-2 py-2"
          >
            <p
              className={cn(
                'text-sm font-medium leading-none',
                city.hidden ? 'text-muted-foreground' : '',
              )}
            >
              {city.name}
              <br />
              <span className="text-xs text-muted-foreground">
                {city.country}
                {city.admin1 ? ` | ${city.admin1}` : ''}
              </span>
            </p>
            <div className="flex items-center gap-0">
              <Button
                onClick={() =>
                  handleUpdate({ id: city.id, pinned: !city.pinned })
                }
                variant="ghost"
                size="icon"
                title={city.pinned ? `Unpin ${city.name}` : `Pin ${city.name}`}
              >
                <Icon name={city.pinned ? 'PinOff' : 'Pin'} />
              </Button>
              <Button
                onClick={() =>
                  handleUpdate({ id: city.id, hidden: !city.hidden })
                }
                variant="ghost"
                size="icon"
                title={
                  city.hidden ? `Unhide ${city.name}` : `Hide ${city.name}`
                }
              >
                <Icon name={city.hidden ? 'Eye' : 'EyeOff'} />
              </Button>
              <Button
                onClick={() => handleDelete(city.id)}
                variant="ghost-destructive"
                size="icon"
                title={`Delete ${city.name}`}
              >
                <Icon name="Trash2" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
