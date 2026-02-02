import type { Meta, StoryObj } from '@storybook/react'
import type { Forecast } from '@/types/forecast'
import { WEATHER_THEMES } from '../layout/background'
import ForecastCard from './card'

const mockForecast: Forecast = {
  latitude: 48.8566,
  longitude: 2.3522,
  timezone: 'Europe/Paris',
  utc_offset_seconds: 7200,
  city: {
    id: 'mock-city',
    name: 'Paris',
    country_code: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    userId: 'user-1',
    pinned: false,
    externalId: 0,
    country: '',
    admin1: null,
  },
  current: {
    time: new Date().toISOString(),
    interval: 900,
    temperature_2m: 24,
    relative_humidity_2m: 45,
    dew_point_2m: 12,
    apparent_temperature: 26,
    wind_speed_10m: 12,
    wind_direction_10m: 180,
    is_day: 1,
    precipitation: 0,
    cloud_cover: 25,
    weather_code: 1, // Mainly clear
    uv_index: 4,
    european_aqi: 35,
    humidex: 28,
    windChill: 24,
  },
  daily: {
    time: Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      return d.toISOString().split('T')[0]
    }),
    temperature_2m_max: [26, 25, 27, 22, 21, 23, 24],
    temperature_2m_min: [15, 16, 15, 14, 13, 12, 14],
    precipitation_probability_max: [0, 10, 0, 40, 60, 20, 0],
    weather_code: [1, 2, 0, 61, 63, 3, 1],
  },
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    temperature_2m: Array.from({ length: 24 }, (_, i) => 15 + Math.sin(i / 4) * 10),
    precipitation: Array(24).fill(0),
  },
  current_units: {
    time: 'iso8601',
    interval: 'seconds',
    temperature_2m: '°C',
    relative_humidity_2m: '%',
    dew_point_2m: '°C',
    apparent_temperature: '°C',
    wind_speed_10m: 'km/h',
    wind_direction_10m: '°',
    is_day: '',
    precipitation: 'mm',
    cloud_cover: '%',
    weather_code: 'wmo code',
    uv_index: '',
    european_aqi: '',
  },
  daily_units: {
    time: 'iso8601',
    temperature_2m_max: '°C',
    temperature_2m_min: '°C',
    precipitation_probability_max: '%',
    weather_code: 'wmo code',
  },
  hourly_units: {
    time: 'iso8601',
    temperature_2m: '°C',
    precipitation: 'mm',
  },
}

const meta: Meta<typeof ForecastCard> = {
  title: 'Forecast/Card',
  component: ForecastCard,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ForecastCard>

import type { deleteCity, updateCity } from '@/actions/city'

// Mock actions
const mockUpdateAction = { execute: async () => ({}) } as unknown as typeof updateCity
const mockDeleteAction = { execute: async () => ({}) } as unknown as typeof deleteCity

export const Default: Story = {
  args: {
    data: mockForecast,
    updateCityAction: mockUpdateAction,
    deleteCityAction: mockDeleteAction,
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-muted/20 p-8">
        <div className="w-full max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * Visualizes the ForecastCard on all available weather background themes.
 * Renders both Light and Dark mode variants for each theme.
 */
export const BackgroundGallery: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-8 bg-background text-foreground">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Background Themes Gallery</h1>
        <p className="text-muted-foreground">
          Displaying ForecastCard on different weather-based backgrounds (Light & Dark modes).
        </p>
      </div>

      <div className="grid gap-12">
        {Object.entries(WEATHER_THEMES).map(([name, theme]) => (
          <div key={name} className="space-y-4">
            <h2 className="text-xl font-semibold capitalize border-b pb-2">{name} Theme</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Light Mode Preview */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Light Mode
                </span>
                <div className={`relative overflow-hidden rounded-xl border p-8 ${theme.light.bg}`}>
                  {/* Simulate Blobs manually or simpy use bg */}
                  <div className="relative z-10 mx-auto max-w-sm">
                    <ForecastCard
                      data={mockForecast}
                      updateCityAction={mockUpdateAction}
                      deleteCityAction={mockDeleteAction}
                    />
                  </div>
                </div>
              </div>

              {/* Dark Mode Preview */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Dark Mode
                </span>
                {/* We use specific class to force dark mode styles if Tailwind is configured with class strategy, 
                    OR we just apply the dark bg directly. 
                    Note: ForecastCard uses glass/text-foreground so context matters. 
                    We'll wrap in a black container with .dark class to simulate. */}
                <div
                  className={`dark relative overflow-hidden rounded-xl p-8 ${theme.dark.bg} text-foreground`}
                >
                  {/* Note: In a real app 'dark' class usually goes on html/body. 
                       Here we try to apply it locally. */}
                  <div className="relative z-10 mx-auto max-w-sm">
                    <ForecastCard
                      data={mockForecast}
                      updateCityAction={mockUpdateAction}
                      deleteCityAction={mockDeleteAction}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const List: Story = {
  render: () => {
    const cities = [
      { ...mockForecast, city: { ...mockForecast.city, name: 'Paris', country_code: 'FR' } },
      {
        ...mockForecast,
        city: { ...mockForecast.city, name: 'New York', country_code: 'US' },
        current: { ...mockForecast.current, temperature_2m: 12, weather_code: 3 }, // Overcast
      },
      {
        ...mockForecast,
        city: { ...mockForecast.city, name: 'Tokyo', country_code: 'JP' },
        current: { ...mockForecast.current, temperature_2m: 28, weather_code: 0 }, // Clear
      },
      {
        ...mockForecast,
        city: { ...mockForecast.city, name: 'London', country_code: 'GB' },
        current: { ...mockForecast.current, temperature_2m: 15, weather_code: 61 }, // Rain
      },
    ]

    return (
      <div className="min-h-screen bg-muted/20 p-8">
        <h1 className="mb-6 text-2xl font-bold">My Cities</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cities.map((cityData) => (
            <ForecastCard
              key={cityData.city.name}
              data={cityData}
              updateCityAction={mockUpdateAction}
              deleteCityAction={mockDeleteAction}
            />
          ))}
        </div>
      </div>
    )
  },
}
