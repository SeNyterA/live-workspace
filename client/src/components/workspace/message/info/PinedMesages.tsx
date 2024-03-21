import {
  Avatar,
  Badge,
  Divider,
  Loader,
  NavLink,
  ScrollArea
} from '@mantine/core'
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
import useAppParams from '../../../../hooks/useAppParams'
import { workspaceActions } from '../../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../../redux/store'
import Watching from '../../../../redux/Watching'
import { useAppQuery } from '../../../../services/apis/useAppQuery'
import { updateLabelMention } from '../../../../utils/helper'

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
    onSucess(messages) {
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
    Object.values(state.workspace.messages).filter(e => e.isPinned)
  )

  return (
    <NavLink
      className='sticky top-0 z-[2] mt-1 bg-white p-1 pl-0'
      label={
        <div className='flex items-center justify-between gap-1'>
          <p className='flex-1'>Pined messages</p>
          {pinedMessages!.length > 0 && (
            <Badge variant='light' color='gray'>
              {pinedMessages!.length}
            </Badge>
          )}
          {isPending && <Loader size={10} />}
        </div>
      }
      onClick={() => {}}
      classNames={{
        children:
          'pl-0 border-0 border-b border-dashed border-gray-200 pb-2 mb-4'
      }}
    >
      {pinedMessages?.map((message, index) => (
        <>
          <Watching
            key={message.id}
            watchingFn={state => ({
              ...state.workspace.users[message.createdById!],
              avatar:
                state.workspace.files[
                  state.workspace.users[message.createdById!].avatarId!
                ]
            })}
          >
            {createBy => (
              <div className='flex gap-2 rounded first:mt-2'>
                <Avatar src={createBy?.avatar?.path} />

                <div className='flex-1'>
                  <p className='font-medium'>
                    {createBy?.userName || 'Senytera'}
                  </p>
                  <p className='text-xs'>
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
                </div>
              </div>
            )}
          </Watching>
          {index < pinedMessages.length - 1 && (
            <Divider className='my-2' variant='dashed' />
          )}
        </>
      ))}
    </NavLink>
  )
}
