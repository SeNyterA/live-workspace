import { NavLink } from '@mantine/core'
import { IconPlus, IconUsersGroup } from '@tabler/icons-react'
import { useState } from 'react'
import useAppControlParams from '../../hooks/useAppControlParams'
import useAppParams from '../../hooks/useAppParams'
import Watching from '../../redux/Watching'

export default function GroupList() {
  const { groupId } = useAppParams()
  const { switchTo } = useAppControlParams()

  const [toggle, setToggle] = useState<'createGroup'>()

  return (
    <NavLink
      className='my-1 p-1'
      label='Groups'
      leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
      active={!!groupId}
      defaultOpened={!!groupId}
    >
      <Watching watchingFn={state => Object.values(state.workspace.groups)}>
        {groups => (
          <>
            {groups?.map(item => (
              <NavLink
                key={item._id}
                className='p-1 pl-3'
                label={item.title}
                active={groupId === item._id}
                onClick={() => {
                  if (item._id)
                    switchTo({
                      target: 'group',
                      targetId: item._id
                    })
                }}
              />
            ))}
          </>
        )}
      </Watching>

      <NavLink
        className='mb-2 p-1 pl-3 opacity-70'
        label={`Create group`}
        rightSection={<IconPlus size={14} />}
        onClick={() => {
          setToggle('createGroup')
        }}
      />
    </NavLink>
  )
}
