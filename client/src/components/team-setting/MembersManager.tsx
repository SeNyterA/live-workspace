import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'

export default function MembersManager() {
  const { teamId } = useAppParams()

  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(e => e.targetId === teamId)
      .map(member => ({ member, user: state.workspace.users[member.userId] }))
  )

  console.log({ members })
  return <div></div>
}
