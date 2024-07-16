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

import Icon from '../custom-ui/icon'
import { Button } from '../ui/button'
import { DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'

export default function LocationCommand() {
  const [open, setOpen] = React.useState(true)
  const router = useRouter()
  const handleOpenChange = () => {
    if (open) {
      setOpen(false)
      router.back()
    }
  }
  const [search, setSearch] = React.useState('')

  const { execute, status, result } = useAction(getLocation)

  React.useEffect(() => {
    if (!search || search.length <= 3) return
    execute(search)
  }, [execute, search])

  const handleSearch = useDebouncedCallback((search: string) => {
    setSearch(search)
  }, 500)

  const handleSelect = React.useCallback(
    (location: any) => {
      console.log('clicked', location)
      setOpen(false)
      router.back()
    },
    [router],
  )

  console.log(result?.data?.results)

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
        {/* <CommandEmpty>No results found.</CommandEmpty> */}
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
