import { cva } from 'class-variance-authority'
import { type LucideProps, icons } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface IconProps extends LucideProps {
  name: keyof typeof icons
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
  const LucideIcon = icons[name] ?? icons.CircleDashed

  return (
    <LucideIcon
      {...props}
      aria-hidden={true}
      className={cn('shrink-0', iconVariants({ size, margin }), className)}
    />
  )
}

export default Icon
