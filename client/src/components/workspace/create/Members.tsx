import {
  Avatar,
  CheckIcon,
  Combobox,
  Loader,
  ScrollArea,
  TextInput,
  TextInputProps,
  useCombobox
} from '@mantine/core'
import { useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { EMemberRole, extractApi } from '../../../types'
import { useCreateWorkspaceForm } from './CreateWorkspace'
import MemberControl from './MemberControl'
import './userCombobox.module.css'

function UserCombobox({
  usersSelectedId = [],
  onPick,
  textInputProps
}: {
  usersSelectedId?: string[]
  onPick?: (userId: string) => void
  textInputProps?: TextInputProps
}) {
  const userId = useAppSelector(state => state.auth.userInfo?.id)
  const combobox = useCombobox({
    onDropdownClose: () => {}
  })
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const { data: userData, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: {
        keyword: searchValue
      }
    },
    options: {
      // enabled: !!searchValue && searchValue.length > 2
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
    <Combobox
      onOptionSubmit={value => {
        onPick && onPick(value)
        // combobox.closeDropdown()
      }}
      store={combobox}
      position='top-start'
      classNames={{
        dropdown: '!bg-gray-900/90  border-gray-400/20',
        option: ''
      }}
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
          rightSection={isLoading && <Loader size='xs' />}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options style={{ overflowY: 'auto' }}>
          <ScrollArea.Autosize scrollbarSize={8} mah={230}>
            {!userData || userData?.users.length === 0 ? (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            ) : (
              userData?.users
                .filter(e => userId !== e.id)
                .map(item => (
                  <Combobox.Option value={item.id} key={item.id}>
                    <div
                      className='mt-3 flex flex-1 items-center gap-2 first:mt-0'
                      key={item.id}
                    >
                      <Avatar src={item.avatar?.path} />
                      <div className='flex flex-1 flex-col justify-center'>
                        <p className='font-medium leading-5'>{item.userName}</p>
                        <p className='text-xs leading-3 '>
                          {item.email}
                        </p>
                      </div>
                      {usersSelectedId.includes(item.id) && (
                        <CheckIcon size={12} />
                      )}
                    </div>
                  </Combobox.Option>
                ))
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

const Members = () => {
  const { control } = useCreateWorkspaceForm()
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'members'
  })

  return (
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
          className: 'mt-2',
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
