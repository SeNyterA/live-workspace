import {
  Avatar,
  Divider,
  Indicator,
  ScrollArea,
  Select,
  Table
} from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useAppSelector } from '../../redux/store'
import { EMemberRole } from '../../types/workspace.type'
import { useSetting } from './TeamSetting'

const getEditableRoles = (
  operatorRole?: EMemberRole,
  targetRole?: EMemberRole
): EMemberRole[] => {
  if (operatorRole === EMemberRole.Owner) {
    return [EMemberRole.Owner, EMemberRole.Admin, EMemberRole.Member]
  }

  if (operatorRole === EMemberRole.Admin) {
    if (targetRole === EMemberRole.Owner) return []
    return [EMemberRole.Admin, EMemberRole.Member]
  }

  return []
}

export function TeamMemberRoles() {
  const { targetId, operatorMember, userSelected } = useSetting()
  const user = useAppSelector(state => state.workspace.users[userSelected!])

  const members =
    useAppSelector(state =>
      Object.values(state.workspace.channels)
        .concat(Object.values(state.workspace.boards))
        .filter(e => e.teamId === targetId)
        .map(target => ({
          target,
          member: Object.values(state.workspace.members).find(
            e => e.targetId === target._id && e.userId === userSelected
          )
        }))
    ) || []

  const rows = useMemo(() => {
    return members.map(({ target, member }) => (
      <Table.Tr key={target._id}>
        <Table.Td>
          <div className='font-semibold'>
            <span className='mr-1 border-r pr-1'>{target?.title}</span>

            <span className='text-xs font-normal text-blue-500'>
              {member?.type}
            </span>
          </div>
          <p className='text-xs text-gray-600'>{target._id}</p>
        </Table.Td>
        <Table.Td>
          {getEditableRoles(operatorMember?.role, member?.role).length !== 0 ? (
            <Select
              data={getEditableRoles(operatorMember?.role, member?.role)}
              value={member?.role}
              variant='unstyled'
              allowDeselect={false}
            />
          ) : (
            <p>{member?.role}</p>
          )}
        </Table.Td>

        <Table.Td>{dayjs(member?.createdAt).format('DD/MM/YYYY')}</Table.Td>
      </Table.Tr>
    ))
  }, [members])

  return (
    <div className='flex min-w-[500px] flex-col'>
      <div className='flex w-full items-center justify-end gap-2'>
        <div
          className='mt-2 flex flex-1 items-center gap-2 first:mt-0'
          key={user?._id}
        >
          <Indicator
            inline
            size={16}
            offset={3}
            position='bottom-end'
            color='yellow'
            withBorder
          >
            <Avatar src={user?.avatar} size={36} />
          </Indicator>

          <div className='flex flex-1 flex-col justify-center'>
            <p className='max-w-[150px] truncate font-medium leading-4'>
              {user?.userName}
            </p>
            <p className='leading-2 max-w-[150px] truncate text-xs text-gray-500'>
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      {/* <Divider className='my-2 mt-3' variant='dashed' /> */}
      <div className='relative flex-1'>
        <ScrollArea className='absolute inset-0'>
          <Table
            stickyHeader
            stickyHeaderOffset={0}
            striped
            withRowBorders={false}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>TargetId</Table.Th>
                <Table.Th className='w-40'>Role</Table.Th>
                <Table.Th className='w-20'>Joined At</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  )
}
