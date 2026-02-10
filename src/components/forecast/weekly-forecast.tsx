import { Droplets, Wind } from 'lucide-react'
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
          const precipProb = data.precipitation_probability_max[i]
          const windSpeed = Math.round(data.wind_speed_10m_max[i])

          return (
            <div
              key={time}
              className="grid grid-cols-[2.8rem_1.5rem_2.5rem_1fr_auto] items-center gap-3 sm:gap-6 rounded-md bg-transparent p-1 px-0 text-sm"
            >
              {/* 1. Day Name */}
              <span className="font-medium capitalize text-muted-foreground/80 text-xs sm:text-sm">
                {dayName}
              </span>

              {/* 2. Icon */}
              <div className="flex justify-center">
                <WeatherIcon code={weatherCode} isDay={1} className="h-6 w-6" />
              </div>

              {/* 3. Precip */}
              <div className="flex items-center gap-0.5 text-xxs sm:text-xs text-muted-foreground/60">
                <Droplets className="size-3 md:size-4 text-primary/30" />
                <span>{precipProb}%</span>
              </div>

              {/* 4. Wind Speed */}
              <div className="flex items-center gap-0.5 text-xxs sm:text-xs text-muted-foreground/60">
                <Wind className="size-3 md:size-4 text-primary/30" />
                <span>{windSpeed}</span>
                <span className="hidden sm:inline opacity-70 ml-0.5 font-light">km/h</span>
              </div>

              {/* 5. Min/Max Temp */}
              <div className="flex items-center justify-end gap-1 sm:gap-2 font-medium text-[11px] sm:text-xs">
                <span className="text-muted-foreground w-6 text-right group-hover:text-foreground/70 transition-colors">
                  {minTemp}°
                </span>
                <div className="h-1 w-6 rounded-full bg-gradient-to-r from-muted-foreground/20 to-foreground/20" />
                <span className="w-6 text-left">{maxTemp}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
