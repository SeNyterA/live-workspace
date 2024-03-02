import { createContext, ReactNode, useContext } from 'react'
import { TParams } from '../../../../hooks/useAppParams'

export type TTargetMessageId = Partial<
  Pick<TParams, 'channelId' | 'groupId' | 'directId' | 'boardId'>
>

export type TMessageInfoValue = {
  title: string
  targetId: TTargetMessageId
  userTargetId?: string
  type: 'channel' | 'group' | 'direct' | 'board' | 'orther'
}
const messageInfoContext = createContext<TMessageInfoValue>({
  targetId: {},
  title: '',
  type: 'orther'
})

export const useMessageInfo = () => useContext(messageInfoContext)

export default function InfoProvier({
  children,
  value
}: {
  value: TMessageInfoValue
  children: ReactNode
}) {
  return (
    <messageInfoContext.Provider
      value={{
        ...value
      }}
    >
      {children}
    </messageInfoContext.Provider>
  )
}
