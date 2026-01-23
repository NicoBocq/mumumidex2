'use client'

import { deleteCity, updateCity } from '@/actions/city'
import type { CitySchemaType } from '@/validation/city'
import type { City } from '@prisma/client'
import { useOptimisticAction } from 'next-safe-action/hooks'
import React from 'react'
import { toast } from 'sonner'

import { CityCard } from '../city/city-card'

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
    [executeDelete]
  )

  const handleUpdate = React.useCallback(
    ({ id, ...rest }: CitySchemaType) => {
      executeUpdate({ id, ...rest })
    },
    [executeUpdate]
  )

  if (!data.length) return null

  return (
    <div className="w-full">
      <p className="text-sm font-medium leading-none mb-4">Remove or hide cities</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.map((city) => (
          <CityCard key={city.id} city={city} onDelete={handleDelete} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  )
}
