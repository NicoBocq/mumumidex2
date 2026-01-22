import { getMiseryClass } from '@/lib/misery-index'
import { cn } from '@/lib/utils'

export default function MiseryGauge({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  // Max score reference (approx 60 for "Apocalypse")
  const maxScore = 50
  const normalizedScore = Math.min(score, maxScore)
  const percentage = (normalizedScore / maxScore) * 100

  // Create 20 segments for the ring
  const segments = Array.from({ length: 40 })
  const activeSegments = Math.round((percentage / 100) * 40)

  return (
    <div className={cn('relative flex h-24 w-24 items-center justify-center', className)}>
      {/* Container for segments */}
      <div className="absolute inset-0 flex items-center justify-center">
        {segments.map((_, i) => {
          const rotation = i * (360 / 40)
          const isActive = i < activeSegments

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: purely decorative static ring
              key={i}
              className={cn(
                'absolute h-full w-[2px] origin-center bg-muted/20 transition-all duration-500',
                isActive && getMiseryClass(score, 'text').replace('text-', 'bg-'),
                isActive && 'w-[3px] shadow-[0_0_8px_currentColor]'
              )}
              style={{
                transform: `rotate(${rotation}deg)`,
                // Mask center to create ticks
                maskImage: 'linear-gradient(to bottom, white 20%, transparent 20%)',
                WebkitMaskImage: 'linear-gradient(to bottom, white 20%, transparent 20%)',
              }}
            />
          )
        })}
      </div>

      {/* Center Value */}
      <div className="relative flex flex-col items-center justify-center rounded-full bg-background/50 p-4 backdrop-blur-sm">
        <span className={cn('text-4xl font-black tracking-tighter', getMiseryClass(score, 'text'))}>
          {score}
        </span>
      </div>
    </div>
  )
}
