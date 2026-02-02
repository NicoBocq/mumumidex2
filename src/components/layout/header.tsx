import { headers } from 'next/headers'
import Link from 'next/link'
import { auth } from '@/lib/auth'

import Icon from '../custom-ui/icon'
import { Button } from '../ui/button'
import UserMenu from '../user/menu'
import { HeaderMetricSelector } from './header-metric-selector'
import { Logo } from './logo'

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <header className="w-full">
      <nav aria-label="Global" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Logo className="shrink-0" showTagline />

          {/* Right section: Metric selector + User */}
          <div className="flex shrink-0 items-center gap-2 overflow-visible">
            <HeaderMetricSelector />
            {!session ? (
              <Link href="/login">
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 rounded-full transition-transform active:scale-[0.98]"
                  aria-label="Sign in"
                >
                  <Icon name="User" size="sm" />
                </Button>
              </Link>
            ) : (
              <UserMenu session={session} />
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
