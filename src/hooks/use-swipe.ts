import * as React from 'react'

type UseSwipeOptions = {
  threshold?: number
  actionWidth?: number
}

type UseSwipeReturn = {
  translateX: number
  isOpen: boolean
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: () => void
  }
  close: () => void
}

export function useSwipe(options: UseSwipeOptions = {}): UseSwipeReturn {
  const { threshold = 50, actionWidth = 120 } = options

  const [translateX, setTranslateX] = React.useState(0)
  const [isOpen, setIsOpen] = React.useState(false)
  const startXRef = React.useRef(0)
  const startYRef = React.useRef(0)
  const isDraggingRef = React.useRef(false)
  const isHorizontalRef = React.useRef<boolean | null>(null)

  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    startYRef.current = e.touches[0].clientY
    isDraggingRef.current = true
    isHorizontalRef.current = null
  }, [])

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (!isDraggingRef.current) return

      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      const diffX = startXRef.current - currentX
      const diffY = startYRef.current - currentY

      // Determine scroll direction on first significant move
      if (isHorizontalRef.current === null) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          isHorizontalRef.current = Math.abs(diffX) > Math.abs(diffY)
        }
        return
      }

      // If vertical scroll, don't handle
      if (!isHorizontalRef.current) return

      // Only allow swipe left (positive diffX)
      const baseOffset = isOpen ? actionWidth : 0
      const newTranslate = Math.max(0, Math.min(actionWidth, diffX + baseOffset))
      setTranslateX(newTranslate)
    },
    [isOpen, actionWidth]
  )

  const handleTouchEnd = React.useCallback(() => {
    isDraggingRef.current = false
    isHorizontalRef.current = null

    if (translateX > threshold) {
      setTranslateX(actionWidth)
      setIsOpen(true)
    } else {
      setTranslateX(0)
      setIsOpen(false)
    }
  }, [translateX, threshold, actionWidth])

  const close = React.useCallback(() => {
    setTranslateX(0)
    setIsOpen(false)
  }, [])

  return {
    translateX,
    isOpen,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    close,
  }
}
