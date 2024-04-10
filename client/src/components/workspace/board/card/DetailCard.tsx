import { Modal, ScrollArea } from '@mantine/core'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../../hooks/useAppControlParams'
import useAppParams from '../../../../hooks/useAppParams'
import { useAppSelector } from '../../../../redux/store'
import { useAppEmitSocket } from '../../../../services/socket/useAppEmitSocket'
import Editor from '../description/Editor'
import CardTitle from './CardTitle'
import Properties from './Properties'

export default function DetailCard() {
  const { toogleCard } = useAppControlParams()
  const { cardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e.id === cardId)
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
          overlayProps={{
            blur: '0.5'
          }}
          classNames={{
            title: 'flex-1',
            header: 'bg-transparent',
            content: 'rounded-lg flex flex-col bg-black/80 h-full aspect-video',
            inner: 'p-12',
            body: 'flex flex-col flex-1 relative text-sm h-full',
            root: ''
          }}
        >
          <div className='flex h-full gap-4'>
            <Properties />

            <div className='card-detail-wrapper relative flex flex-1 flex-col overflow-hidden rounded-lg'>
              <ScrollArea className='absolute inset-0' scrollbarSize={6}>
                <Editor card={card} />
              </ScrollArea>
            </div>

            {/* <div className='relative flex-1 rounded-lg p-3 px-2'>
              <ScrollArea scrollbarSize={8} className='absolute inset-0'>
                <div className='h-[1000px]'></div>
                <SendMessage
                  classNames={{ rootWrapper: 'sticky bottom-0' }}
                  targetId={card.id}
                  createMessage={async ({ files, value }) => {}}
                />
              </ScrollArea>
            </div> */}
          </div>
        </Modal>
      )}
    </>
  )
}
