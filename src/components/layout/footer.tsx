'use client'

import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '../ui/button'

export default function Footer() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <footer className="mt-auto w-full">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        <p className="text-xs text-muted-foreground">
          Powered by{' '}
          <Link
            href="https://open-meteo.com/"
            target="_blank"
            className={buttonVariants({
              variant: 'inline-link',
              size: 'inline-link',
            })}
          >
            Open Meteo
          </Link>
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8 p-0"
          >
            {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link
            href="https://1h12.com"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: 'inline-link',
                size: 'inline-link',
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
