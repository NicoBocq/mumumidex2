'use client'

import { AutoGeolocate } from '@/components/layout/auto-geolocate'
import { AutoRefresh } from '@/components/layout/auto-refresh'
import Background from '@/components/layout/background'

export default function HomeClientShell() {
  return (
    <>
      <AutoGeolocate />
      <AutoRefresh />
      <Background />
    </>
  )
}
