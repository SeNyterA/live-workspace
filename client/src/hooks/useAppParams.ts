import { useParams } from 'react-router-dom'

export type TParams = {
  boardId?: string
  channelId?: string
  groupId?: string
  messageId?: string
  teamId?: string
}

export default function useAppParams() {
  return useParams<TParams>()
}
