import React from 'react'
import { redirect } from 'next/navigation'
import { getForecast } from '@/actions/forecast'
import { getUser } from '@/actions/user'
import { auth } from '@/auth'

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

  if (data.length === 0) {
    redirect('/user/cities')
  }

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
