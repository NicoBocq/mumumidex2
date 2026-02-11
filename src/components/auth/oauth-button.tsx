'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth-client'

const handleSignIn = async () => {
  try {
    await signIn.social({ provider: 'google', callbackURL: '/' })
  } catch (_error) {
    toast.error('Failed to sign in')
  }
}

export default function OAuthButton() {
  return (
    <Button onClick={handleSignIn} className="w-full">
      Sign in with Google
    </Button>
  )
}
