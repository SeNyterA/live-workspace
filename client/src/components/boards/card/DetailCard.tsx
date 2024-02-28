import { Modal, ScrollArea } from '@mantine/core'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { useAppEmitSocket } from '../../../services/socket/useAppEmitSocket'
import SendMessage from '../../message/SendMessage'
import Editor from '../description/Editor'
import CardTitle from './CardTitle'
import Properties from './Properties'

export default function DetailCard() {
  const { toogleCard } = useAppControlParams()
  const { cardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e._id === cardId)
  )

  const dispatch = useDispatch()
  const socketEmit = useAppEmitSocket()

  return (
    <>
      {!!cardId && !!card && (
        <Modal
          onClose={() => {
            toogleCard({})
          }}
          opened={true}
          title={<CardTitle />}
          size='100%'
          classNames={{
            content: 'h-full flex flex-col bg-gray-100 rounded-lg',
            body: 'flex-1',
            header: 'flex bg-transparent py-3',
            title: 'flex-1'
          }}
          overlayProps={{
            color: '#000',
            backgroundOpacity: 0.1,
            blur: 1
          }}
        >
          <div className='flex h-full gap-4'>
            <Properties />

            <div className='relative flex flex-1 flex-col overflow-hidden rounded-lg bg-white'>
              <ScrollArea className='absolute inset-0' scrollbarSize={6}>
                <Editor />
              </ScrollArea>
            </div>

            <div className='relative flex-1 rounded-lg bg-white p-3 px-2'>
              <ScrollArea scrollbarSize={8} className='absolute inset-0'>
                <div className='h-[1000px]'></div>
                <SendMessage
                  classNames={{ rootWrapper: 'sticky bottom-0' }}
                  targetId={card._id}
                  createMessage={async ({ files, value }) => {}}
                />
              </ScrollArea>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
