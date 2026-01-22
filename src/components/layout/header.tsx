import { auth } from '@/auth'
import Link from 'next/link'

import { Button, buttonVariants } from '../ui/button'
import UserMenu from '../user/menu'
import { ThemeToggle } from './theme-toggle'

export default async function Header() {
  const session = await auth()
  return (
    <header className="w-full">
      <nav
        aria-label="Global"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        <div>
          <Link href="/">
            <h1 className="inline-flex items-center text-2xl font-extrabold hover-scale hover:text-primary">
              mumu
              <span className="text-primary">midex</span>
            </h1>
          </Link>
          <p className="hidden text-xs text-primary/70 sm:block">
            Your cities ranked by{' '}
            <Link
              href="https://en.wikipedia.org/wiki/Humidex"
              target="_blank"
              className={buttonVariants({
                variant: 'inline-link',
                size: 'inline-link',
              })}
            >
              Humidex
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
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
