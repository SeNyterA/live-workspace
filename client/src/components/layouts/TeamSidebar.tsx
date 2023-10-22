import { ActionIcon, Button, Divider, NavLink, ScrollArea } from '@mantine/core'
import {
  IconAdjustments,
  IconArrowRight,
  IconPlus,
  IconSearch
} from '@tabler/icons-react'
import { useLocation } from 'react-router-dom'
import useAppParams from '../../hooks/useAppParams'
import useControlParams from '../../hooks/useControlParams'
import useGetApi from '../../services/apis/useGetApi'
import { intData } from './data.test'

export default function TeamSidebar() {
  const { boardId, channelId, groupId, messageId } = useAppParams()
  const { switchTo } = useControlParams()
  const path = useLocation()

  const { data } = useGetApi()
  console.log({ data })

  return (
    <div className='w-72 flex py-3 flex-col gap-2'>
      <p className='text-xl px-4'>Team name </p>
      <div className='flex gap-2 items-center justify-center px-4'>
        <Button
          variant='default'
          size='xs'
          className='flex-1'
          leftSection={<IconSearch size={14} />}
          rightSection={<IconArrowRight size={14} />}
        >
          <p>Search on team</p>
        </Button>
        <ActionIcon
          variant='default'
          aria-label='Settings'
          className='w-[30px] h-[30px]'
        >
          <IconAdjustments
            style={{ width: '70%', height: '70%' }}
            stroke={1.5}
          />
        </ActionIcon>
      </div>

      <Divider className='mx-4' />

      <div className='flex-1 relative'>
        <ScrollArea scrollbarSize={6} className='inset-0 absolute px-4'>
          {intData.map(group => (
            <NavLink
              key={group.id}
              className='p-1'
              label={group.title}
              leftSection={group.icon}
              active={path.pathname.includes(group.type)}
            >
              {group.children.map(item => (
                <NavLink
                  key={item.id}
                  className='p-1'
                  label={item.title}
                  active={
                    (groupId || channelId || boardId || messageId) === item.id
                  }
                  onClick={() => {
                    switchTo({
                      target: group.type as any,
                      targetId: item.id
                    })
                  }}
                />
              ))}

              <NavLink
                className='p-1 opacity-70'
                label={`Create ${group.type}`}
                rightSection={<IconPlus size={14} />}
              />

              {/* <NavLink className='p-1' label='Nested parent link'>
                <NavLink className='p-1' label='First child link' />
                <NavLink className='p-1' label='Second child link' />
                <NavLink className='p-1' label='Third child link' />
              </NavLink> */}
            </NavLink>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
