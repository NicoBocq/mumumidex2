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
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import Icon from '../custom-ui/icon'

export default function AddCityFab() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const { execute, status, result } = useAction(searchCity)
  const { execute: executeAdd, status: addStatus } = useAction(addCity, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
        setOpen(false)
        setQuery('')
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const handleSearch = useDebouncedCallback((search: string) => {
    setQuery(search)
    if (search.length >= 2) {
      execute(search)
    }
  }, 300)

  const handleSelect = React.useCallback(
    (location: SearchCity) => {
      executeAdd(location)
    },
    [executeAdd]
  )

  const isSearching = status === 'executing'
  const isAdding = addStatus === 'executing'
  const hasResults = result?.data?.results && result.data.results.length > 0
  const showEmpty = query.length >= 2 && !isSearching && !hasResults

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-humidex-4 text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          aria-label="Ajouter une ville"
        >
          <Icon name="Plus" size="lg" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="mx-auto max-w-lg">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Icon name="MapPin" size="sm" className="text-primary" />
            </div>
            Ajouter une ville
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-8">
          <Command className="rounded-lg border shadow-sm" shouldFilter={false}>
            <CommandInput
              placeholder="Rechercher une ville..."
              onValueChange={handleSearch}
              className="h-12"
            />
            <CommandList className="max-h-[300px]">
              {isSearching && (
                <CommandLoading className="flex w-full items-center justify-center gap-2 p-6 text-muted-foreground">
                  <Icon name="Loader" className="animate-spin" size="sm" />
                  <span>Recherche...</span>
                </CommandLoading>
              )}

              {showEmpty && (
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                  <Icon name="SearchX" className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  Aucune ville trouvée
                </CommandEmpty>
              )}

              {!isSearching && hasResults && (
                <CommandGroup>
                  {result.data.results.map((city: SearchCity) => (
                    <CommandItem
                      key={city.id}
                      onSelect={() => handleSelect(city)}
                      disabled={isAdding}
                      className="cursor-pointer gap-3 p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <span className="text-lg">{getFlagEmoji(city.country_code)}</span>
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{city.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {city.admin1 ? `${city.admin1}, ` : ''}
                          {city.country}
                        </span>
                      </div>
                      <Icon
                        name={isAdding ? 'Loader' : 'Plus'}
                        className={isAdding ? 'animate-spin text-muted-foreground' : 'text-primary'}
                        size="sm"
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {query.length < 2 && !isSearching && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  <Icon name="Search" className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  <p>Tapez au moins 2 caractères</p>
                </div>
              )}
            </CommandList>
          </Command>
        </div>
      </DrawerContent>
    </Drawer>
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
