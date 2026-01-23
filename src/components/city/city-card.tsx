'use client'

import type { City } from '@prisma/client'

import { cn } from '@/lib/utils'

import Icon from '@/components/custom-ui/icon'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'

interface CityCardProps {
  city: City
  onDelete: (id: string) => void
  onUpdate: (data: { id: string; pinned?: boolean; hidden?: boolean }) => void
}

export function CityCard({ city, onDelete, onUpdate }: CityCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:bg-black/20 dark:border-white/10">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />

      <div className="flex items-center justify-between p-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-lg font-bold tracking-tight',
                city.hidden && 'text-muted-foreground'
              )}
            >
              {city.name}
            </span>
            {city.pinned && (
              <div className="flex items-center justify-center rounded-full bg-primary/20 p-1 text-primary shadow-sm backdrop-blur-sm">
                <Icon name="Pin" size="xs" />
              </div>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80">
            <Icon name="MapPin" size="xs" className="opacity-70" />
            {city.country}
            {city.admin1 ? ` • ${city.admin1}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
          <Toggle
            size="sm"
            pressed={city.pinned}
            onPressedChange={(pressed) => onUpdate({ id: city.id, pinned: pressed })}
            aria-label="Pin city"
            className="h-8 w-8 rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-white/20 hover:text-foreground dark:hover:bg-white/10"
          >
            <Icon name="Pin" size="xs" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={city.hidden}
            onPressedChange={(pressed) =>
              onUpdate({
                id: city.id,
                hidden: pressed,
                ...(pressed ? { pinned: false } : {}),
              })
            }
            aria-label="Hide city"
            className="h-8 w-8 rounded-full data-[state=on]:bg-muted data-[state=on]:text-muted-foreground hover:bg-white/20 hover:text-foreground dark:hover:bg-white/10"
          >
            <Icon name="EyeOff" size="xs" />
          </Toggle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(city.id)}
          >
            <Icon name="Trash2" size="xs" />
          </Button>
        </div>
      </div>
    </div>
  )
}
