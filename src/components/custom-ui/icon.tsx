import { cva } from 'class-variance-authority'
import { icons, LucideProps } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface IconProps extends LucideProps {
  name: keyof typeof icons
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'custom'
  margin?: 'left' | 'right'
}

export const iconVariants = cva('', {
  variants: {
    size: {
      xxs: 'h-3 w-3',
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
      hero: 'h-12 w-12',
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
