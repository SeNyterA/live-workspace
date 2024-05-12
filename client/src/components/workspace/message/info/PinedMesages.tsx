import { userInfo } from 'os'
import { Avatar, Badge, Divider, Loader, NavLink } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useDispatch } from 'react-redux'
import { Fragment } from 'react/jsx-runtime'
import useAppParams from '../../../../hooks/useAppParams'
import { workspaceActions } from '../../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../../redux/store'
import Watching from '../../../../redux/Watching'
import { useAppQuery } from '../../../../services/apis/useAppQuery'
import { updateLabelMention } from '../../../../utils/helper'
import UserAvatar from '../../../common/UserAvatar'
import Attachments from '../detail/Attachments'
import { IconPin, IconPinned } from '@tabler/icons-react'

export default function PinedMesages() {
  const { channelId, groupId, directId } = useAppParams()
  const workspaceId = channelId || groupId || directId
  const dispatch = useDispatch()
  const { isPending } = useAppQuery({
    key: 'workpsacePinedMessages',
    url: {
      baseUrl: 'workspaces/:workspaceId/messages/pined',
      urlParams: { workspaceId: workspaceId! }
    },
    options: {
      enabled: !!workspaceId
    },
    onSuccess(messages) {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          messages: messages.reduce(
            (acc, cur) => ({ ...acc, [cur.id]: cur }),
            {}
          )
        })
      )
    }
  })

  const pinedMessages = useAppSelector(state =>
    Object.values(state.workspace.messages)
      .filter(e => e.isPinned && e.workspaceId === workspaceId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
  )

  return (
    <NavLink
      variant='indicator'
      defaultOpened={true}
      data-info
      leftSection={<IconPinned className='scale-90' size={20} />}
      className='sticky top-0 z-[2] h-8 p-1 pl-0'
      classNames={{
        children: 'pl-0 mb-2 mt-1',
        section: 'data-[position="left"]:me-[8px]'
      }}
      label={
        <Badge
          rightSection={
            <span>{pinedMessages?.length! > 0 && pinedMessages!.length}</span>
          }
          classNames={{
            root: 'p-0 rounded-none bg-transparent flex-1 flex',
            label: 'flex-1',
            section: 'data-[position="left"]:me-[8px]'
          }}
        >
          Pined Messages
        </Badge>
      }
    >
      {pinedMessages?.map((message, index) => (
        <Fragment key={message.id}>
          <Watching
            key={message.id}
            watchingFn={state => state.workspace.users[message.createdById!]}
          >
            {createBy => (
              <div className='flex gap-2 rounded first:mt-2'>
                <UserAvatar user={createBy} />

                <div className='flex-1'>
                  <p className='font-medium'>
                    {createBy?.userName || 'Senytera'}
                  </p>
                  <p className='text-xs '>
                    {dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                  <div
                    className='mt-1 rounded text-sm'
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
                  <Attachments messageId={message.id} />
                </div>
              </div>
            )}
          </Watching>
          {index < pinedMessages.length - 1 && (
            <Divider className='my-2 border-gray-200/20' variant='dashed' />
          )}
        </Fragment>
      ))}
    </NavLink>
  )
}
