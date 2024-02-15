import { Divider, Modal, NavLink } from '@mantine/core'
import { IconInfoHexagon, IconMessage } from '@tabler/icons-react'
import { createContext, useContext, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { TMember } from '../../types/workspace.type'
import EditInfo from './EditInfo'
import MembersManager from './MembersManager'

type TSetting = {
  targetId: string
  type: 'team' | 'channel' | 'group' | 'board'
  operatorMember?: TMember
}

const settingContext = createContext<TSetting>({ targetId: '', type: 'team' })
export const useSetting = () => useContext(settingContext)

export default function TeamSetting({
  isOpen,
  onClose,
  type,
  targetId
}: {
  isOpen: boolean
  onClose: () => void
} & TSetting) {
  const [mode, setMode] = useState<'info' | 'members'>('info')
  const target = useAppSelector(
    e =>
      e.workspace.teams[targetId!] ||
      e.workspace.channels[targetId!] ||
      e.workspace.groups[targetId!] ||
      e.workspace.boards[targetId!]
  )

  const operatorMember = useAppSelector(state =>
    Object.values(state.workspace.members).find(
      e => state.auth.userInfo?._id === e.userId && e.targetId === targetId
    )
  )

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
          <span>{`Setting ${type}`}</span>{' '}
          <span className='bg-slate-400'>{`${target?.title}`}</span>
        </p>
      }
    >
      <settingContext.Provider
        value={{ targetId: targetId, type, operatorMember }}
      >
        <div className='flex h-full w-full gap-3'>
          <div className='w-56'>
            <NavLink
              className='my-1 p-1'
              label='Infomation'
              leftSection={<IconInfoHexagon size='1rem' stroke={1.5} />}
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
            {mode === 'members' && <MembersManager />}
            {mode === 'info' && <EditInfo />}
          </div>
        </div>
      </settingContext.Provider>
    </Modal>
  )
}
