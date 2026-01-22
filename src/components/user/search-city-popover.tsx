'use client'

import type { SearchCity } from '@/types/city'

import { addCity, searchCity } from '@/actions/city'
import { CommandLoading } from 'cmdk'
import { useAction } from 'next-safe-action/hooks'
import React from 'react'
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
import { ResponsiveDrawer } from '../custom-ui/responsive-drawer'
import { Button } from '../ui/button'

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
    [executeAdd]
  )

  return (
    <ResponsiveDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="w-full">
          <Icon name="Plus" margin="right" />
          Add city
        </Button>
      }
    >
      <Command>
        <CommandInput placeholder="Search for a city..." onValueChange={handleSearch} />
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
    </ResponsiveDrawer>
  )
}
