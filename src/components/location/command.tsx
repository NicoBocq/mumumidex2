'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { getLocation } from '@/actions/location'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAction } from 'next-safe-action/hooks'
import { useDebouncedCallback } from 'use-debounce'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { DialogHeader, DialogTitle } from '../ui/dialog'
import { Location } from '@/types/location'

export default function LocationCommand() {
  const [open, setOpen] = React.useState(true)
  const router = useRouter()
  const handleOpenChange = () => {
    if (open) {
      setOpen(false)
      router.back()
    }
  }

  const { execute, status, result } = useAction(getLocation)

  const handleSearch = useDebouncedCallback((search: string) => {
    execute(search)
  }, 500)

  const handleSelect = React.useCallback(
    (location: Location) => {
      setOpen(false)
      router.back()
    },
    [router],
  )

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <DialogHeader className="sr-only">
        <DialogTitle>Search for a city, zipcode...</DialogTitle>
        <DialogDescription>Search for a city, zipcode...</DialogDescription>
      </DialogHeader>
      <CommandInput
        placeholder="Search for a city, zipcode..."
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup forceMount heading="Results">
          {result?.data?.results?.map((location: any) => (
            <CommandItem
              key={location.id}
              onSelect={() => handleSelect(location)}
            >
              <span className="sr-only">{location.id}</span> {location.name} (
              {location.country})
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
