import {
  Avatar,
  CheckIcon,
  Combobox,
  ScrollArea,
  TextInput,
  TextInputProps,
  useCombobox
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useState } from 'react'
import useAppParams from '../../../../../hooks/useAppParams'
import { useAppSelector } from '../../../../../redux/store'
import './userCombobox.module.css'

export default function UserCombobox({
  usersSelectedId = [],
  onPick,
  textInputProps
}: {
  usersSelectedId?: string[]
  onPick?: (userId: string) => void
  textInputProps?: TextInputProps
  targetId: string
}) {
  const combobox = useCombobox({
    onDropdownClose: () => {}
  })
  const userId = useAppSelector(state => state.auth.userInfo?._id)
  const [searchValue, setSearchValue] = useState('')
  const [keyword] = useDebouncedValue(searchValue, 200)
  const { teamId } = useAppParams()

  const users = useAppSelector(state => {
    const _userId = Object.values(state.workspace.members)
      .filter(e => e.targetId === teamId)
      .map(e => e.userId)

    return Object.values(state.workspace.users).filter(
      user =>
        _userId.includes(user._id) &&
        [user.email, user.nickName, user.userName].some(
          key => key?.includes(keyword)
        )
    )
  })

  return (
    <Combobox
      onOptionSubmit={value => {
        onPick && onPick(value)
        // combobox.closeDropdown()
      }}
      store={combobox}
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

      <Combobox.Dropdown>
        <Combobox.Options style={{ overflowY: 'auto' }}>
          <ScrollArea.Autosize scrollbarSize={8} mah={230}>
            {!users || users.length === 0 ? (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            ) : (
              users
                .filter(e => userId !== e._id)
                .map(item => (
                  <Combobox.Option value={item._id} key={item._id}>
                    <div
                      className='mt-3 flex flex-1 items-center gap-2 first:mt-0'
                      key={item._id}
                    >
                      <Avatar src={item.avatar?.path} />
                      <div className='flex flex-1 flex-col justify-center'>
                        <p className='font-medium leading-5'>{item.userName}</p>
                        <p className='text-xs leading-3 text-gray-500'>
                          {item.email}
                        </p>
                      </div>
                      {usersSelectedId.includes(item._id) && (
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
