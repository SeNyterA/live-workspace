import dayjs from 'dayjs'
import { useAppSelector } from '../../../redux/store'
import { EMessageType } from '../../../types'
import UserAvatar from '../../common/UserAvatar'
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
      className={`my-3 flex gap-2 px-4 ${
        isOwner ? 'justify-end' : 'justify-start'
      } ${classNames?.wrapper}`}
    >
      {!isOwner && <UserAvatar user={createdByUser} />}

      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
        {!isOwner && (
          <p className='font-medium'>
            {messageGroup.messages[0].type === EMessageType.System
              ? EMessageType.System
              : createdByUser?.nickName || createdByUser?.userName}
          </p>
        )}

        <p className='text-xs leading-3 '>
          {dayjs(messageGroup.messages[0].createdAt).format(
            'YYYY-MM-DD HH:mm:ss'
          )}
        </p>
        {messageGroup.messages.map(message => (
          <MessageDetailContent
            key={message.id}
            message={message}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  )
}
