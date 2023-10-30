import { useSocketContext } from './SocketProvider'

type ApiEmitocketType = {
  startTyping: { targetId: string }
  stopTyping: { targetId: string }
}

export const useAppEmitSocket = () => {
  const { socket } = useSocketContext()

  const emitSocketEvent = <T extends keyof ApiEmitocketType>({
    key,
    ...value
  }: { key: T } & ApiEmitocketType[T]) => {
    console.log({ value })
    socket?.emit(key, value)
  }

  return emitSocketEvent
}
