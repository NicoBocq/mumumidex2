import Link from 'next/link'
import { auth } from '@/auth'

import { Button, buttonVariants } from '../ui/button'
import UserMenu from '../user/menu'

export default async function Header() {
  const session = await auth()
  return (
    <header>
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div>
          <Link href="/">
            <h1 className="inline-flex items-center text-3xl font-extrabold">
              mumu
              <span className="text-primary">midex</span>
            </h1>
          </Link>
          <p className="text-sm text-primary/70">
            Your cities ranked by{' '}
            <Link
              href="https://en.wikipedia.org/wiki/Humidex"
              target="_blank"
              className={buttonVariants({ variant: 'link' })}
            >
              humidex
            </Link>
          </p>
        </div>
        <div>
          {!session ? (
            <Link href="/login">
              <Button variant="outlinePrimary">Get Started</Button>
            </Link>
          ) : (
            <UserMenu session={session} />
          )}
        </div>
      </nav>
    </header>
  )
}
