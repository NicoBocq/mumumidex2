'use client'

import type { SearchCity } from '@/types/city'

import { addCity, searchCity } from '@/actions/city'
import { cn } from '@/lib/utils'
import { useAction } from 'next-safe-action/hooks'
import React from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import Icon from '../custom-ui/icon'

export default function AddCityCard() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [addingCityId, setAddingCityId] = React.useState<number | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const { execute, status, result, reset } = useAction(searchCity)
  const { execute: executeAdd } = useAction(addCity, {
    onSuccess: ({ data }) => {
      setAddingCityId(null)
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
        setOpen(false)
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
    } else {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSearch = useDebouncedCallback((search: string) => {
    if (search.length >= 2) {
      execute(search)
    }
  }, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
  }

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
  const showHint = query.length < 2 && !isSearching

  return (
    <div className="flex items-stretch gap-2">
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className="glass group flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
          >
            <Icon
              name="Plus"
              size="sm"
              className="text-foreground/70 transition-colors group-hover:text-foreground"
            />
            <span className="text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
              Add a city
            </span>
          </button>
        </DrawerTrigger>

        <DrawerContent className="mx-auto max-w-lg">
          <DrawerHeader className="text-left">
            <DrawerTitle>Add a city</DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-8">
            {/* Search input */}
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for a city..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    reset()
                  }}
                  className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon name="X" size="xs" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="mt-3 max-h-[300px] overflow-y-auto">
              {isSearching && (
                <div className="flex items-center justify-center gap-2 p-6 text-muted-foreground">
                  <Icon name="Loader" className="animate-spin" size="sm" />
                  <span className="text-sm">Searching...</span>
                </div>
              )}

              {showEmpty && (
                <div className="p-6 text-center text-sm text-muted-foreground">No city found</div>
              )}

              {showHint && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Type at least 2 characters
                </div>
              )}

              {!isSearching && hasResults && (
                <div className="divide-y divide-border/50 rounded-lg border">
                  {result.data.results.map((city: SearchCity) => {
                    const isAddingThis = addingCityId === city.id
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleSelect(city)}
                        disabled={addingCityId !== null}
                        className={cn(
                          'flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50',
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
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      {/* Spacer to match card action buttons width on hover */}
      <div className="hidden w-0 md:block" />
    </div>
  )
}

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
