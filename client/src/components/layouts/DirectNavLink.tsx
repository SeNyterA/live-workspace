import { useAppSelector } from '../../redux/store'
import { TDirect } from '../../types/workspace.type'

export default function DirectNavLink({ direct }: { direct: TDirect }) {
  const targetUsers = useAppSelector(state =>
    Object.values(state.workspace.users).filter(user =>
      direct.userIds.includes(user._id)
    )
  )

  console.log({
    targetUsers
  })
  return <></>
}
