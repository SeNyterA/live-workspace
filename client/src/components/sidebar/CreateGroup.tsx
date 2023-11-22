import {
  Avatar,
  Button,
  Drawer,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import { useAppSelector } from '../../redux/store'
import { ApiMutationType } from '../../services/apis/useAppMutation'
import { TMemberDto } from '../../types/dto.type'
import { EMemberRole } from '../../types/workspace.type'
import PickUser from './PickUser'

type TForm = ApiMutationType['createGroup']['payload']

const Member = ({ member }: { member: TMemberDto }) => {
  const user = useAppSelector(state =>
    Object.values(state.workspace.users).find(e => e._id === member.userId)
  )

  return (
    <div className='mt-3 flex flex-1 gap-2 first:mt-0' key={user?._id}>
      <Avatar src={user?.avatar} />
      <div className='flex flex-1 flex-col justify-center'>
        <p className='font-medium leading-5'>{user?.userName}</p>
        <p className='text-xs leading-3 text-gray-500'>{user?.email}</p>
      </div>
    </div>
  )
}
export default function CreateGroup({
  onClose,
  isOpen
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { control, handleSubmit } = useForm<TForm>()

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create group</p>}
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1'
      }}
    >
      <Controller
        control={control}
        name='title'
        render={({ field: { value, onChange } }) => (
          <TextInput
            label='Group name'
            placeholder='Your name'
            description='Leave it blank to use the names of the group members...'
            size='sm'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      <Controller
        control={control}
        name='description'
        render={({ field: { value, onChange } }) => (
          <Textarea
            label='Group description'
            description='Description for the group'
            placeholder='Anything...'
            className='mt-2'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      <Controller
        control={control}
        name='members'
        render={({ field: { value, onChange } }) => (
          <>
            <PickUser
              usersSelectedId={value?.map(e => e.userId) || []}
              onPick={userId => {
                const member = value?.find(e => e.userId === userId)
                if (!member) {
                  onChange([
                    ...(value || []),
                    {
                      userId,
                      role: EMemberRole.Member
                    }
                  ])
                } else {
                  onChange((value || []).filter(e => e.userId !== userId))
                }
              }}
              textInputProps={{
                label: 'Group description',
                description: 'Description for the group',
                placeholder: 'Anything...',
                className: 'mt-2'
              }}
            />

            <div className='relative flex-1'>
              <ScrollArea className='absolute inset-0 mt-2' scrollbarSize={8}>
                {value?.map(member => (
                  <Member member={member} key={member.userId} />
                ))}
              </ScrollArea>
            </div>
          </>
        )}
      />

      <div className='mt-2 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
          onClick={handleSubmit(data => {
            console.log(data)
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
