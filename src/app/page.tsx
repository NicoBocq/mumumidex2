import { getForecast, reload } from '@/actions/forecast'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'

import AddCityFab from '@/components/city/add-city-fab'
import { ButtonFormSubmit } from '@/components/custom-ui/button-form-submit'
import Grid from '@/components/custom-ui/grid'
import Icon from '@/components/custom-ui/icon'
import Section from '@/components/custom-ui/section'
import { SkeletonForecastCard } from '@/components/forecast/card'
import ForecastListClient from '@/components/forecast/forecast-list'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'

function SkeletonForecastList() {
  return (
    <Grid>
      {['s1', 's2', 's3', 's4', 's5'].map((id) => (
        <SkeletonForecastCard key={id} />
      ))}
    </Grid>
  )
}

async function ForecastList({ standAlone }: { standAlone: boolean }) {
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

  if (data.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
        <OnboardingWizard reload={reload} />
      </div>
    )
  }

  return (
    <>
      {standAlone && (
        <form action={reload} className="mb-4 flex w-full">
          <ButtonFormSubmit
            size="icon"
            icon="RefreshCw"
            variant="ghostPrimary"
            label="Refresh"
            className="w-full"
          />
        </form>
      )}
      <ForecastListClient data={data} isAuthenticated={!!session} />
      {session && <AddCityFab />}
    </>
  )
}

export default async function Page(props: {
  searchParams: Promise<{ standalone: string }>
}) {
  const searchParams = await props.searchParams
  return (
    <React.Suspense fallback={<SkeletonForecastList />}>
      <ForecastList standAlone={searchParams.standalone === 'true'} />
    </React.Suspense>
  )
}
