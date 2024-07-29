'use client'

import { useRouter } from 'next/navigation'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../ui/drawer'

interface ModalProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  children?: React.ReactNode
  title: string
  description?: string
  footer?: React.ReactNode
}

export default function Modal(props: ModalProps) {
  const { title, description, children, footer, ...restProps } = props
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    }
  }

  return (
    <Drawer onOpenChange={handleOnOpenChange} {...restProps}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          {children && <div className="p-6">{children}</div>}
          <DrawerFooter>{footer && footer}</DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
