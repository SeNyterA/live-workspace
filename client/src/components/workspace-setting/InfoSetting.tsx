import {
  Avatar,
  Group,
  Input,
  Loader,
  Radio,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { WorkspaceType } from '../../new-types/workspace.d'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'

export default function InfoSetting() {
  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })

  const workspace = useAppSelector(
    state =>
      state.workspace.workspaces[state.workspace.workspaceSetting?.workspaceId!]
  )
  return (
    <ScrollArea
      className='absolute inset-0 right-[-12px] pr-3'
      scrollbarSize={8}
    >
      <Dropzone
        onDrop={files =>
          uploadFile(
            {
              method: 'post',
              isFormData: true,
              url: {
                baseUrl: '/upload'
              },
              payload: { file: files[0] }
            },
            {
              onSuccess(data, variables, context) {
                // setValue('thumbnail', data)
              }
            }
          )
        }
        multiple={false}
        onReject={files => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        className='mt-4 w-full'
      >
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.thumbnail?.path}
          className='h-40 w-full flex-1 rounded-lg border bg-gray-50'
          alt='Team thumbnail'
        >
          Team thumbnail
        </Avatar>
      </Dropzone>
      <Input.Description className=''>
        This image is used for thumbnail
      </Input.Description>

      <Dropzone
        onDrop={files =>
          uploadFile(
            {
              method: 'post',
              isFormData: true,
              url: {
                baseUrl: '/upload'
              },
              payload: { file: files[0] }
            },
            {
              onSuccess(data, variables, context) {}
            }
          )
        }
        multiple={false}
        onReject={files => console.log('rejected files', files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        className='mt-4'
        classNames={{
          inner: 'flex gap-2'
        }}
      >
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='h-32 w-32 rounded-lg'
        />
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='h-24 w-24 rounded-lg'
        />
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='h-16 w-16 rounded-lg'
        />
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='!h-8 !w-8 rounded-lg'
          size={32}
        />
      </Dropzone>
      <Input.Description className=''>
        This image is used for avatar
      </Input.Description>

      <TextInput
        data-autofocus
        withAsterisk
        label='Team Name'
        placeholder='Enter the team name'
        size='sm'
        className='mt-4'
        defaultValue={workspace?.title}
        key={workspace?.title}
        onChange={e => console.log(e.target.value)}
        rightSection={<Loader size={14} />}
      />

      <TextInput
        data-autofocus
        withAsterisk
        label='Dispay url'
        placeholder='Enter the display url'
        description='This is the url that will be used to access the team. e.g. .../teams/your-team-name'
        size='sm'
        className='mt-4'
        defaultValue={workspace?.displayUrl}
        key={workspace?.displayUrl}
        onChange={e => console.log(e.target.value)}
        rightSection={<Loader size={14} />}
      />

      <Textarea
        label='Team Description'
        placeholder='Enter a description for the team...'
        className='mt-4'
        defaultValue={workspace?.description}
        key={workspace?.description}
        onChange={e => console.log(e.target.value)}
        rightSection={<Loader size={14} />}
      />

      {[WorkspaceType.Board, WorkspaceType.Channel].includes(
        workspace?.type!
      ) && (
        <Radio.Group
          name='favoriteFramework'
          label='Select your favorite framework/library'
          description='This is anonymous'
          withAsterisk
          className='mt-4'
        >
          <Group mt='xs'>
            <Radio
              value='private'
              label='Private'
              classNames={{
                body: 'flex gap-1 flex-row-reverse',
                description: 'mt-0'
              }}
              description='Only members can access'
            />
            <Radio
              value='public'
              label='Public'
              classNames={{
                body: 'flex gap-1 flex-row-reverse',
                description: 'mt-0'
              }}
              description='Anyone can access'
            />
          </Group>
        </Radio.Group>
      )}
    </ScrollArea>
  )
}
