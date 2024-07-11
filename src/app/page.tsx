import { getForecast } from "@/actions/forecast"
import { Location } from "@/types/geocoding"

const cityList: Location[] = [{
  latitude: 52.37743,
  longitude: 4.89707,
  name: "Amsterdam",
  id: 2995469,
  country: "Netherlands",
  country_code: "NL"
},
{
  latitude: 48.856667,
  longitude: 2.352222,
  name: "Paris",
  id: 2992166,
  country: "France",
  country_code: "FR"
},
{
  latitude: 51.50736,
  longitude: -0.12776,
  name: "London",
  id: 2643743,
  country: "United Kingdom",
  country_code: "GB"
}]

export default async function Page() {
  const data = await getForecast(cityList)
  console.log(JSON.stringify(data, null, 2))
  return (
    <div>
      <h1 className="text-4xl p-2 font-extrabold uppercase text-violet-900">Mumu<span className="text-violet-500">Midex</span></h1>
    </div>
  )
}
