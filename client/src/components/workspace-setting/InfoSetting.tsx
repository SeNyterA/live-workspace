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
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { EWorkspaceStatus } from '../../types'

const Title = () => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <TextInput
      // data-autofocus
      withAsterisk
      disabled={isPending}
      label={`${workspace?.type} name`}
      placeholder='Enter the team name'
      size='sm'
      className='mt-4'
      defaultValue={workspace?.title}
      key={workspace?.title}
      onBlur={e =>
        e.target.value !== workspace?.title &&
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?._id! }
          },
          payload: { workspace: { title: e.target.value } as any }
        })
      }
      rightSection={isPending && <Loader size={14} />}
    />
  )
}

const Description = () => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <Textarea
      placeholder='Enter a description...'
      className='mt-4'
      defaultValue={workspace?.description}
      key={workspace?.description}
      // data-autofocus
      withAsterisk
      disabled={isPending}
      label={`${workspace?.type} description`}
      size='sm'
      onBlur={e =>
        e.target.value !== workspace?.description &&
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?._id! }
          },
          payload: { workspace: { description: e.target.value } as any }
        })
      }
      rightSection={isPending && <Loader size={14} />}
    />
  )
}

const DisplayUrl = () => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <TextInput
      // data-autofocus
      withAsterisk
      label='Dispay url'
      placeholder='Enter the display url'
      description='This is the url that will be used to access the team. e.g. .../teams/your-team-name'
      size='sm'
      className='mt-4'
      defaultValue={workspace?.displayUrl}
      disabled={isPending}
      key={workspace?.displayUrl}
      onBlur={e =>
        e.target.value !== workspace?.displayUrl &&
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?._id! }
          },
          payload: { workspace: { displayUrl: e.target.value } as any }
        })
      }
      rightSection={isPending && <Loader size={14} />}
    />
  )
}

const Thunmbnail = () => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    },
    mutationOptions: {
      onSuccess(data, variables, context) {
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: {
              workspaceId: workspace?._id!
            }
          },
          payload: { workspace: { thumbnail: data } as any }
        })
      }
    }
  })

  return (
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
      <Input.Description className='mt-1'>
        This image is used for thumbnail
      </Input.Description>
    </>
  )
}

const WorkspaceStatus = () => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <Radio.Group
      name='status'
      label='Select the status for this workspace'
      description='This will determine who can access this workspace'
      withAsterisk
      className='mt-4'
      value={workspace?.status}
    >
      <Group mt='xs'>
        <Radio
          value={EWorkspaceStatus.Private}
          label='Active'
          classNames={{
            body: 'flex gap-1 flex-row-reverse',
            description: 'mt-0'
          }}
          description='Only members can access. Users added to the team will not be added to this workspace or its members automatically.'
        />
        <Radio
          value={EWorkspaceStatus.Public}
          label='Inactive'
          classNames={{
            body: 'flex gap-1 flex-row-reverse',
            description: 'mt-0'
          }}
          description='Anyone can access. Users added to the team will also be added to this workspace automatically.'
        />
      </Group>
    </Radio.Group>
  )
}

const WorkspaceAvatar = () => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    },
    mutationOptions: {
      onSuccess(data, variables, context) {
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: {
              workspaceId: workspace?._id!
            }
          },
          payload: { workspace: { avatar: data } as any }
        })
      }
    }
  })

  return (
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
    </>
  )
}

export default function InfoSetting() {
  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    },
    mutationOptions: {
      onSuccess(data, variables, context) {
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?._id! }
          },
          payload: { workspace: { thumbnail: data } as any }
        })
      }
    }
  })

  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  return (
    <ScrollArea
      className='absolute inset-0 right-[-12px] pr-3'
      scrollbarSize={8}
    >
      <Thunmbnail />

      <WorkspaceAvatar />

      <Title />

      <DisplayUrl />

      <Description />

      <WorkspaceStatus />
    </ScrollArea>
  )
}
