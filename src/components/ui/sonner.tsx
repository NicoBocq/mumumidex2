// 'use client'

// import { useTheme } from 'next-themes'
// import { Toaster as Sonner } from 'sonner'

// import Icon from '../custom-ui/icon'

// type ToasterProps = React.ComponentProps<typeof Sonner>

// const Toaster = ({ ...props }: ToasterProps) => {
//   const { theme = 'system' } = useTheme()

//   return (
//     <Sonner
//       position="top-center"
//       theme={theme as ToasterProps['theme']}
//       className="toaster group"
//       icons={{
//         success: <Icon name="Check" className="text-success-600" />,
//         error: <Icon name="X" className="text-destructive-600" />,
//         warning: <Icon name="Ban" className="text-warning-600" />,
//       }}
//       toastOptions={{
//         classNames: {
//           toast:
//             'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
//           description: 'group-[.toast]:text-muted-foreground',
//           actionButton:
//             'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
//           cancelButton:
//             'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
//         },
//       }}
//       {...props}
//     />
//   )
// }

// export { Toaster }

// https://github.com/shadcn-ui/ui/issues/2401#issuecomment-2189297618

'use client'

import { useTheme } from 'next-themes'
import { createPortal } from 'react-dom'
import { Toaster as Sonner } from 'sonner'

import Icon from '../custom-ui/icon'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  const toasterContent = (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <Icon name="Check" className="text-success-600" />,
        error: <Icon name="X" className="text-destructive-600" />,
        warning: <Icon name="Ban" className="text-warning-600" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )

  // Only render in the browser
  if (typeof window === 'undefined') return null

  return createPortal(toasterContent, document.body)
}

export { Toaster }
