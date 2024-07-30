'use client'

import { Forecast } from '@/types/forecast'

import React from 'react'
import { deleteCity, updateCity } from '@/actions/city'
import html2canvas from 'html2canvas'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { getHumidexClass } from '@/lib/humidex'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import Icon from '@/components/custom-ui/icon'

import { Button } from '../ui/button'
import { CardFooter } from '../ui/card'
import ForecastCard from './card'

type CardActionsProps = {
  data: Forecast
}

const copyImageToClipboard = async (data: Forecast) => {
  const exportCard = document.querySelector(
    `#export-card-${data.city.id}`,
  ) as HTMLElement
  if (!exportCard) {
    toast.error('Export card not found')
    return
  }

  try {
    const scale = window.devicePixelRatio || 1
    const canvas = await html2canvas(exportCard, { scale })

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve),
    )
    if (!blob) {
      toast.error('Failed to create image')
      return
    }

    // if (navigator.clipboard) {
    //   try {
    //     const item = new ClipboardItem({ 'image/png': blob })
    //     await navigator.clipboard.write([item])
    //     toast.success('Image copied to clipboard')
    //     return
    //   } catch (err) {
    //     console.error('Clipboard error:', err)
    //     toast.error(JSON.stringify(err))
    //   }
    // }

    const file = new File(
      [blob],
      `${data.city.name}-${data.current.time}.png`,
      { type: 'image/png' },
    )

    // if (navigator.share) {
    //   try {
    //     await navigator.share({
    //       files: [file],
    //       title: `MumuMidex: ${data.city.name}`,
    //     })
    //     toast.success('Image shared successfully')
    //   } catch (err) {
    //     console.error('Share error:', err)
    //     toast.error('Failed to share image')
    //   }
    // } else {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Image downloaded')
  //   }
  } catch (err) {
    console.error('Image creation error:', err)
    toast.error('Failed to create image')
  }
}

export default function CardActions({ data }: CardActionsProps) {
  const [open, setOpen] = React.useState(false)
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

  const handleUpdate = React.useCallback(
    (context: 'pinned' | 'hidden') => {
      execUpdateCity({
        id: data.city.id,
        [context]: !data.city[context],
      })
    },
    [execUpdateCity, data.city],
  )

  const handleDelete = React.useCallback(() => {
    execDeleteCity(data.city.id)
  }, [execDeleteCity, data.city.id])

  const handleDownload = React.useCallback(() => {
    copyImageToClipboard(data)
  }, [data])

  return (
    <div className="relative">
      <ForecastCard
        data={data}
        showCardActions={false}
        id={`export-card-${data.city.id}`}
        forceMobile
        className="absolute left-[-9999px] top-[-9999px] w-[400px]"
      />
      <Collapsible
        id={`card-actions-${data.city.id}`}
        onOpenChange={setOpen}
        className={cn('rounded-b-lg', getHumidexClass(data.current.humidex))}
      >
        <CollapsibleTrigger
          className={cn('flex w-full items-center justify-end px-4 py-2')}
        >
          <Icon name={open ? 'ChevronUp' : 'ChevronDown'} />
        </CollapsibleTrigger>
        <CollapsibleContent className="rounded-b-lg">
          <CardFooter className="flex items-center justify-between gap-2 p-2">
            <div className="flex items-center gap-2">
              <Button
                className="flex items-center gap-2"
                onClick={handleDelete}
                variant="ghostTransparent"
                title="Delete"
                size="icon"
              >
                <Icon name="Trash" />
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => handleUpdate('hidden')}
                title="Hide"
                variant="ghostTransparent"
                size="icon"
              >
                <Icon
                  name={optimisticState.data.city.hidden ? 'EyeOff' : 'Eye'}
                />
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => handleUpdate('pinned')}
                title={optimisticState.data.city.pinned ? 'Unpin' : 'Pin'}
                variant="ghostTransparent"
                size="icon"
              >
                <Icon
                  name={optimisticState.data.city.pinned ? 'PinOff' : 'Pin'}
                />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghostTransparent"
                size="icon"
                title="Download"
                onClick={handleDownload}
              >
                <Icon name="ImageDown" />
              </Button>
            </div>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
