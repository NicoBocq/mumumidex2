'use client'

import { signOut } from 'next-auth/react'

import Icon from '@/components/custom-ui/icon'

import { Button } from '../ui/button'

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="w-full"
      variant="outlinePrimary"
    >
      {/* <Icon name="LogOut" margin="right" /> */}
      Log out
    </Button>
  )
}
