'use client'

import { SearchCity } from '@/types/city'

import React from 'react'
import { useRouter } from 'next/navigation'
import { addCity, searchCity } from '@/actions/city'
import { DialogDescription } from '@radix-ui/react-dialog'
import { CommandLoading } from 'cmdk'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import Icon from '../custom-ui/icon'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverContentNoPortal,
  PopoverTrigger,
} from '../ui/popover'

export default function SearchCityPopover() {
  const [open, setOpen] = React.useState(false)

  const { execute, status, result } = useAction(searchCity)
  const { execute: executeAdd } = useAction(addCity, {
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

  const handleSearch = useDebouncedCallback((search: string) => {
    execute(search)
  }, 500)

  const handleSelect = React.useCallback(
    (location: SearchCity) => {
      executeAdd(location)
      setOpen(false)
    },
    [executeAdd],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full">
          <Icon name="Plus" margin="right" />
          Add city
        </Button>
      </PopoverTrigger>
      <PopoverContentNoPortal className="PopoverContent min-h-60 p-0">
        <Command>
          <CommandInput
            placeholder="Search for a city..."
            onValueChange={handleSearch}
          />
          <CommandList>
            {status === 'executing' && (
              <CommandLoading className="flex w-full items-center justify-center p-4">
                <Icon name="Loader" className="animate-spin" />
              </CommandLoading>
            )}
            <CommandGroup forceMount>
              {result?.data?.results?.map((city: SearchCity) => (
                <CommandItem key={city.id} onSelect={() => handleSelect(city)}>
                  <div className="flex flex-col">
                    <div className="font-semibold">{city.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {city.country} | {city.admin1}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContentNoPortal>
    </Popover>
  )
}
