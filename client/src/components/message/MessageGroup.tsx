import { Avatar, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useAppSelector } from '../../redux/store'
import { EMessageType } from '../../types/workspace.type'
import UserDetailProvider from '../user/UserDetailProvider'
import { TGroupedMessage } from './MessageContentProvider'

export default function MessageGroup({
  messageGroup
}: {
  messageGroup: TGroupedMessage
}) {
  const createdByUser = useAppSelector(state =>
    Object.values(state.workspace.users).find(
      e => e._id === messageGroup.userId
    )
  )

  const isOwner = useAppSelector(
    state =>
      state.auth.userInfo?._id === messageGroup.userId &&
      messageGroup.type === EMessageType.Normal
  )

  return (
    <div
      className={`my-3 flex gap-2 px-4 ${
        isOwner ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isOwner && (
        <UserDetailProvider user={createdByUser}>
          <Avatar />
        </UserDetailProvider>
      )}

      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
        {!isOwner && (
          <p className='font-medium'>
            {messageGroup.type === EMessageType.System
              ? EMessageType.System
              : createdByUser?.userName}
          </p>
        )}

        <p className='text-xs leading-3 text-gray-500'>
          {dayjs(messageGroup.messages[0].createdAt).format(
            'YYYY-MM-DD HH:mm:ss'
          )}

          {/* {`@${createdByUser?.userName}`} */}
        </p>
        {messageGroup.messages.map(message => (
          <Tooltip
            key={message._id}
            label={dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            position='right'
            className='bg-white text-xs leading-3 text-gray-500'
          >
            <div
              key={message._id}
              className='mt-1 w-fit rounded bg-gray-50 p-1'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(message.content)
              }}
            />
          </Tooltip>
        ))}

        {/* <p className='text-xs leading-3 text-gray-500'>
          {dayjs(
            messageGroup.messages[messageGroup.messages.length - 1].createdAt
          ).format('YYYY-MM-DD HH:mm:ss')}
        </p> */}
      </div>
    </div>
  )
}
