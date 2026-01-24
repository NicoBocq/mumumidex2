import { cn } from '@/lib/utils'

export default function Gauge({
  value,
  max = 100,

  icon,
  className,
  colorClass = 'text-sky-400',
}: {
  value: number
  max?: number
  icon?: React.ReactNode
  className?: string
  colorClass?: string
}) {
  const percentage = Math.min(Math.max(value / max, 0), 1)
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - percentage * circumference

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg className="h-10 w-10 -rotate-90 transform" viewBox="0 0 40 40">
        <title>Gauge</title>
        {/* Background Circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted-foreground/30"
        />
        {/* Progress Circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000 ease-out', colorClass)}
        />
      </svg>
      {icon && <div className="absolute text-foreground/70">{icon}</div>}
    </div>
  )
}
