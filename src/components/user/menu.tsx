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
import LogoutButton from '@/components/auth/logout-button'

import Icon from '../custom-ui/icon'

export default function UserMenu({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {session.user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuItem asChild>
          <Link
            href="/user/cities"
            className="flex items-center gap-2"
            scroll={false}
          >
            <Icon name="MapPin" />
            Cities
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Icon name="Hammer" margin="right" />
          To do
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
