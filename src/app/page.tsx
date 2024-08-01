import React from 'react'
import { getForecast } from '@/actions/forecast'
import { auth } from '@/auth'

import { app } from '@/config/app'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import Section from '@/components/custom-ui/section'
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
  const { data, error } = await getForecast()
  const session = await auth()

  if (!!error) {
    return (
      <Section withoutCard className="text-muted-foreground">
        <Icon name="Frown" size="xl" />
        <p>Sad noise</p>
      </Section>
    )
  }

  if (data.length === 0) {
    return (
      <Section
        title={app.emptyState.title}
        description={app.emptyState.description}
      >
        <SearchCityPopover />
      </Section>
    )
  }

  const pinnedCities = data?.filter((item) => item.city.pinned)
  const unpinnedCities = data?.filter((item) => !item.city.pinned)

  return (
    <Grid>
      {pinnedCities?.map((item) => (
        <ForecastCard
          key={item.city.id}
          data={item}
          id={`card-${item.city.id}`}
          showCardActions={!!session}
        />
      ))}
      {unpinnedCities?.map((item) => (
        <ForecastCard
          key={item.city.id}
          data={item}
          id={`card-${item.city.id}`}
          showCardActions={!!session}
        />
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
