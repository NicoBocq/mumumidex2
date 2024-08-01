import React from 'react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SectionProps = {
  title?: string
  description?: string
  children: React.ReactNode
  withoutCard?: boolean
  className?: string
}

export default function Section({
  title,
  description,
  children,
  withoutCard = false,
  className,
}: SectionProps) {
  return (
    <div
      className={cn(
        'flex min-h-[var(--available-height)] flex-col items-center justify-center gap-4',
        className,
      )}
    >
      {!withoutCard ? (
        <Card className="w-full max-w-sm border-0 bg-primary/5">
          <CardHeader className="text-center">
            {!!title && <CardTitle>{title}</CardTitle>}
            {!!description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      ) : (
        children
      )}
    </div>
  )
}
