'use client'

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useMediaQuery } from '@/hooks/use-media-query'

interface ResponsiveDrawerProps {
  children: React.ReactNode
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResponsiveDrawer({ children, trigger, open, onOpenChange }: ResponsiveDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent className="w-80 p-0">{children}</PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
