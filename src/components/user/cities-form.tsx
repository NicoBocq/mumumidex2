import React from 'react'
import { getUserCities } from '@/actions/city'
import { auth } from '@/auth'

import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import UserCitiesSettings from './cities-settings'
import SearchCityPopover from './search-city-popover'

export const UserCitiesFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export default async function UserCitiesForm() {
  const session = await auth()

  if (!session) {
    return null
  }
  const { data: cities } = await getUserCities({
    userId: session?.user.id,
    hideHidden: false,
  })

  return (
    <div className="flex flex-col gap-4 text-sm">
      <SearchCityPopover />
      <Separator />
      <UserCitiesSettings data={cities || []} />
    </div>
  )
}
