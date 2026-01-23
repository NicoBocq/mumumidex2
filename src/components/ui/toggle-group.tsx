'use client'

import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const toggleGroupVariants = cva('inline-flex items-center justify-center rounded-lg bg-muted p-1', {
  variants: {
    size: {
      default: 'h-10',
      sm: 'h-9',
      lg: 'h-11',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm',
        outline:
          'border border-input data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        default: 'h-8 px-3',
        sm: 'h-7 px-2.5 text-xs',
        lg: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ToggleGroupContextValue = {
  value: string
  onValueChange: (value: string) => void
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null)

interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants> {
  value: string
  onValueChange: (value: string) => void
  variant?: 'default' | 'outline'
}

function ToggleGroup({
  className,
  value,
  onValueChange,
  variant = 'default',
  size,
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange, variant, size: size ?? 'default' }}>
      <div className={cn(toggleGroupVariants({ size, className }))} {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
}

ToggleGroup.displayName = 'ToggleGroup'

interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleGroupItemVariants> {
  value: string
}

function ToggleGroupItem({
  className,
  value,
  variant,
  size,
  children,
  ...props
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext)
  if (!context) {
    throw new Error('ToggleGroupItem must be used within a ToggleGroup')
  }

  const isActive = context.value === value

  return (
    <button
      type="button"
      aria-pressed={isActive}
      data-state={isActive ? 'on' : 'off'}
      onClick={() => context.onValueChange(value)}
      className={cn(
        toggleGroupItemVariants({
          variant: variant ?? context.variant,
          size: size ?? context.size,
          className,
        })
      )}
      {...props}
    >
      {children}
    </button>
  )
}

ToggleGroupItem.displayName = 'ToggleGroupItem'

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants }
