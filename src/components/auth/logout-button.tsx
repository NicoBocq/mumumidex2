'use client'

import { signOut } from '@/lib/auth-client'
import { Button } from '../ui/button'

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut()} className="w-full" variant="outlinePrimary">
      Log out
    </Button>
  )
}
