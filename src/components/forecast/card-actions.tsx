'use client'

import type { Forecast } from '@/types/forecast'

import { updateCity } from '@/actions/city'
import html2canvas from 'html2canvas'
import { useOptimisticAction } from 'next-safe-action/hooks'
import React from 'react'
import { toast } from 'sonner'

import Icon from '@/components/custom-ui/icon'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { getMiseryClass, getMiseryEmoji } from '@/lib/misery-index'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import { CardFooter } from '../ui/card'
import ExportableCard from './card'

type CardActionsProps = {
  data: Forecast
}

const exportImage = async (data: Forecast) => {
  const exportCard = document.querySelector(`#export-card-${data.city.id}`) as HTMLElement
  if (!exportCard) {
    toast.error('Export card not found')
    return
  }

  try {
    const scale = window.devicePixelRatio || 1
    const canvas = await html2canvas(exportCard, { scale })

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve))
    if (!blob) {
      toast.error('Failed to create image')
      return
    }

    const file = new File([blob], `${data.city.name}-${data.current.time}.jpeg`, {
      type: 'image/jpeg',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Image downloaded')
  } catch (err) {
    console.error('Image creation error:', err)
    toast.error('Failed to create image')
  }
}

export default function CardActions({ data }: CardActionsProps) {
  const [open, setOpen] = React.useState(false)
  const { execute: execUpdateCity, optimisticState } = useOptimisticAction(updateCity, {
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
  })

  const handleUpdate = React.useCallback(
    (context: 'pinned' | 'hidden') => {
      execUpdateCity({
        id: data.city.id,
        [context]: !data.city[context],
      })
    },
    [execUpdateCity, data.city]
  )

  const handleDownload = React.useCallback(() => {
    exportImage(data)
  }, [data])

  const handleShare = React.useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Météo de l'enfer à ${data.city.name}`,
          text: `Le Misery Index est de ${data.current.miseryIndex} ! ${getMiseryEmoji(data.current.miseryIndex)}`,
          url: window.location.href,
        })
        toast.success('Shared successfully')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      handleDownload()
    }
  }, [data, handleDownload])

  return (
    <div className="relative">
      <ExportableCard
        data={data}
        showCardActions={false}
        id={`export-card-${data.city.id}`}
        isExport
      />
      <Collapsible
        id={`card-actions-${data.city.id}`}
        onOpenChange={setOpen}
        className={cn('rounded-b-lg', getMiseryClass(data.current.miseryIndex))}
      >
        <CollapsibleTrigger className={cn('flex w-full items-center justify-end px-4 py-2')}>
          <Icon
            name="ChevronDown"
            className="transition-transform duration-150 ease-in-out"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-b-lg">
          <CardFooter className="flex items-center justify-end gap-2 p-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => handleUpdate('pinned')}
              title={optimisticState.data.city.pinned ? 'Unpin' : 'Pin'}
              variant="ghostTransparent"
              size="sm"
            >
              {optimisticState.data.city.pinned ? 'Unpin' : 'Pin'}
              <Icon name="Pin" />
            </Button>
            <Button
              variant="ghostTransparent"
              size="sm"
              title="Share"
              onClick={handleShare}
              className="gap-2"
            >
              Share <Icon name="Share" />
            </Button>
            <Button
              variant="ghostTransparent"
              size="sm"
              title="Download"
              onClick={handleDownload}
              className="gap-2"
            >
              <Icon name="ImageDown" />
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
