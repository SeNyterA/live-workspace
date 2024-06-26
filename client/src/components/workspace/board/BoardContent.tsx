import { ActionIcon, Divider } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useState } from 'react'
import Info from '../message/info/Info'
import BoardHeader from './BoardHeader'
import BoardProvider from './BoardProvider'
import CardsContent from './CardsContent'

export default function BoardContent() {
  const [openInfo, setOpenInfo] = useState(false)

  return (
    <BoardProvider>
      <div className='flex flex-1'>
        <div className='flex flex-1 flex-col'>
          <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
            <BoardHeader />
            <ActionIcon
              className='h-[30px] w-[30px] '
              onClick={() => setOpenInfo(e => !e)}
            >
              <IconChevronRight
                className={`h-4 w-4 transition-transform ${
                  openInfo || 'rotate-180'
                }`}
              />
            </ActionIcon>
          </div>
          <Divider variant='dashed' className='mx-4 border-gray-200/20' />
          <CardsContent />
        </div>

        {openInfo && (
          <>
            <Divider
              orientation='vertical'
              variant='dashed'
              className='border-gray-200/20'
            />
            <Info />
          </>
        )}
      </div>
    </BoardProvider>
  )
}
