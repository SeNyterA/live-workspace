import { ActionIcon, Avatar, Loader, Select } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import Watching from '../../../redux/Watching'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { EMemberRole, extractApi, TMember, TUserExtra } from '../../../types'
import { useCreateWorkspaceForm } from './CreateWorkspace'

const MemberControl = ({
  member,
  onChange,
  onRemove
}: {
  member: Pick<TMember, 'userId' | 'role'>
  onChange?: (role: EMemberRole) => void
  onRemove?: () => void
}) => {
  const user = useAppSelector(state =>
    Object.values(state.workspace.users).find(e => e.id === member.userId)
  )

  return (
    <div
      className='mt-2 flex flex-1 items-center gap-2 rounded p-2 py-1 pr-0 first:mt-0'
      key={user?.id}
    >
      <Watching watchingFn={state => state.workspace.files[user?.avatarId!]}>
        {data => <Avatar src={data?.path} size={32} />}
      </Watching>

      <div className='flex flex-1 flex-col justify-center'>
        <p className='truncate font-medium leading-5'>{user?.userName}</p>
        <p className='truncate text-xs leading-3 '>{user?.email}</p>
      </div>

      <ActionIcon
        className='h-[30px] w-[30px] '
        color='gray'
        onClick={onRemove}
      >
        <IconX size={12} />
      </ActionIcon>
    </div>
  )
}

const Members = () => {
  const { control } = useCreateWorkspaceForm()
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'members'
  })

  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const { data, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: {
        keyword: searchValue
      }
    },
    options: {
      enabled: !!searchValue && searchValue.length > 1
    },
    onSuccess(data) {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            users: data.users
          })
        )
      )
    }
  })

  return (
    <>
      <Select
        label='Add Members'
        searchable
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        description='Type to search and add members to the team'
        placeholder='Search and select members...'
        className='mt-2'
        data={data?.users.map(e => ({
          value: e.id,
          label: e.userName,
          user: e
        }))}
        value={null}
        rightSection={isLoading && <Loader size={14} />}
        renderOption={e => {
          const user = (e.option as any).user as TUserExtra
          return (
            <div
              className='mt-3 flex flex-1 items-center gap-2 first:mt-0'
              key={e.option.value}
            >
              <Avatar src={user?.avatar?.path} />
              <div className='flex flex-1 flex-col justify-center'>
                <p className='font-medium leading-5'>{user.userName}</p>
                <p className='text-xs leading-3 '>{user.email}</p>
              </div>
            </div>
          )
        }}
        onChange={id => {
          if (fields.every(e => e.id !== id) && !!id) {
            append({
              userId: id,
              role: EMemberRole.Member
            })
            setSearchValue('')
          }
        }}
      />

      {fields?.map((member, index) => (
        <Controller
          key={member.id}
          control={control}
          name={`members.${index}.role`}
          render={({ field: { value, onChange } }) => (
            <MemberControl
              member={{ ...member, role: value }}
              onChange={role => {
                onChange(role)
              }}
              onRemove={() => {
                remove(index)
              }}
            />
          )}
        />
      ))}
    </>
  )
}
export default Members
