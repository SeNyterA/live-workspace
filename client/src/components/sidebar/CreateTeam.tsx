import { Button, Drawer, ScrollArea, Textarea, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { TTeamDto } from '../../types/dto.type'
import { EMemberRole } from '../../types/workspace.type'
import MemberControl from './MemberControl'
import UserCombobox from './UserCombobox'

type TForm = TTeamDto

export default function CreateTeam({
  onClose,
  isOpen,
  refetchKey
}: {
  isOpen: boolean
  onClose: () => void
  refetchKey?: string
}) {
  const { control, handleSubmit, reset, setValue } = useForm<TForm>({})
  const { mutateAsync: createTeam, isPending } = useAppMutation('createTeam')

  useEffect(() => {
    reset()
    // setValue('channelType', EStatusType.Private)
  }, [refetchKey])

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create Channel</p>}
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
            data-autofocus
            label='Channel Name'
            placeholder='Enter the channel name'
            description='Leave it blank to use the default name...'
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
            label='Channel Description'
            description='Description for the channel'
            placeholder='Enter a description for the channel...'
            className='mt-2'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      {/* <Controller
        control={control}
        name='channelType'
        render={({ field: { value, onChange } }) => (
          <Radio.Group
            name='channelPrivacy'
            label='Select Channel Privacy'
            description='This setting determines who can access the channel.'
            withAsterisk
            value={value}
            className='mt-2'
            onChange={onChange}
          >
            <Group mt='xs'>
              <Radio
                value={EStatusType.Public}
                label='Public Channel'
                description='Anyone in the team can join and access the content.'
              />
              <Radio
                value={EStatusType.Private}
                label='Private Channel'
                description='Only invited members can join and view the content.'
              />
            </Group>
          </Radio.Group>
        )}
      /> */}

      <Controller
        control={control}
        name='members'
        render={({ field: { value, onChange } }) => (
          <>
            <UserCombobox
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
                label: 'Add Members',
                description: 'Type to search and add members to the channel',
                placeholder: 'Search and select members...',
                className: 'mt-2'
              }}
            />

            <div className='relative flex-1'>
              <ScrollArea className='absolute inset-0 mt-2' scrollbarSize={8}>
                {value?.map((member, index) => (
                  <MemberControl
                    member={member}
                    key={member.userId}
                    onChange={role => {
                      onChange(
                        value.map((e, _index) => ({
                          ...e,
                          ...(index === _index && { role: role })
                        }))
                      )
                    }}
                    onRemove={() => {
                      onChange(value.filter((_, _index) => index !== _index))
                    }}
                  />
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
          loading={isPending}
          disabled={isPending}
          onClick={handleSubmit(data => {
            createTeam({
              url: {
                baseUrl: '/workspace/teams'
              },
              method: 'post',
              payload: data
            }).then(data => {
              console.log(data)
              onClose()
            })
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
