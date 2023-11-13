import useAppParams from '../../../hooks/useAppParams'
import useChannelMesages from './useChannelMesages'
import useDirectMessages from './useDirectMessages'

export default function useMessages() {
  const { directId, channelId } = useAppParams()

  if (directId) return useDirectMessages()
  if (channelId) return useChannelMesages()
  return {
    messages: []
  }
}
