import Link from 'next/link'
import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { getServerSession } from '@/lib/server-session'
import UserMenuClient from './menu-client'

export default async function UserMenu() {
  const session = await getServerSession()

  if (!session) {
    return (
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
    )
  }

  return <UserMenuClient session={session} />
}
