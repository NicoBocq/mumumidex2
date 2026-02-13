'use client'

import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { deleteCity, updateCity } from '@/actions/city'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ForecastCardActionsProps = {
  cityId: string
  pinned: boolean
  onPinnedChange: (nextPinned: boolean) => void
  onDeleted: () => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export default function ForecastCardActions({
  cityId,
  pinned,
  onPinnedChange,
  onDeleted,
  orientation = 'horizontal',
  className,
}: ForecastCardActionsProps) {
  const router = useRouter()

  const { execute: executeUpdate, status: updateStatus } = useAction(updateCity, {
    onSuccess: ({ data }) => {
      if (data?.error) return
      onPinnedChange(!pinned)
      router.refresh()
    },
  })

  const { execute: executeDelete, status: deleteStatus } = useAction(deleteCity, {
    onSuccess: ({ data }) => {
      if (data?.error) return
      onDeleted()
      router.refresh()
    },
  })

  const isUpdating = updateStatus === 'executing'
  const isDeleting = deleteStatus === 'executing'
  const isDisabled = isUpdating || isDeleting

  return (
    <div
      className={cn(
        'rounded-full p-1 shadow-sm backdrop-blur',
        orientation === 'vertical' ? 'flex flex-col items-center gap-1' : 'flex items-center gap-1',
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-full hover:bg-muted',
          isDisabled && 'pointer-events-none opacity-60'
        )}
        onClick={(e) => {
          e.stopPropagation()
          executeUpdate({ id: cityId, pinned: !pinned })
        }}
        aria-label={pinned ? 'Unpin' : 'Pin'}
      >
        <Icon name="Bookmark" size="sm" className={cn(pinned && 'fill-current')} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'h-8 w-8 rounded-full text-destructive hover:bg-destructive/10',
          isDisabled && 'pointer-events-none opacity-60'
        )}
        onClick={(e) => {
          e.stopPropagation()
          executeDelete(cityId)
        }}
        aria-label="Delete"
      >
        <Icon name="Trash2" size="sm" />
      </Button>
    </div>
  )
}
