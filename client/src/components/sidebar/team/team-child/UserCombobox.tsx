import {
  Avatar,
  CheckIcon,
  Combobox,
  ScrollArea,
  TextInput,
  TextInputProps,
  useCombobox
} from '@mantine/core'
import { memo, useState } from 'react'
import useAppParams from '../../../../hooks/useAppParams'
import { useAppSelector } from '../../../../redux/store'
import { TMember, TUser } from '../../../../types'

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
      <Combobox.Option value={user._id} key={user._id}>
        <div className='mt-3 flex flex-1 items-center gap-2 first:mt-0'>
          <Avatar src={user?.avatar?.path} size={32} />
          <div className='flex flex-1 flex-col justify-center'>
            <p className='font-medium leading-5'>{user.userName}</p>
            <p className='text-xs leading-3 text-gray-500'>{user.email}</p>
          </div>
          <p className='rounded bg-gray-200 p-1 py-0 text-gray-600'>
            {member.role}
          </p>

          {selected && <CheckIcon size={12} />}
        </div>
      </Combobox.Option>
    )
  }
)

export default function UserCombobox({
  usersSelectedId = [],
  onPick,
  textInputProps
}: {
  usersSelectedId?: string[]
  onPick?: (userId: string) => void
  textInputProps?: TextInputProps
}) {
  const { teamId } = useAppParams()
  const teamMembers =
    useAppSelector(state =>
      Object.values(state.workspace.members)
        .filter(
          e => e.targetId === teamId && e.userId !== state.auth.userInfo?._id
        )
        .map(member => ({ member, user: state.workspace.users[member.userId] }))
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

      <Combobox.Dropdown className='border-1 border-blue-400 bg-gray-400 shadow-sm'>
        <Combobox.Options style={{ overflowY: 'auto' }}>
          <ScrollArea.Autosize scrollbarSize={8} mah={400}>
            {teamMembers.length === 0 ? (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            ) : (
              teamMembers.map(({ member, user }) => (
                <Option
                  user={user}
                  member={member}
                  selected={usersSelectedId.includes(user._id)}
                />
              ))
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
