import { Drawer, ScrollArea } from '@mantine/core'
import { Fragment } from 'react'
import { useLayout } from '../../../Layout'
import { useAppSelector } from '../../../redux/store'
import { groupMessages } from '../MessageContentProvider'
import MessageGroup from '../MessageGroup'
import SendMessage from '../SendMessage'

export default function Thread() {
  const { thread, updateThread } = useLayout()
  const threadMessages = useAppSelector(state =>
    Object.values(state.workspace.messages).filter(
      m => m._id === thread?.threadId || m.replyRootId === thread?.threadId
    )
  )

  if (!thread) return <Fragment />

  return (
    <Drawer
      onClose={() => {
        updateThread(undefined)
      }}
      opened={!!thread}
      title={<p className='text-lg font-semibold'>Thread</p>}
      position='right'
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1 px-0 pb-2'
      }}
    >
      <div className='relative flex-1'>
        <ScrollArea className='absolute inset-0'   scrollbarSize={8} >
          {groupMessages(threadMessages || []).map(groupMessage => (
            <MessageGroup
              // classNames={{ wrapper: '!px-0' }}
              key={groupMessage.messages[0]._id}
              messageGroup={groupMessage}
            />
          ))}
        </ScrollArea>
      </div>
      <SendMessage
        classNames={{
          editorWrapper: '!left-4 !right-4',
          infoWrapper: '!left-4 !right-4'
        }}
        targetId={thread.targetId}
        targetType={thread.targetType}
        thread={thread}
      />
    </Drawer>
  )
}
