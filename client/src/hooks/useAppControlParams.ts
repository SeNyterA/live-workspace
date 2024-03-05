import { useNavigate } from 'react-router-dom'
import { getAppValue } from '../redux/store'
import { EWorkspaceType } from '../types'
import { lsActions } from '../utils/auth'
import useAppParams from './useAppParams'

const urlParser = {
  [EWorkspaceType.Board]: 'board',
  [EWorkspaceType.Channel]: 'channel',
  [EWorkspaceType.Group]: 'group',
  [EWorkspaceType.Direct]: 'direct-message'
}

export default function useAppControlParams() {
  const navigate = useNavigate()

  const { teamId, directId, boardId, channelId, groupId } = useAppParams()

  return {
    switchTo: ({
      targetId,
      target
    }: {
      targetId: string
      target:
        | EWorkspaceType.Board
        | EWorkspaceType.Channel
        | EWorkspaceType.Group
        | EWorkspaceType.Direct
    }) => {
      lsActions.setTeamChild(teamId!, targetId)
      navigate(`/team/${teamId || 'personal'}/${urlParser[target]}/${targetId}`)
    },

    switchTeam: ({ teamId }: { teamId: string }) => {
      lsActions.setCurentTeam(teamId)

      const getChildUrl = () => {
        if (directId) {
          lsActions.setTeamChild(teamId, directId)
          return `/direct-message/${directId}`
        }
        if (groupId) {
          lsActions.setTeamChild(teamId, groupId)
          return `/group/${groupId}`
        }

        const teamChild = getAppValue(
          state => state.workspace.workspaces[lsActions.getTeamChild(teamId)!]
        )
        if (!!teamChild) {
          lsActions.setTeamChild(teamId, teamChild._id)
          return `/${urlParser[teamChild.type as keyof typeof urlParser]}/${
            teamChild._id
          }`
        } else {
          const teamChild = getAppValue(state =>
            Object.values(state.workspace.workspaces).find(
              e => e.parentId === teamId
            )
          )

          if (teamChild) {
            lsActions.setTeamChild(teamId, teamChild._id)
            return `/${urlParser[teamChild.type as keyof typeof urlParser]}/${
              teamChild._id
            }`
          }
        }

        return ''
      }

      navigate(`/team/${teamId || 'personal'}${getChildUrl()}`)
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
