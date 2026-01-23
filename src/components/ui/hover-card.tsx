'use client'

import { Tooltip as BaseTooltip } from '@base-ui/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const HoverCard = BaseTooltip.Root

const HoverCardTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Trigger> & {
    asChild?: boolean
  }
>(({ asChild, children, ...props }, ref) => (
  <BaseTooltip.Trigger
    ref={ref}
    {...props}
    render={asChild ? (children as React.ReactElement) : undefined}
  >
    {!asChild && children}
  </BaseTooltip.Trigger>
))
HoverCardTrigger.displayName = 'HoverCardTrigger'

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> &
    React.ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>
>(({ className, align = 'center', side = 'bottom', sideOffset = 4, ...props }, ref) => (
  <BaseTooltip.Portal>
    <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
      <BaseTooltip.Popup
        ref={ref}
        className={cn(
          'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      />
    </BaseTooltip.Positioner>
  </BaseTooltip.Portal>
))
HoverCardContent.displayName = 'HoverCardContent'

export { HoverCard, HoverCardTrigger, HoverCardContent }
