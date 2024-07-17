'use client'

import { signOut } from 'next-auth/react'

import Icon from '@/components/custom-ui/icon'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex w-full items-center text-left"
    >
      <Icon name="LogOut" margin="right" />
      Log out
    </button>
  )
}
