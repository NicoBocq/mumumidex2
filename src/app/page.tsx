import React from 'react'
import { getForecast } from '@/actions/forecast'

import Grid from '@/components/custom-ui/grid'
import ForecastCard, { SkeletonForecastCard } from '@/components/forecast/card'

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

  return (
    <Grid>
      {data?.map((item) => <ForecastCard key={item.location.id} data={item} />)}
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
