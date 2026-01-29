import type { Forecast } from '@/types/forecast'
import type { Meta, StoryObj } from '@storybook/react'
import ForecastCard from './card'

const meta: Meta<typeof ForecastCard> = {
  title: 'Forecast/Card',
  component: ForecastCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px] p-4">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ForecastCard>

// Mock Data Helper
const createMockForecast = (
  overrides: Partial<Forecast['current']> & { city?: Partial<Forecast['city']> }
): Forecast => {
  const { city, ...currentOverrides } = overrides
  return {
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    utc_offset_seconds: 3600,
    current: {
      time: new Date().toISOString(),
      interval: 900,
      temperature_2m: 20,
      relative_humidity_2m: 50,
      dew_point_2m: 10,
      apparent_temperature: 22,
      wind_speed_10m: 10,
      wind_direction_10m: 180,
      is_day: 1,
      precipitation: 0,
      cloud_cover: 0,
      weather_code: 0,
      humidex: 25,
      windChill: 20,
      ...currentOverrides,
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
    },
    hourly: {
      time: [],
      temperature_2m: [],
      precipitation: [],
    },
    hourly_units: {
      time: 'iso8601',
      temperature_2m: '°C',
      precipitation: 'mm',
    },
    city: {
      id: 'mock-city-id',
      externalId: 12345,
      name: 'Paris',
      country: 'France',
      country_code: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      admin1: 'Île-de-France',
      pinned: false,
      userId: 'mock-user-id',
      ...city,
    },
  }
}

export const ClearDay: Story = {
  args: {
    data: createMockForecast({
      weather_code: 0,
      is_day: 1,
      temperature_2m: 25,
      apparent_temperature: 28,
    }),
  },
}

export const ClearNight: Story = {
  args: {
    data: createMockForecast({
      weather_code: 0,
      is_day: 0,
      temperature_2m: 15,
      apparent_temperature: 14,
    }),
  },
}

export const Cloudy: Story = {
  args: {
    data: createMockForecast({
      weather_code: 3,
      is_day: 1,
      temperature_2m: 18,
      apparent_temperature: 18,
    }),
  },
}

export const Rain: Story = {
  args: {
    data: createMockForecast({
      weather_code: 61,
      is_day: 1,
      temperature_2m: 12,
      apparent_temperature: 10,
    }),
  },
}

export const Snow: Story = {
  args: {
    data: createMockForecast({
      weather_code: 71,
      is_day: 1,
      temperature_2m: -2,
      apparent_temperature: -5,
    }),
  },
}

export const Storm: Story = {
  args: {
    data: createMockForecast({
      weather_code: 95,
      is_day: 1,
      temperature_2m: 22,
      apparent_temperature: 24,
    }),
  },
}

export const Fog: Story = {
  args: {
    data: createMockForecast({
      weather_code: 45,
      is_day: 1,
      temperature_2m: 8,
      apparent_temperature: 7,
    }),
  },
}
