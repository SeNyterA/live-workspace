import { useRef } from 'react'
import { useAppEmitSocket } from '../services/socket/useAppEmitSocket'

export default function useTyping() {
  const socketEmit = useAppEmitSocket()
  const typingRef = useRef<number | undefined>()

  const typing = (targetId: string) => {
    if (typingRef.current === undefined) {
      socketEmit({
        key: 'startTyping',
        targetId: targetId
      })

      typingRef.current = setTimeout(() => {
        typingRef.current = undefined
      }, 500)
    }
  }

  return typing
}
