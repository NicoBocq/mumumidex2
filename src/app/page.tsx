import { headers } from 'next/headers'
import React from 'react'
import { deleteCity, updateCity } from '@/actions/city'
import { getForecast } from '@/actions/forecast'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import Section from '@/components/custom-ui/section'
import { SkeletonForecastCard } from '@/components/forecast/card'
import ForecastListClient from '@/components/forecast/forecast-list'
import { auth } from '@/lib/auth'

function SkeletonForecastList() {
  return (
    <Grid>
      {['s1', 's2', 's3', 's4', 's5'].map((id) => (
        <SkeletonForecastCard key={id} />
      ))}
    </Grid>
  )
}

async function ForecastList(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { data, error } = await getForecast()
  const session = await auth.api.getSession({ headers: await headers() })

  // Await searchParams for Next.js 15+ compatibility
  const params = await props.searchParams
  const sortMetric = (params?.sort as 'apparent' | 'humidex' | 'windchill') || 'apparent'

  if (error) {
    return (
      <Section withoutCard className="text-muted-foreground">
        <Icon name="CloudOff" size="xl" />
        <p className="text-lg font-medium">Unable to load weather data</p>
        <p className="text-sm">Please check your connection and try again.</p>
      </Section>
    )
  }

  return (
    <ForecastListClient
      data={data}
      isAuthenticated={!!session}
      showAddCard={!!session}
      updateCityAction={updateCity}
      deleteCityAction={deleteCity}
      sortMetric={sortMetric}
    />
  )
}

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <React.Suspense fallback={<SkeletonForecastList />}>
      <ForecastList {...props} />
    </React.Suspense>
  )
}
