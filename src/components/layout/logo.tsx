import { Outfit } from 'next/font/google'
import Link from 'next/link'
import { app } from '@/config/app'
import { cn } from '@/lib/utils'

const outfit = Outfit({ subsets: ['latin'] })

type LogoProps = {
  className?: string
  showTagline?: boolean
}

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={cn('group flex items-center', className)}>
      <div className="flex flex-col">
        <span
          className={cn(
            'text-2xl font-black leading-none tracking-tight transition-opacity group-hover:opacity-70 sm:text-3xl',
            outfit.className
          )}
        >
          mm<span className="text-humidex-3">°</span>
          <span className="bg-gradient-to-r from-humidex-3 to-humidex-4 bg-clip-text text-transparent">
            dex
          </span>
        </span>
        {showTagline && <span className="text-xs text-muted-foreground">{app.tagline}</span>}
      </div>
    </Link>
  )
}
