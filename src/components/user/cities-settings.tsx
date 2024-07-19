'use client'

import React from 'react'
import { deleteCity, updateCityVisibility } from '@/actions/city'
import { City } from '@prisma/client'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import Icon from '../custom-ui/icon'
import { Button } from '../ui/button'

export default function UserCitiesSettings({ data }: { data: City[] }) {
  const { execute: executeDelete, status } = useAction(deleteCity, {
    onSuccess: ({ data }) => {
      console.log(data)
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        console.log(data?.success)
        toast.success(data.success)
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const { execute: executeUpdate, status: statusUpdate } = useAction(
    updateCityVisibility,
    {
      onSuccess: ({ data }) => {
        console.log(data)
        if (data?.error) {
          toast.error(data.error)
        } else if (data?.success) {
          console.log(data?.success)
          toast.success(data.success)
        }
      },
      onError: () => {
        toast.error('Something went wrong')
      },
    },
  )
  const [actionId, setActionId] = React.useState<string | null>(null)

  const handleDelete = React.useCallback(
    (id: string) => {
      setActionId(id)
      executeDelete(id)
    },
    [executeDelete],
  )

  const handleUpdate = React.useCallback(
    ({ id, hidden }: { id: string; hidden: boolean }) => {
      setActionId(id)
      executeUpdate({ id, hidden })
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
                  handleUpdate({ id: city.id, hidden: !city.hidden })
                }
                variant="ghost"
                size="icon"
                title={
                  city.hidden ? `Unhide ${city.name}` : `Hide ${city.name}`
                }
                disabled={statusUpdate === 'executing' && actionId === city.id}
              >
                {actionId === city.id && statusUpdate === 'executing' ? (
                  <Icon name="Loader" className="animate-spin" />
                ) : (
                  <Icon name={city.hidden ? 'EyeOff' : 'Eye'} />
                )}
              </Button>
              <Button
                onClick={() => handleDelete(city.id)}
                variant="ghost"
                size="icon"
                title={`Delete ${city.name}`}
                disabled={status === 'executing' && actionId === city.id}
              >
                {actionId === city.id && status === 'executing' ? (
                  <Icon name="Loader" className="animate-spin" />
                ) : (
                  <Icon name="Trash" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
