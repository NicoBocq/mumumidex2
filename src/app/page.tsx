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

  return (
    <Grid>
      {data?.map((item) => <ForecastCard key={item.location.id} data={item} />)}
    </Grid>
  )
}

export const revalidate = 60 * 15

export default async function Page() {
  return (
    <React.Suspense fallback={<SkeletonForecastList />}>
      <ForecastList />
    </React.Suspense>
  )
}
