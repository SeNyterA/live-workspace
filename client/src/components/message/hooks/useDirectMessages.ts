import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import {
  TMessages,
  workspaceActions
} from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'

export default function useDirectMessages() {
  const { directId } = useAppParams()
  const dispatch = useDispatch()

  const { data: directMessages } = useAppQuery({
    key: 'directMessages',
    url: {
      baseUrl: '/workspace/direct-messages/:directId/messages',
      urlParams: {
        directId: directId!
      }
    },
    options: {
      queryKey: [directId],
      enabled: !!directId
    }
  })

  // const { data: findDirectInfo } = useAppQuery({
  //   key: 'findDirectInfo',
  //   url: {
  //     baseUrl: '/workspace/direct-messages',
  //     queryParams: {
  //       directId: directId,
  //       targetEmail: directId,
  //       targetId: directId,
  //       targetUserName: directId
  //     }
  //   },
  //   options: {
  //     queryKey: [directId],
  //     enabled: !!directId
  //   }
  // })

  // useEffect(() => {
  //   if (findDirectInfo) {
  //     dispatch(
  //       workspaceActions.addUsers(
  //         findDirectInfo.users.reduce(
  //           (pre, next) => ({ ...pre, [next._id]: next }),
  //           {} as TUsers
  //         )
  //       )
  //     )
  //     dispatch(
  //       workspaceActions.addUsers(
  //         findDirectInfo.users.reduce(
  //           (pre, next) => ({ ...pre, [next._id]: next }),
  //           {} as TUsers
  //         )
  //       )
  //     )
  //   }
  // }, [findDirectInfo])

  useEffect(() => {
    if (directMessages)
      dispatch(
        workspaceActions.addMessages(
          directMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as TMessages
          )
        )
      )
  }, [directMessages])

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages).filter(e => e._id)
    ) || []

  return {
    messages
  }
}
