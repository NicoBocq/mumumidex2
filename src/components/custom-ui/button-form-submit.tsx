'use client'

import { VariantProps } from 'class-variance-authority'
import { useFormStatus } from 'react-dom'

import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '../ui/button'
import Icon, { type IconProps } from './icon'

interface FormSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string
  loading?: boolean
  icon?: IconProps['name']
}

export function ButtonFormSubmit({
  label,
  id,
  disabled,
  icon,
  loading,
  className,
  ...props
}: FormSubmitProps) {
  const { pending } = useFormStatus()

  const isLoading = loading || pending

  return (
    <Button
      disabled={disabled || isLoading}
      {...props}
      id={id}
      className={cn('relative', className)}
      type="submit"
    >
      {icon && (
        <Icon
          name={icon}
          className={cn(
            'mr-2',
            isLoading ? 'opacity-0' : 'opacity-100',
            'transition-opacity duration-100',
          )}
        />
      )}
      {label && (
        <span
          className={cn(
            isLoading ? 'opacity-0' : 'opacity-100',
            'transition-opacity duration-100',
          )}
        >
          {label}
        </span>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            name="LoaderCircle"
            className="animate-spin"
            aria-hidden="true"
          />
        </div>
      )}
      <span className="sr-only">{isLoading ? 'Submiting' : 'Submit'}</span>
    </Button>
  )
}
