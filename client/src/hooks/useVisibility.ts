import { useEffect, useState } from 'react'

export const useVisibility = (ref: HTMLElement) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    ref?.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      ref?.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return isVisible
}
