import { useSocketContext } from './SocketProvider'

type ApiEmitocketType = {
  startTyping: { targetId: string }
  stopTyping: { targetId: string }
  readedMessage: { messageId: string; workspaceId: string }
}

export const useAppEmitSocket = () => {
  const { socket } = useSocketContext()

  const emitSocketEvent = <T extends keyof ApiEmitocketType>({
    key,
    ...value
  }: { key: T } & ApiEmitocketType[T]) => {
    socket?.emit(key, value)
  }

  return emitSocketEvent
}
