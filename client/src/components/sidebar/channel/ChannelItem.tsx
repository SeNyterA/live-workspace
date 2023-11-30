import { NavLink } from '@mantine/core'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { TChannel } from '../../../types/workspace.type'

export default function ChannelItem({ channel }: { channel: TChannel }) {
  const { channelId } = useAppParams()
  const unreadCount = useAppSelector(
    state => state.workspace.unreadCount[channel._id]
  )
  const { switchTo } = useAppControlParams()

  return (
    <NavLink
      classNames={{ label: 'truncate max-w-[220px] block flex-1' }}
      className='p-1 pl-3'
      label={
        <div className='flex items-center gap-2'>
          <span className='flex-1 truncate'>
            {channel.title || channel._id}
          </span>
          {unreadCount && (
            <span className='h-4 w-4 rounded-full bg-gray-300 text-center leading-4 text-gray-800'>
              {unreadCount}
            </span>
          )}
        </div>
      }
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
