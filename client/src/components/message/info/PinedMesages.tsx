import { Avatar, Badge, Divider, NavLink } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import useAppParams from '../../../hooks/useAppParams'
import Watching from '../../../redux/Watching'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { updateLabelMention } from '../../../utils/helper'
import UserDetailProvider from '../../user/UserDetailProvider'

export default function PinedMesages() {
  const { channelId, groupId, directId } = useAppParams()
  const workspaceId = channelId || groupId || directId
  const { data: pinedMessages } = useAppQuery({
    key: 'workpsacePinedMessages',
    url: {
      baseUrl: 'workspaces/:workspaceId/messages/pined',
      urlParams: { workspaceId: workspaceId! }
    },
    options: {
      enabled: !!workspaceId
    }
  })
  console.log({ pinedMessages })

  return (
    <NavLink
      className='mt-1 p-1 pl-0'
      label={
        <div className='flex items-center justify-between'>
          Pined messages
          {pinedMessages?.length && (
            <Badge variant='light' color='gray'>
              {pinedMessages.length}
            </Badge>
          )}
        </div>
      }
      onClick={() => {}}
      classNames={{ children: 'pl-0' }}
    >
      {pinedMessages?.map(message => (
        <>
          <Watching
            key={message._id}
            watchingFn={state => state.workspace.users[message.createdById]}
          >
            {createBy => (
              <div className='flex gap-2 rounded'>
                <UserDetailProvider user={createBy}>
                  <Avatar src={createBy?.avatar} />
                </UserDetailProvider>
                <div className='flex-1'>
                  <p className='font-medium'>
                    {createBy?.userName || 'Senytera'}
                  </p>
                  <p className='text-xs'>
                    {dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                  <div
                    className='mt-1 rounded bg-gray-100 p-1 text-sm'
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        generateHTML(updateLabelMention(message.content), [
                          StarterKit,
                          Underline,
                          Link,
                          Highlight,
                          TextAlign,
                          Mention
                        ])
                      )
                    }}
                  />
                </div>
              </div>
            )}
          </Watching>
          <Divider className='my-2' variant='dashed'/>
        </>
      ))}
    </NavLink>
  )
}
