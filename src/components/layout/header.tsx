import Link from 'next/link'
import { auth } from '@/auth'
import { Button } from '../ui/button'
import UserMenu from '../user/menu'

export default async function Header() {
  const session = await auth()
  return (
    <div className="flex h-[64px] items-center justify-between gap-4">
      <Link href="/">
        <h1 className="inline-flex items-center text-3xl font-extrabold">
          mumu
          <span className="text-primary">midex</span>
        </h1>
      </Link>
      <div>
        {!session ? (
          <Link href="/login">
            <Button variant="outlinePrimary">Get Started</Button>
          </Link>
        ) : (
          <UserMenu session={session} />
        )}
      </div>
    </div>
  )
}
