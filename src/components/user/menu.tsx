import React from 'react'
import Link from 'next/link'
import { Session } from 'next-auth'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import LogoutButton from '@/components/auth/logout-button'
import UserLocationForm from '@/components/user/cities-form'

import { ScrollArea } from '../ui/scroll-area'
import { UserCitiesFormSkeleton } from './cities-form'

export default function UserMenu({ session }: { session: Session }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar>
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {session.user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </SheetTrigger>
      <SheetContent className="flex max-h-[100%] w-[350px] flex-col sm:w-[540px]">
        <SheetHeader className="shrink-0">
          <SheetTitle>Hi, {session.user.name}</SheetTitle>
          <SheetDescription>
            Manage the cities you want to show in your humidex rankings
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <React.Suspense fallback={<UserCitiesFormSkeleton />}>
            <UserLocationForm />
          </React.Suspense>
        </ScrollArea>
        <SheetFooter className="shrink-0">
          <LogoutButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
