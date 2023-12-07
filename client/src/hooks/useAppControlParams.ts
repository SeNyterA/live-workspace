import { useNavigate } from 'react-router-dom'
import useAppParams from './useAppParams'

export default function useAppControlParams() {
  const navigate = useNavigate()

  const { teamId, directId, boardId } = useAppParams()

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
    },
    toogleCard: ({
      teamId: _teamId,
      boardId: _boardId,
      cardId
    }: {
      teamId?: string
      boardId?: string
      cardId?: string
    }) => {
      const __teamId = _teamId || teamId
      const __boardId = _boardId || boardId

      if (__teamId && __boardId)
        if (cardId) navigate(`/team/${teamId}/board/${boardId}/${cardId}`)
        else navigate(`/team/${teamId}/board/${boardId}`)
    }
  }
}
