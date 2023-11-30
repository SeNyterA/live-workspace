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
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
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
  const userId = useAppSelector(state => state.auth.userInfo?._id)
  const combobox = useCombobox({
    onDropdownClose: () => {
      // setSearchValue('')
    }
  })
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [keyword] = useDebouncedValue(searchValue, 200)
  const { data: userData, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: {
        keyword
      }
    },
    options: {
      queryKey: [keyword],
      enabled: !!keyword
    }
  })

  useEffect(() => {
    if (userData)
      dispatch(
        workspaceActions.addUsers(
          userData.users.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          )
        )
      )
  }, [userData])

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
                .filter(e => userId !== e._id)
                .map(item => (
                  <Combobox.Option value={item._id} key={item._id}>
                    <div
                      className='mt-3 flex flex-1 items-center gap-2 first:mt-0'
                      key={item._id}
                    >
                      <Avatar src={item.avatar} />
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
