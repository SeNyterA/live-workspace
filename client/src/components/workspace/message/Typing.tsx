import { useState } from 'react'
import { useAppSelector } from '../../../redux/store'
import {
  ApiSocketType,
  useAppOnSocket
} from '../../../services/socket/useAppOnSocket'

export default function Typing({ messRefId }: { messRefId?: string }) {
  const [userTypings, setUserTypings] =
    useState<ApiSocketType['typing']['response'][]>()
  useAppOnSocket({
    key: 'typing',
    resFunc: ({ targetId, userId, type }) => {
      setUserTypings([...(userTypings || []), { targetId, userId, type }])
    }
  })

  const usersTyping = useAppSelector(state => {
    const usersId = userTypings
      ?.filter(e => e.targetId === messRefId && e.type === 1)
      .map(e => e.userId)

    return Object.values(state.workspace.users).filter(
      user => usersId?.includes(user.id)
    )
  })
  const usersText = usersTyping?.map(user => user.userName).join(', ')
  const displayText = !!usersText && `${usersText} typing`

  return <span>{displayText}</span>
}
