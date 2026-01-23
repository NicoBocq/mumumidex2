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

export default function AddCityFab() {
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
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover-scale transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Add city"
        >
          <Icon name="Plus" size="lg" />
        </button>
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
              <CommandItem
                key={city.id}
                onSelect={() => handleSelect(city)}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <div className="font-semibold">{city.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {city.country} {city.admin1 ? ` • ${city.admin1}` : ''}
                  </div>
                </div>
                <Icon name="Plus" className="ml-auto opacity-50" size="sm" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </ResponsiveDrawer>
  )
}
