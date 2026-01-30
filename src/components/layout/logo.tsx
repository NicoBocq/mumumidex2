import { cn } from '@/lib/utils'
import Link from 'next/link'

type LogoProps = {
  className?: string
  showTagline?: boolean
}

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={cn('group flex items-center', className)}>
      <div className="flex flex-col">
        <span className="text-2xl font-black leading-none tracking-tight transition-opacity group-hover:opacity-70 sm:text-3xl">
          mm.dex<span className="text-muted-foreground">°</span>
        </span>
        {showTagline && (
          <span className="text-[10px] text-muted-foreground">Compare cities by feel</span>
        )}
      </div>
    </Link>
  )
}
