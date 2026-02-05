'use client'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from './theme-toggle'

export default function Footer() {
  return (
    <footer className="mt-auto w-full">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        <p className="text-xxs text-muted-foreground">
          Powered by{' '}
          <Link
            href="https://open-meteo.com/"
            target="_blank"
            className={buttonVariants({
              variant: 'link',
              size: 'xs',
            })}
          >
            Open Meteo
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="https://1h12.com"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: 'link',
                size: 'xs',
              }),
              'text-xs'
            )}
          >
            1h12
          </Link>
        </div>
      </div>
    </footer>
  )
}
