import type { Daily } from '@/types/forecast'
import WeatherIcon from '../weather/weather-icon'

export default function WeeklyForecast({ data }: { data: Daily }) {
  // Identify today to label it "Aujourd'hui"
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="flex flex-col gap-2">
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">7-Day Forecast</h3>
      <div className="grid gap-2">
        {data.time.map((time, i) => {
          // Skip past days if any, though Open-Meteo returns from current usually
          // Actually Open-Meteo returns from today.
          // Parse YYYY-MM-DD to local 12:00 PM to avoid timezone offsets shifting the day
          const [year, month, day] = time.split('-').map(Number)
          const date = new Date(year, month - 1, day, 12)

          const isToday = time === todayStr

          const dayName = isToday
            ? 'Today'
            : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)

          const minTemp = Math.round(data.temperature_2m_min[i])
          const maxTemp = Math.round(data.temperature_2m_max[i])
          const weatherCode = data.weather_code[i]

          return (
            <div
              key={time}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 rounded-md bg-transparent p-1 px-2 text-sm"
            >
              {/* Day Name */}
              <span className="font-medium capitalize text-muted-foreground">{dayName}</span>

              {/* Icon & Precip */}
              <div className="flex items-center gap-2">
                <WeatherIcon code={weatherCode} isDay={1} className="h-6 w-6" />
              </div>

              {/* Min/Max Temp */}
              <div className="flex w-24 text-xs items-center justify-end gap-2 font-medium">
                <span className="text-muted-foreground">{minTemp}°</span>
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-muted-foreground/20 to-foreground/20" />
                <span>{maxTemp}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
