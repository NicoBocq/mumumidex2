import { cva } from 'class-variance-authority'
import {
  Ban,
  Bookmark,
  Check,
  ChevronDown,
  ChevronsLeft,
  CircleDashed,
  CloudOff,
  Droplets,
  Loader,
  LoaderCircle,
  LogOut,
  type LucideProps,
  MapPin,
  Pin,
  Plus,
  Thermometer,
  Trash2,
  User,
  Wind,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const ICONS = {
  Ban,
  Bookmark,
  Check,
  ChevronDown,
  ChevronsLeft,
  CloudOff,
  Droplets,
  Loader,
  LoaderCircle,
  LogOut,
  MapPin,
  Pin,
  Plus,
  Thermometer,
  Trash2,
  User,
  Wind,
  X,
} as const

export interface IconProps extends LucideProps {
  name: keyof typeof ICONS
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'custom'
  margin?: 'left' | 'right'
}

export const iconVariants = cva('', {
  variants: {
    size: {
      xxs: 'h-2.5 w-2.5',
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
      hero: 'h-10 w-10',
      custom: '',
    },
    margin: {
      left: 'ml-2',
      right: 'mr-2',
      none: '',
    },
  },
  defaultVariants: {
    size: 'xs',
    margin: 'none',
  },
})

const Icon = ({ name, className, size, margin, ...props }: IconProps) => {
  const LucideIcon = ICONS[name] ?? CircleDashed

  return (
    <LucideIcon
      {...props}
      aria-hidden={true}
      className={cn('shrink-0', iconVariants({ size, margin }), className)}
    />
  )
}

export default Icon
