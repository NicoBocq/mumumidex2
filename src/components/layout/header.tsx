import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

import { Button } from '../ui/button'
import UserMenu from '../user/menu'
import { HeaderMetricSelector } from './header-metric-selector'
import { ThemeToggle } from './theme-toggle'

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() })
  return (
    <header className="w-full">
      <nav
        aria-label="Global"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8"
      >
        <div className="shrink-0">
          <Link href="/">
            <h1 className="inline-flex items-center text-2xl font-extrabold hover-scale hover:text-primary">
              mumu
              <span className="text-primary">midex</span>
            </h1>
          </Link>
        </div>

        <div className="hidden sm:flex flex-1 justify-center">
          <HeaderMetricSelector />
        </div>

        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <HeaderMetricSelector />
          </div>
          <ThemeToggle />
          {!session ? (
            <Link href="/login">
              <Button variant="outlinePrimary" size="sm" className="hover-scale">
                Get Started
              </Button>
            </Link>
          ) : (
            <UserMenu session={session} />
          )}
        </div>
      </nav>
    </header>
  )
}
