'use client'

import { useAction } from 'next-safe-action/hooks'
import React from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { addCity, searchCity } from '@/actions/city'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { SearchCity } from '@/types/city'

import Icon from '../custom-ui/icon'

export default function AddCityCard() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [addingCityId, setAddingCityId] = React.useState<number | null>(null)

  const { execute, status, result, reset } = useAction(searchCity)
  const { execute: executeAdd } = useAction(addCity, {
    onSuccess: ({ data }) => {
      setAddingCityId(null)
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
        setQuery('')
        reset()
      }
    },
    onError: () => {
      setAddingCityId(null)
      toast.error('Something went wrong')
    },
  })

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setQuery('')
      reset()
    }
  }

  const handleSearch = useDebouncedCallback((search: string) => {
    if (search.length >= 2) {
      execute(search)
    }
  }, 300)

  const handleSelect = React.useCallback(
    (location: SearchCity) => {
      setAddingCityId(location.id)
      executeAdd(location)
    },
    [executeAdd]
  )

  const isSearching = status === 'executing'
  const hasResults = result?.data?.results && result.data.results.length > 0
  const showEmpty = query.length >= 2 && !isSearching && !hasResults

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className="glass w-full group h-auto flex-1 gap-2 rounded-xl px-4 py-3 hover:bg-white/20 active:scale-[0.98]"
      >
        <Icon
          name="Plus"
          size="sm"
          className="text-foreground/70 transition-colors group-hover:text-foreground"
        />
        <span className="text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
          Add a city
        </span>
      </Button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div className="visiting:hidden hidden">
          <DialogTitle>Add a city</DialogTitle>
          <DialogDescription>Search for a city to add to your dashboard</DialogDescription>
        </div>
        <CommandInput
          placeholder="Search for a city..."
          value={query}
          onValueChange={(value) => {
            setQuery(value)
            handleSearch(value)
          }}
        />
        <CommandList className="min-h-[300px]">
          {isSearching && (
            <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
              <Icon name="Loader" className="animate-spin" size="sm" />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {showEmpty && <CommandEmpty>No city found</CommandEmpty>}

          {!isSearching &&
            hasResults &&
            result.data.results.map((city: SearchCity) => {
              const isAddingThis = addingCityId === city.id
              return (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => handleSelect(city)}
                  disabled={addingCityId !== null}
                  className={cn(
                    'aria-selected:bg-accent flex items-center gap-3 p-3 transition-colors',
                    addingCityId !== null && !isAddingThis && 'opacity-50'
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <span className="text-base">{getFlagEmoji(city.country_code)}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{city.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {city.admin1 ? `${city.admin1}, ` : ''}
                      {city.country}
                    </span>
                  </div>
                  <Icon
                    name={isAddingThis ? 'Loader' : 'Plus'}
                    className={cn(
                      'shrink-0',
                      isAddingThis ? 'animate-spin text-muted-foreground' : 'text-primary'
                    )}
                    size="sm"
                  />
                </CommandItem>
              )
            })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
