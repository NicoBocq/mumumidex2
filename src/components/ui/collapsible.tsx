'use client'

import { Collapsible as BaseCollapsible } from '@base-ui/react'

import * as React from 'react'

const Collapsible = BaseCollapsible.Root

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger> & {
    asChild?: boolean
  }
>(({ asChild, children, ...props }, ref) => (
  <BaseCollapsible.Trigger
    ref={ref}
    {...props}
    render={asChild ? (children as React.ReactElement) : undefined}
  >
    {!asChild && children}
  </BaseCollapsible.Trigger>
))
CollapsibleTrigger.displayName = 'CollapsibleTrigger'

const CollapsibleContent = BaseCollapsible.Panel

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
