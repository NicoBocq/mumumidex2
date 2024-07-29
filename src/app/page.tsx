import React from 'react'
import { getForecast } from '@/actions/forecast'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import ForecastCard, { SkeletonForecastCard } from '@/components/forecast/card'
import SearchCityPopover from '@/components/user/search-city-popover'

function SkeletonForecastList() {
  return (
    <Grid>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonForecastCard key={index} />
      ))}
    </Grid>
  )
}

async function ForecastList() {
  const { data } = await getForecast()

  if (data.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
        <Card className="w-full max-w-sm border-0 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Add your first city</CardTitle>
            <CardDescription>
              You could add more cities by clicking on your picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchCityPopover />
          </CardContent>
        </Card>
      </div>
    )
  }

  const pinnedCities = data?.filter((item) => item.city.pinned)
  const unpinnedCities = data?.filter((item) => !item.city.pinned)

  return (
    <Grid>
      {pinnedCities?.length > 0 && (
        <div className="relative -mx-4 grid gap-4 rounded-lg p-4 ring-2 ring-primary/10 ring-offset-2 ring-offset-amber-100/50">
          {pinnedCities?.map((item) => (
            <ForecastCard key={item.city.id} data={item} />
          ))}
        </div>
      )}
      {unpinnedCities?.map((item) => (
        <ForecastCard key={item.city.id} data={item} />
      ))}
    </Grid>
  )
}

export default async function Page() {
  return (
    <React.Suspense fallback={<SkeletonForecastList />}>
      <ForecastList />
    </React.Suspense>
  )
}
