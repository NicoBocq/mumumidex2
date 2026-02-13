import React from 'react'
import { getForecast } from '@/actions/forecast'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import Section from '@/components/custom-ui/section'
import { SkeletonForecastCard } from '@/components/forecast/card-skeleton'
import ForecastListServer from '@/components/forecast/forecast-list-server'
import HomeClientShell from '@/components/home/home-client-shell'
import { getServerSession } from '@/lib/server-session'
import { getSortValue } from '@/lib/weather-metrics'

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
  const forecastPromise = getForecast()
  const sessionPromise = getServerSession()
  const [{ data, error }, session] = await Promise.all([forecastPromise, sessionPromise])

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

  const sortedData = [...data].sort(
    (a, b) => getSortValue(b.current, sortMetric) - getSortValue(a.current, sortMetric)
  )
  const pinnedCities = sortedData.filter((item) => item.city.pinned)
  const unpinnedCities = sortedData.filter((item) => !item.city.pinned)

  return (
    <ForecastListServer
      pinnedCities={pinnedCities}
      unpinnedCities={unpinnedCities}
      isAuthenticated={!!session}
      sortMetric={sortMetric}
    />
  )
}

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <>
      <HomeClientShell />
      <React.Suspense fallback={<SkeletonForecastList />}>
        <ForecastList {...props} />
      </React.Suspense>
    </>
  )
}
