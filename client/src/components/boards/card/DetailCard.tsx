import { Modal, Tabs } from '@mantine/core'
import { IconMessageCircle, IconPhoto } from '@tabler/icons-react'
import { useState } from 'react'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import CardTitle from './CardTitle'
import Descriptions from './Descriptions'
import Properties from './Properties'

export default function DetailCard() {
  const { toogleCard } = useAppControlParams()
  const { cardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e._id === cardId)
  )
  const [tab, setTabs] = useState<'description' | 'comment'>('description')

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
            content: 'h-full flex flex-col bg-gray-100',
            body: 'flex-1',
            header: 'flex bg-transparent py-3',
            title: 'flex-1'
          }}
          overlayProps={{
            color: '#000',
            backgroundOpacity: 0.35,
            blur: 15
          }}
        >
          <div className='flex h-full gap-4'>
            <div className='relative w-80'>
              <Properties />
            </div>

            <div className='flex flex-1 flex-col rounded-lg bg-white px-3 py-2'>
              <Tabs value={tab} onChange={tab => setTabs(tab as any)}>
                <Tabs.List>
                  <Tabs.Tab
                    value='description'
                    className='font-semibold'
                    leftSection={<IconPhoto size={20} />}
                  >
                    Description
                  </Tabs.Tab>
                  <Tabs.Tab
                    value='comment'
                    className='font-semibold'
                    leftSection={<IconMessageCircle size={20} />}
                  >
                    Messages
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>

              <div className='relative flex-1 text-sm'>
                {tab === 'description' && <Descriptions card={card} />}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
