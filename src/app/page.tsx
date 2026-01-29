import { getForecast } from '@/actions/forecast'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'

import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import Section from '@/components/custom-ui/section'
import { SkeletonForecastCard } from '@/components/forecast/card'
import ForecastListClient from '@/components/forecast/forecast-list'

function SkeletonForecastList() {
  return (
    <Grid>
      {['s1', 's2', 's3', 's4', 's5'].map((id) => (
        <SkeletonForecastCard key={id} />
      ))}
    </Grid>
  )
}

async function ForecastList() {
  const { data, error } = await getForecast()
  const session = await auth.api.getSession({ headers: await headers() })

  if (error) {
    return (
      <Section withoutCard className="text-muted-foreground">
        <Icon name="Frown" size="xl" />
        <p>Sad noise</p>
      </Section>
    )
  }

  return <ForecastListClient data={data} isAuthenticated={!!session} showAddCard={!!session} />
}

export default async function Page() {
  return (
    <React.Suspense fallback={<SkeletonForecastList />}>
      <ForecastList />
    </React.Suspense>
  )
}
