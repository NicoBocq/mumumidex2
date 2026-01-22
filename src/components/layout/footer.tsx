import Link from 'next/link'

import { cn } from '@/lib/utils'
import Icon from '../custom-ui/icon'
import { buttonVariants } from '../ui/button'

export default function Footer() {
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
    </footer>
  )
}
