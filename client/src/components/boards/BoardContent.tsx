import { ActionIcon, Divider } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useState } from 'react'
import BoardHeader from './BoardHeader'
import BoardProvider from './BoardProvider'
import CardsContent from './CardsContent'
import Info from '../message/info/Info'

export default function BoardContent() {
  const [openInfo, setOpenInfo] = useState(false)

  return (
    <BoardProvider>
      <div className='flex flex-1'>
        <div className='flex flex-1 flex-col'>
          <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
            <BoardHeader />
            <ActionIcon
              variant='light'
              className='h-[30px] w-[30px] bg-gray-100'
              onClick={() => setOpenInfo(e => !e)}
            >
              <IconChevronRight
                className={`h-4 w-4 transition-transform ${
                  openInfo || 'rotate-180'
                }`}
              />
            </ActionIcon>
          </div>
          <Divider variant='dashed' />
          <CardsContent />
        </div>

        {openInfo && (
          <>
            <Divider orientation='vertical' variant='dashed' />
            <Info />
          </>
        )}
      </div>
    </BoardProvider>
  )
}
