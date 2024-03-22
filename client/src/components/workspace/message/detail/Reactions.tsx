import { memo } from 'react'
import { getAppValue, useAppSelector } from '../../../../redux/store'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation'
import { TReaction } from '../../../../types'

function Reactions({
  messageId,
  workspaceId
}: {
  messageId: string
  workspaceId: string
}) {
  const { mutateAsync: reactMessage } = useAppMutation('reactMessage')
  const reactionsByUnified =
    useAppSelector(state => {
      const reactionsGroupedByUnified: { [unifiedKey: string]: TReaction[] } =
        {}
      Object.values(state.workspace.reactions)
        .filter(
          reaction => reaction.messageId === messageId && reaction.isAvailable
        )
        .forEach(reaction => {
          if (!reactionsGroupedByUnified[reaction.unified]) {
            reactionsGroupedByUnified[reaction.unified] = []
          }
          reactionsGroupedByUnified[reaction.unified].push(reaction)
        })
      return Object.values(reactionsGroupedByUnified).sort(
        (a, b) => b.length - a.length
      )
    }) || []

  return (
    <div className={`flex gap-2 ${reactionsByUnified.length > 0 && 'mt-1'}`}>
      {reactionsByUnified.map((reactions, index) => (
        <div
          key={reactions[0].unified + reactions.length}
          className={`cursor-pointer rounded bg-white p-0.5 transition hover:ring-1 hover:ring-blue-500 ${reactions.some(e => e.userId === getAppValue(state => state.auth.userInfo?.id)) && 'ring-1 ring-gray-300'}`}
          onClick={() => {
            reactMessage({
              url: {
                baseUrl: '/workspaces/:workspaceId/messages/:messageId/react',
                urlParams: {
                  messageId,
                  workspaceId
                }
              },
              method: 'post',
              payload: {
                unified: reactions[0].unified
              }
            })
          }}
        >
          {reactions[0].native}{' '}
          <span className='text-xs text-gray-700'>{reactions.length}</span>
        </div>
      ))}
    </div>
  )
}

export default memo(Reactions)
