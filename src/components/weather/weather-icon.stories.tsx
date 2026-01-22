import type { Meta, StoryObj } from '@storybook/react'
import WeatherIcon from './weather-icon'

const meta: Meta<typeof WeatherIcon> = {
  title: 'Weather/Icons',
  component: WeatherIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'WMO Weather Code',
    },
    isDay: {
      control: 'boolean',
      description: 'Is it day or night?',
    },
  },
}

export default meta
type Story = StoryObj<typeof WeatherIcon>

export const Default: Story = {
  args: {
    code: 0,
    isDay: 1,
  },
}

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-8 p-4">
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={0} isDay={1} />
        <span className="text-xs text-muted-foreground">Clear Day (0)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={0} isDay={0} />
        <span className="text-xs text-muted-foreground">Clear Night (0)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={2} isDay={1} />
        <span className="text-xs text-muted-foreground">Partly Cloudy (2)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={3} />
        <span className="text-xs text-muted-foreground">Overcast (3)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={45} />
        <span className="text-xs text-muted-foreground">Fog (45)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={51} />
        <span className="text-xs text-muted-foreground">Drizzle (51)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={61} />
        <span className="text-xs text-muted-foreground">Rain (61)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={80} isDay={1} />
        <span className="text-xs text-muted-foreground">Showers Day (80)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={80} isDay={0} />
        <span className="text-xs text-muted-foreground">Showers Night (80)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={71} />
        <span className="text-xs text-muted-foreground">Snow (71)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={85} isDay={1} />
        <span className="text-xs text-muted-foreground">Snow Showers (85)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <WeatherIcon code={95} />
        <span className="text-xs text-muted-foreground">Storm (95)</span>
      </div>
    </div>
  ),
}
