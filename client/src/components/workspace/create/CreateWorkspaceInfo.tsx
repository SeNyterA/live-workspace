import { Avatar, Input, Textarea, TextInput } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { Controller } from 'react-hook-form'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { WorkspaceType } from '../../../types'
import { useCreateWorkspaceForm } from './CreateWorkspace'
import TeamChild from './TeamChild'

export default function CreateWorkspaceInfo() {
  const { setValue, control, getValues } = useCreateWorkspaceForm()
  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })

  const workspaceType = getValues('workspace.type')
  return (
    <>
      <Controller
        control={control}
        name='workspace.thumbnail'
        render={({ field: { value, onChange } }) => (
          <>
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
                      setValue('workspace.thumbnail', data)
                    }
                  }
                )
              }
              multiple={false}
              onReject={files => console.log('rejected files', files)}
              maxSize={3 * 1024 * 2}
              accept={IMAGE_MIME_TYPE}
              className='mt-4 w-full'
            >
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={value?.path}
                className='h-40 w-full flex-1 rounded-lg border bg-gray-50'
                alt='Team thumbnail'
              >
                Team thumbnail
              </Avatar>
            </Dropzone>
            <Input.Description className='mt-1'>
              This image is used for thumbnail
            </Input.Description>
          </>
        )}
      />

      <Controller
        control={control}
        name='workspace.avatar'
        render={({ field: { value, onChange } }) => (
          <>
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
                      setValue('workspace.avatar', data)
                    }
                  }
                )
              }
              multiple={false}
              onReject={files => console.log('rejected files', files)}
              maxSize={3 * 1024 * 2}
              accept={IMAGE_MIME_TYPE}
              className='mt-4'
              classNames={{
                inner: 'flex gap-2'
              }}
            >
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={value?.path}
                className='h-32 w-32 rounded-lg'
              />
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={value?.path}
                className='h-24 w-24 rounded-lg'
              />
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={value?.path}
                className='h-16 w-16 rounded-lg'
              />
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={value?.path}
                className='!h-8 !w-8 rounded-lg'
                size={32}
              />
            </Dropzone>
            <Input.Description className=''>
              This image is used for avatar
            </Input.Description>
          </>
        )}
      />

      <Controller
        control={control}
        name='workspace.title'
        rules={{
          required: `${workspaceType} is required`
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <TextInput
            data-autofocus
            withAsterisk
            label={`${workspaceType} name`}
            placeholder='Enter the team name'
            size='sm'
            className='mt-4'
            classNames={{ label: 'capitalize' }}
            value={value}
            onChange={e => onChange(e.target.value)}
            error={fieldState.error && fieldState.error.message}
          />
        )}
      />

      <Controller
        control={control}
        name='workspace.displayUrl'
        render={({ field: { value, onChange }, fieldState }) => (
          <TextInput
            data-autofocus
            withAsterisk
            label='Dispay url'
            placeholder='Enter the display url'
            description={`e.g. ...teams/team-url/channels/${
              value || 'channel-name'
            }`}
            size='sm'
            className='mt-4'
            value={value}
            onChange={e => onChange(e.target.value)}
            error={fieldState.error && fieldState.error.message}
          />
        )}
      />

      <Controller
        control={control}
        name='workspace.description'
        render={({ field: { value, onChange } }) => (
          <Textarea
            label='Team Description'
            placeholder='Enter a description for the team...'
            className='mt-4'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      {workspaceType === WorkspaceType.Team && (
        <>
          <TeamChild name='channels' />
          <TeamChild name='boards' />
        </>
      )}
    </>
  )
}
