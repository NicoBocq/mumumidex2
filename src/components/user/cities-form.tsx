import React from 'react'
import SearchCityPopover from './search-city-popover'
import UserCitiesSettings from './cities-settings'
import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { getUserCities } from '@/actions/city'
import { Skeleton } from '../ui/skeleton'


export const UserCitiesFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export default async function UserCitiesForm() {
  const session = await auth()

  if (!session) {
    return notFound()
  }
  const { data: cities } = await getUserCities({
    userId: session?.user.id,
    hideHidden: false,
  })

  return (
    <div className="flex flex-col gap-4 text-sm">
      <SearchCityPopover />
      <UserCitiesSettings data={cities || []} />
    </div>
  )
}
