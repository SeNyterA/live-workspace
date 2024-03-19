import { Avatar } from '@mantine/core'
import dayjs from 'dayjs'
import { useAppSelector } from '../../../redux/store'
import Watching from '../../../redux/Watching'
import { EMessageType } from '../../../types'
import { TGroupedMessage } from './MessageContentProvider'
import MessageDetailContent from './MessageDetailContent'

export default function MessageGroup({
  messageGroup,
  classNames,
  scrollableRef
}: {
  messageGroup: TGroupedMessage
  classNames?: { wrapper?: string }
  scrollableRef?: React.RefObject<HTMLDivElement>
}) {
  const createdByUser = useAppSelector(state =>
    Object.values(state.workspace.users).find(e => e.id === messageGroup.userId)
  )

  const isOwner = useAppSelector(state => {
    return (
      state.auth.userInfo?.id === messageGroup.userId &&
      messageGroup.messages[0].type === EMessageType.Normal
    )
  })

  // useEffect(() => {
  //   if (!scrollableRef?.current) return
  //   scrollableRef.current.style.overflow = emojiId ? 'hidden' : 'auto'
  // }, [emojiId, scrollableRef])

  return (
    <div
      className={`my-3 flex gap-2 px-4 first:mt-8 ${
        isOwner ? 'justify-end' : 'justify-start'
      } ${classNames?.wrapper}`}
    >
      {!isOwner && (
        <Watching
          watchingFn={state => state.workspace.files[createdByUser?.avatarId!]}
        >
          {data => (
            <Avatar
              src={data?.path}
              size={32}
              className='ring-1 ring-offset-1'
            />
          )}
        </Watching>
      )}

      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
        {!isOwner && (
          <p className='font-medium'>
            {messageGroup.messages[0].type === EMessageType.System
              ? EMessageType.System
              : createdByUser?.userName}
          </p>
        )}

        <p className='text-xs leading-3 text-gray-500'>
          {dayjs(messageGroup.messages[0].createdAt).format(
            'YYYY-MM-DD HH:mm:ss'
          )}
        </p>
        {messageGroup.messages.map(message => (
          <MessageDetailContent message={message} isOwner={isOwner} />
        ))}
      </div>
    </div>
  )
}
