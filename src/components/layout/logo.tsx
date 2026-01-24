import { cn } from '@/lib/utils'
import Link from 'next/link'

type LogoProps = {
  className?: string
  showTagline?: boolean
}

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={cn('group flex items-center gap-2', className)}>
      {/* Icon */}
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-humidex-1 via-humidex-3 to-humidex-5 shadow-md transition-transform group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-white"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-lg font-extrabold leading-none tracking-tight sm:text-xl">
          mumu<span className="text-primary">midex</span>
        </span>
        {showTagline && (
          <span className="text-[10px] text-muted-foreground">Compare cities by feel</span>
        )}
      </div>
    </Link>
  )
}
