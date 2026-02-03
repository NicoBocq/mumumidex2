export default function Sparkline({
  data,
  color = 'stroke-primary',
  className,
  showLabels = true,
}: {
  data: number[]
  color?: string
  className?: string
  showLabels?: boolean
}) {
  if (!data || data.length === 0) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 120
  const height = 40
  const padding = showLabels ? 10 : 0
  const chartHeight = height - padding * 2

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = padding + chartHeight - ((val - min) / range) * chartHeight
      return `${x},${y}`
    })
    .join(' ')

  const areaPoints = `${points} ${width},${height} 0,${height}`

  // Simplified gradient ID to avoid hydration issues if possible
  const gradientId = `gradient-${color.replace(/[^a-zA-Z]/g, '')}`

  return (
    <div className="flex items-center gap-1.5">
      {showLabels && (
        <span className="text-[10px] font-medium text-muted-foreground/60 tabular-nums">
          {Math.round(min)}°
        </span>
      )}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        preserveAspectRatio="none"
        overflow="visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={color} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" className={color} />
          </linearGradient>
        </defs>
        <title>Weather Trend</title>
        <path d={`M ${areaPoints.replace(/ /g, ' L ')} Z`} fill={`url(#${gradientId})`} />
        <polyline
          points={points}
          fill="none"
          strokeWidth="2.5"
          className={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showLabels && (
        <span className="text-[10px] font-medium text-muted-foreground/60 tabular-nums">
          {Math.round(max)}°
        </span>
      )}
    </div>
  )
}
