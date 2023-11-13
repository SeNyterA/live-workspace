import { useAppSelector } from '../../redux/store'
import { TUser } from '../../types/user.type'
import { TDirect } from '../../types/workspace.type'

export default function DirectNavLink({
  direct,
  children
}: {
  direct: TDirect
  children: ({ targetUser }: { targetUser?: TUser }) => any
}) {
  const targetUser = useAppSelector(state => {
    console.log(state.workspace.users)
    return Object.values(state.workspace.users).find(
      user =>
        user._id === direct.userIds.find(id => id !== state.auth.userInfo?._id)
    )
  })

  return children({
    targetUser
  })
}
