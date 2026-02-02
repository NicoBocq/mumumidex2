'use client'

import { Separator as BaseSeparator } from '@base-ui/react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSeparator> & {
    decorative?: boolean
  }
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <BaseSeparator
    ref={ref}
    orientation={orientation}
    role={decorative ? 'none' : 'separator'}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'

export { Separator }
