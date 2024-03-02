import { useNavigate } from 'react-router-dom'
import { WorkspaceType } from '../types'
import useAppParams from './useAppParams'

const urlParser = {
  [WorkspaceType.Board]: 'board',
  [WorkspaceType.Channel]: 'channel',
  [WorkspaceType.Group]: 'group',
  [WorkspaceType.DirectMessage]: 'direct-message'
}

export default function useAppControlParams() {
  const navigate = useNavigate()

  const { teamId, directId, boardId } = useAppParams()

  return {
    switchTo: ({
      targetId,
      target
    }: {
      targetId: string
      target:
        | WorkspaceType.Board
        | WorkspaceType.Channel
        | WorkspaceType.Group
        | WorkspaceType.DirectMessage
    }) =>
      navigate(
        `/team/${teamId || 'personal'}/${urlParser[target]}/${targetId}`
      ),

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
