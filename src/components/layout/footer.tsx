'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import Icon from '../custom-ui/icon'
import { Button, buttonVariants } from '../ui/button'

export default function Footer() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <footer className="mt-auto w-full glass">
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
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link
            href="https://github.com/nicobocq"
            target="_blank"
            className={cn(
              buttonVariants({
                variant: 'inline-link',
                size: 'inline-link',
              }),
              'text-xs'
            )}
          >
            <Icon name="Github" margin="right" className="h-3 w-3" />
            nicobocq
          </Link>
        </div>
      </div>
    </footer>
  )
}
