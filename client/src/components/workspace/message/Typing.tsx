import { getAppValue, useAppSelector } from '../../../redux/store'

export default function Typing({ targetId }: { targetId?: string }) {
  const usersTyping = useAppSelector(state => {
    return Object.entries(state.workspace.typing[targetId!])
  })

  const users = usersTyping
    ?.filter(([_, value]) => value)
    .map(([key]) =>
      getAppValue(
        state =>
          state.workspace.users[key]?.nickName ||
          state.workspace.users[key]?.userName
      )
    )
    .filter(e => !!e)
    .join(', ')

  return <span>{!!users && `${users} is typing.`}</span>
}
