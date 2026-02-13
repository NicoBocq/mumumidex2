import { Suspense } from 'react'
import { Skeleton } from '../ui/skeleton'
import UserMenu from '../user/menu'
import { HeaderMetricSelector } from './header-metric-selector'
import { Logo } from './logo'

function HeaderMetricSelectorFallback() {
  return <Skeleton className="h-10 w-28 rounded-full" aria-hidden />
}

function UserMenuFallback() {
  return <Skeleton className="h-10 w-10 rounded-full" aria-hidden />
}

export default function Header() {
  return (
    <header className="w-full">
      <nav aria-label="Global" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Logo className="shrink-0" showTagline />

          {/* Right section: User */}
          <div className="flex shrink-0 items-center gap-2 overflow-visible">
            <Suspense fallback={<HeaderMetricSelectorFallback />}>
              <HeaderMetricSelector />
            </Suspense>
            <Suspense fallback={<UserMenuFallback />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </nav>
    </header>
  )
}
