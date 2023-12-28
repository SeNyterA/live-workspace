import { Avatar, Image, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useAppSelector } from '../../redux/store'
import { EMessageType } from '../../types/workspace.type'
import { groupByFileType } from '../new-message/helper'
import { MessageStyle } from '../new-message/style'
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

      <MessageStyle
        className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
      >
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
        {messageGroup.messages.map(message => {
          const { files, images } = groupByFileType(message.attachments || [])
          return (
            // <Tooltip
            //   key={message._id}
            //   label={dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            //   position={isOwner ? 'bottom-end' : 'bottom-start'}
            //   offset={2}
            //   className='bg-gray-400 text-xs leading-3 text-white'
            // >
            <div className='mt-1 w-fit max-w-3xl rounded bg-gray-50 p-1'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(message.content)
                }}
              />
              {images.map(img => (
                <Image key={img.url} className='rounded' src={img.url} />
              ))}
            </div>
            // </Tooltip>
          )
        })}

        {/* <p className='text-xs leading-3 text-gray-500'>
          {dayjs(
            messageGroup.messages[messageGroup.messages.length - 1].createdAt
          ).format('YYYY-MM-DD HH:mm:ss')}
        </p> */}
      </MessageStyle>
    </div>
  )
}
