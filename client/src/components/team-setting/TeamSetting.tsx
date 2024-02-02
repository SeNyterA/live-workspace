import { Divider, Modal, NavLink } from '@mantine/core'
import { IconMessage } from '@tabler/icons-react'
import { useState } from 'react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import MembersManager from './MembersManager'

export default function TeamSetting({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { teamId } = useAppParams()
  const [mode, setMode] = useState<'info' | 'members'>('info')
  const team = useAppSelector(e => e.workspace.teams[teamId!])

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size='100%'
      classNames={{
        content: 'h-full flex flex-col',
        body: 'flex-1'
      }}
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.35,
        blur: 15
      }}
      title={
        <p>
          <span>Setting</span>{' '}
          <span className='bg-slate-400'>{`${team?.title}`}</span>
        </p>
      }
    >
      <div className='flex h-full w-full gap-3'>
        <div className='w-72'>
          <NavLink
            className='my-1 p-1'
            label='Infomation'
            leftSection={<IconMessage size='1rem' stroke={1.5} />}
            onClick={() => setMode('info')}
            active={mode === 'info'}
          />
          <NavLink
            className='my-1 p-1'
            label='Members manager'
            leftSection={<IconMessage size='1rem' stroke={1.5} />}
            onClick={() => setMode('members')}
            active={mode === 'members'}
          />
        </div>
        <Divider orientation='vertical' variant='dashed' />

        <div className='flex-1'>
          <MembersManager />
        </div>
      </div>
    </Modal>
  )
}
