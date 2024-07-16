import { Location } from '@/types/location'

import { getForecast } from '@/actions/forecast'

import ForecastCard from '@/components/forecast/card'

export default async function Page() {
  const { data } = await getForecast()
  console.log(JSON.stringify(data, null, 2))
  if (!data) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {data.map((item) => (
        <ForecastCard key={item.location.id} data={item} />
      ))}
    </div>
  )
}
