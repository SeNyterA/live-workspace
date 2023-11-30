import { useNavigate } from 'react-router-dom'
import useAppParams from './useAppParams'

export default function useAppControlParams() {
  const navigate = useNavigate()

  const { teamId, directId } = useAppParams()

  return {
    switchTo: ({
      targetId,
      target
    }: {
      targetId: string
      target: 'board' | 'channel' | 'group' | 'direct-message'
    }) => navigate(`/team/${teamId || 'personal'}/${target}/${targetId}`),
    switchTeam: ({ teamId }: { teamId: string }) => {
      navigate(
        `/team/${teamId || 'personal'}${
          directId ? `/direct-message/${directId}` : ''
        }`
      )
    }
  }
}
