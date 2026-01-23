'use client'
import { addCity, searchCity } from '@/actions/city'
import type { SearchCity } from '@/types/city'
import { Combobox } from '@base-ui/react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'

export function OnboardingWizard({ reload }: { reload: () => void }) {
  const [step, setStep] = useState<'welcome' | 'search'>('welcome')

  const {
    execute: executeSearch,
    status: searchStatus,
    result: searchResult,
  } = useAction(searchCity)

  const { execute: executeAdd } = useAction(addCity, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      } else if (data?.success) {
        toast.success(data.success)
        reload()
      }
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const handleSearch = useDebouncedCallback((search: string) => {
    executeSearch(search)
  }, 500)

  const handleSelect = (location: SearchCity) => {
    executeAdd(location)
  }

  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/20 dark:border-white/10 sm:p-12">
      {/* Background Ambience */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl filter" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl filter" />

      {step === 'welcome' ? (
        <div className="z-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-orange-400 shadow-lg shadow-primary/30">
            <Icon name="MapPin" className="text-white h-12 w-12" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Mumumidex
            </span>
          </h1>
          <p className="mb-8 max-w-md text-lg text-muted-foreground">
            Discover the real feel of your favorite cities. Track humidex, comfort levels, and
            weather like never before.
          </p>
          <Button
            onClick={() => setStep('search')}
            size="lg"
            className="h-14 min-w-[200px] rounded-full text-lg font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-2xl"
          >
            Get Started
            <Icon name="ArrowRight" className="ml-2" />
          </Button>
        </div>
      ) : (
        <div className="z-10 w-full animate-in slide-in-from-right fade-in duration-500">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight">Add your first city</h2>
              <p className="text-muted-foreground">Search by name (e.g., Paris, Tokyo)</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setStep('welcome')}
              className="rounded-full"
            >
              <Icon name="ArrowLeft" />
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-inner backdrop-blur-md dark:bg-black/40">
              <Combobox.Root
                onInputValueChange={(value) => handleSearch(value || '')}
                onValueChange={(city: SearchCity | null) => {
                  if (city) handleSelect(city)
                }}
                itemToStringLabel={(city: SearchCity | null) => (city ? city.name : '')}
              >
                <div className="relative">
                  <div className="flex items-center border-b border-white/10 px-3">
                    <Icon name="Search" className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                    <Combobox.Input
                      className="flex h-14 w-full bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Type a city name..."
                    />
                  </div>
                </div>
                <Combobox.Portal>
                  <Combobox.Positioner sideOffset={8}>
                    <Combobox.Popup className="w-[var(--anchor-width)] overflow-hidden rounded-b-2xl border-x border-b border-white/20 bg-black/80 shadow-xl backdrop-blur-xl z-50">
                      <Combobox.List className="max-h-[300px] overflow-y-auto p-2">
                        {searchStatus === 'executing' && (
                          <div className="flex w-full items-center justify-between p-4 text-muted-foreground">
                            <span>Searching...</span>
                            <Icon name="Loader" className="animate-spin" />
                          </div>
                        )}
                        {searchResult?.data?.results?.length === 0 &&
                          searchStatus !== 'executing' && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              No cities found.
                            </div>
                          )}
                        {searchResult?.data?.results?.map((city: SearchCity) => (
                          <Combobox.Item
                            key={city.id}
                            value={city}
                            className="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors hover:bg-white/10 aria-selected:bg-primary/20 aria-selected:text-primary outline-none data-[highlighted]:bg-white/10"
                          >
                            <div className="flex flex-col text-left">
                              <span className="font-semibold text-foreground">{city.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {city.country} {city.admin1 ? ` • ${city.admin1}` : ''}
                              </span>
                            </div>
                            <Icon name="Plus" className="h-5 w-5 opacity-50" />
                          </Combobox.Item>
                        ))}
                      </Combobox.List>
                    </Combobox.Popup>
                  </Combobox.Positioner>
                </Combobox.Portal>
              </Combobox.Root>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
