import { cn } from '@/lib/utils'

type WeatherIconProps = {
  code: number
  isDay?: number
  className?: string
}

const Sun = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: 'visible' }}
  >
    <title>Sun</title>
    <circle cx="12" cy="12" r="4" className="fill-amber-400 stroke-amber-400 stroke-2" />
    <path
      d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07"
      className="stroke-amber-400 stroke-2 animate-spin-slow origin-center"
      strokeLinecap="round"
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  </svg>
)

const Moon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: 'visible' }}
  >
    <title>Moon</title>
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      className="fill-slate-400 stroke-slate-400 stroke-2 animate-float"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 5L20 6M20 5L19 6M16 4H16.01"
      className="stroke-amber-200 stroke-2 animate-pulse"
      strokeLinecap="round"
    />
  </svg>
)

const Cloud = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: 'visible' }}
  >
    <title>Cloud</title>
    <path
      d="M17.5 19C19.9853 19 22 16.9853 22 14.5C22 12.132 20.177 10.244 17.8125 10.025C17.4144 6.079 14.0766 3 10 3C6.3989 3 3.37699 5.439 2.37899 8.848C1.034 9.539 0 10.978 0 12.5C0 14.9853 2.01472 17 4.5 17H17.5Z"
      className="fill-slate-200 dark:fill-slate-600 stroke-slate-300 dark:stroke-slate-500 stroke-1 animate-float"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const SunCloud = ({ className }: { className?: string }) => (
  <div className={cn('relative', className)}>
    <Sun className="absolute right-[-10%] top-[-10%] h-3/5 w-3/5 opacity-80" />
    <Cloud className="absolute bottom-0 left-0 h-4/5 w-4/5" />
  </div>
)

const MoonCloud = ({ className }: { className?: string }) => (
  <div className={cn('relative', className)}>
    <Moon className="absolute right-[-10%] top-[-10%] h-3/5 w-3/5 opacity-80" />
    <Cloud className="absolute bottom-0 left-0 h-4/5 w-4/5" />
  </div>
)

const Rain = ({ className }: { className?: string }) => (
  <div className={cn('relative', className)}>
    <Cloud className="absolute left-0 top-0 h-full w-full" />
    <svg
      viewBox="0 0 24 24"
      className="absolute bottom-[-20%] left-0 h-full w-full overflow-visible"
    >
      <title>Rain drops</title>
      <line
        x1="8"
        y1="12"
        x2="8"
        y2="16"
        className="stroke-sky-400 stroke-2 animate-rain-1"
        style={{ animationDelay: '0s' }}
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="16"
        className="stroke-sky-400 stroke-2 animate-rain-1"
        style={{ animationDelay: '0.4s' }}
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="12"
        x2="16"
        y2="16"
        className="stroke-sky-400 stroke-2 animate-rain-1"
        style={{ animationDelay: '0.8s' }}
        strokeLinecap="round"
      />
    </svg>
  </div>
)

const Snow = ({ className }: { className?: string }) => (
  <div className={cn('relative', className)}>
    <Cloud className="absolute left-0 top-0 h-full w-full" />
    <svg
      viewBox="0 0 24 24"
      className="absolute bottom-[-20%] left-0 h-full w-full overflow-visible"
    >
      <title>Snow flakes</title>
      <circle
        cx="8"
        cy="14"
        r="1.5"
        className="fill-white animate-snow-1"
        style={{ animationDelay: '0s' }}
      />
      <circle
        cx="16"
        cy="14"
        r="1.5"
        className="fill-white animate-snow-1"
        style={{ animationDelay: '1s' }}
      />
    </svg>
  </div>
)

const Storm = ({ className }: { className?: string }) => (
  <div className={cn('relative', className)}>
    <Cloud className="absolute left-0 top-0 h-full w-full dark:fill-slate-700 fill-slate-400" />
    <svg
      viewBox="0 0 24 24"
      className="absolute bottom-[-20%] left-[10%] h-3/4 w-3/4 overflow-visible"
    >
      <title>Lightning bolt</title>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        className="fill-yellow-400 stroke-yellow-500 stroke-1 animate-flash"
      />
    </svg>
  </div>
)

export default function WeatherIcon({ code, isDay = 1, className }: WeatherIconProps) {
  const cnStr = cn('w-12 h-12', className)

  // Clear
  if (code === 0) return isDay ? <Sun className={cnStr} /> : <Moon className={cnStr} />

  // Cloudyish
  if (code >= 1 && code <= 3)
    return isDay ? <SunCloud className={cnStr} /> : <MoonCloud className={cnStr} />

  // Fog
  if (code === 45 || code === 48) return <Cloud className={cn('opacity-50 blur-[1px]', cnStr)} />

  // Rain / Drizzle
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <Rain className={cnStr} />

  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <Snow className={cnStr} />

  // Storm
  if (code >= 95) return <Storm className={cnStr} />

  // Default
  return <Cloud className={cnStr} />
}
