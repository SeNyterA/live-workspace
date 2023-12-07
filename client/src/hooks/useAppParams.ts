import { useParams } from 'react-router-dom'

export type TParams = {
  boardId?: string
  channelId?: string
  groupId?: string
  directId?: string
  teamId?: string
  cardId: string
}

export default function useAppParams() {
  return useParams<TParams>()
}
