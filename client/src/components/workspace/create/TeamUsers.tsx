import {
  Avatar,
  CheckIcon,
  Combobox,
  Group,
  Radio,
  ScrollArea,
  TextInput,
  TextInputProps,
  useCombobox
} from '@mantine/core'
import { memo, useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import Watching from '../../../redux/Watching'
import { EMemberRole, EWorkspaceStatus, TMember, TUser } from '../../../types'
import MemberRole from '../../common/MemberRole'
import { useCreateWorkspaceForm } from './CreateWorkspace'
import MemberControl from './MemberControl'

const Option = memo(
  ({
    user,
    member,
    selected
  }: {
    user: TUser
    member: TMember
    selected: boolean
  }) => {
    return (
      <Combobox.Option value={user.id} key={user.id}>
        <div className='mt-3 flex flex-1 items-center gap-2 first:mt-0'>
          <Watching watchingFn={state => state.workspace.files[user.avatarId!]}>
            {avatar => <Avatar src={avatar?.path} size={32} />}
          </Watching>
          <div className='flex flex-1 flex-col justify-center'>
            <p className='font-medium leading-5'>{user.userName}</p>
            <p className='text-xs leading-3 '>{user.email}</p>
          </div>

          <MemberRole member={member} />

          {selected && <CheckIcon size={12} />}
        </div>
      </Combobox.Option>
    )
  }
)

const UserCombobox = memo(
  ({
    usersSelectedId = [],
    onPick,
    textInputProps
  }: {
    usersSelectedId?: string[]
    onPick?: (userId: string) => void
    textInputProps?: TextInputProps
  }) => {
    const { teamId } = useAppParams()
    const teamMembers =
      useAppSelector(state =>
        Object.values(state.workspace.members)
          .filter(
            e =>
              e.workspaceId === teamId && e.userId !== state.auth.userInfo?.id
          )
          .map(member => ({
            member,
            user: state.workspace.users[member.userId]
          }))
      ) || []

    const combobox = useCombobox({
      onDropdownClose: () => {}
    })
    const [searchValue, setSearchValue] = useState('')

    return (
      <Combobox
        onOptionSubmit={value => {
          onPick && onPick(value)
          // combobox.closeDropdown()
        }}
        store={combobox}
        position='top-start'
      >
        <Combobox.Target>
          <TextInput
            {...textInputProps}
            value={searchValue}
            onChange={event => {
              setSearchValue(event.currentTarget.value)
              combobox.openDropdown()
              combobox.updateSelectedOptionIndex()
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
          />
        </Combobox.Target>

        <Combobox.Dropdown className='border-1 shadow-sm'>
          <Combobox.Options style={{ overflowY: 'auto' }}>
            <ScrollArea.Autosize scrollbarSize={8} mah={400}>
              {teamMembers.length === 0 ? (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              ) : (
                teamMembers.map(({ member, user }) => (
                  <Option
                    user={user}
                    member={member}
                    selected={usersSelectedId.includes(user.id)}
                  />
                ))
              )}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    )
  }
)

export const TeamUsers = memo(() => {
  const { control } = useCreateWorkspaceForm()
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'members'
  })
  return (
    <>
      <Controller
        control={control}
        name='workspace.status'
        render={({ field: { value, onChange } }) => (
          <>
            <Radio.Group
              name='favoriteFramework'
              label='Select your favorite framework/library'
              description='This is anonymous'
              withAsterisk
              className='sticky mt-4'
              value={value}
              onChange={onChange}
            >
              <Group mt='xs'>
                <Radio
                  value={EWorkspaceStatus.Private}
                  label='Private'
                  labelPosition='right'
                  classNames={{
                    body: 'flex gap-1',
                    description: 'mt-0',
                    inner: 'order-[0]'
                  }}
                  description='Only members can access'
                />
                <Radio
                  value={EWorkspaceStatus.Public}
                  label='Public'
                  labelPosition='right'
                  classNames={{
                    body: 'flex gap-1',
                    description: 'mt-0',
                    inner: 'order-[0]'
                  }}
                  description='Invite all team members to join'
                />
              </Group>
            </Radio.Group>

            {value === EWorkspaceStatus.Private && (
              <>
                <UserCombobox
                  usersSelectedId={fields?.map(e => e.userId) || []}
                  onPick={userId => {
                    const idx = fields?.findIndex(e => e.userId === userId)
                    if (idx < 0) {
                      append({
                        userId,
                        role: EMemberRole.Member
                      } as any)
                    } else {
                      remove(idx)
                    }
                  }}
                  textInputProps={{
                    label: 'Add Members',
                    description: 'Type to search and add members to the team',
                    placeholder: 'Search and select members...',
                    className: 'mt-4',
                    classNames: {
                      input: 'border-gray-100 border-none  '
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
                        member={{ ...member, role: value } as any}
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
            )}
          </>
        )}
      />
    </>
  )
})
