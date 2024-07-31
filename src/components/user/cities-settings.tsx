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
import { Toggle } from '../ui/toggle'

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
            className="flex items-center justify-between gap-4 py-2"
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
            <div className="flex items-center gap-2">
              <Toggle
                aria-label="Toggle pinned"
                pressed={city.pinned}
                title={city.pinned ? 'Unpin' : 'Pin'}
                onPressedChange={(pressed) =>
                  handleUpdate({ id: city.id, pinned: pressed })
                }
              >
                <Icon name="Pin" />
              </Toggle>
              <Toggle
                aria-label="Toggle hidden"
                pressed={city.hidden}
                title={city.hidden ? 'Unhide' : 'Hide'}
                onPressedChange={(pressed) =>
                  handleUpdate({
                    id: city.id,
                    hidden: pressed,
                    ...(pressed ? { pinned: false } : {}),
                  })
                }
              >
                <Icon name="EyeOff" />
              </Toggle>
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
