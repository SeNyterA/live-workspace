import { Avatar } from '@mantine/core'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useAppSelector } from '../../redux/store'
import { EMessageType, TMessage } from '../../types/workspace.type'

export default function Message({ message }: { message: TMessage }) {
  const createdByUser = useAppSelector(
    state => state.workspace.users[message.createdById]
  )

  // const listUserIdsReaded = useAppSelector(state => {
  //   const keys = Object.values(state.workspace.userReadedMessages).filter(e =>
  //     e.includes(`${message.messageReferenceId}`)
  //   )

  //   return keys
  // })

  const isOwner = useAppSelector(
    state =>
      state.auth.userInfo?._id === message.createdById &&
      message.messageType === EMessageType.Normal
  )

  return (
    <div
      id={`id_${message._id}`}
      className={`my-3 flex gap-2 px-4 ${
        isOwner ? 'justify-end' : 'justify-start'
      }`}
      onClick={e => console.log(e)}
    >
      {!isOwner && <Avatar />}

      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
        {!isOwner && (
          <p className='font-medium'>
            {message.messageType === EMessageType.System
              ? EMessageType.System
              : createdByUser?.userName}
          </p>
        )}

        <p className='text-xs leading-3 text-gray-500'>
          {dayjs(message.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
        </p>
        <div
          className='mt-1 w-fit rounded bg-gray-50 p-1'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(message.content)
          }}
        />
      </div>
    </div>
  )
}
