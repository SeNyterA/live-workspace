import { NavLink } from '@mantine/core'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { TChannel } from '../../../types/workspace.type'

export default function ChannelItem({ channel }: { channel: TChannel }) {
  const { channelId } = useAppParams()
  const { switchTo } = useAppControlParams()

  return (
    <NavLink
      className='p-1 pl-3'
      label={channel.title || channel._id}
      active={channelId === channel._id}
      onClick={() => {
        switchTo({
          target: 'channel',
          targetId: channel._id
        })
      }}
    />
  )
}
