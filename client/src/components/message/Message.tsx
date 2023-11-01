import { Avatar } from '@mantine/core'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useAppSelector } from '../../redux/store'
import { EMessageType, TMessage } from '../../types/workspace.type'

export default function Message({ message }: { message: TMessage }) {
  const createByUser = useAppSelector(
    state => state.workspace.users[message.createdById]
  )

  const isOwner = useAppSelector(
    state =>
      state.auth.userInfo?._id === message.createdById &&
      message.messageType === EMessageType.Normal
  )

  return (
    <div
      id={`id_${message._id}`}
      className={`my-3 flex gap-2 px-4 ${isOwner && 'justify-end'}`}
    >
      {isOwner || <Avatar />}

      <div className={`flex flex-col ${isOwner && 'items-end'}`}>
        {isOwner || (
          <p className='font-medium'>
            {message.messageType === EMessageType.System
              ? EMessageType.System
              : createByUser?.userName}
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
