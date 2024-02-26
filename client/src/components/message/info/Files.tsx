import { Badge, Image, Loader, NavLink, ScrollArea } from '@mantine/core'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { useAppQuery } from '../../../services/apis/useAppQuery'

export default function Files() {
  const { channelId, groupId, directId } = useAppParams()
  const workspaceId = channelId || groupId || directId

  const { isPending, data: workspaceFiles } = useAppQuery({
    key: 'workspaceFiles',
    url: {
      baseUrl: '/workspaces/:workspaceId/files',
      urlParams: { workspaceId: workspaceId! }
    },
    options: {
      enabled: !!workspaceId
    }
  })

  return (
    <NavLink
      className='mt-1 p-1 pl-0'
      label={
        <div className='flex items-center justify-between gap-1'>
          <p className='flex-1'>File</p>
          {workspaceFiles && workspaceFiles?.length > 0 && (
            <Badge variant='light' color='gray'>
              {workspaceFiles!.length}
            </Badge>
          )}
          {isPending && <Loader size={10} />}
        </div>
      }
      onClick={() => {}}
      classNames={{
        children:
          'h-[300px] relative w-full border rounded border-dashed border-none bg-gray-50'
      }}
    >
      <ScrollArea
        className='absolute inset-2 right-0 pr-2'
        scrollbarSize={8}
        classNames={{ viewport: '' }}
      >
        <div className='grid w-full grid-cols-3 gap-2'>
          {workspaceFiles?.map((file, index) => {
            const url = new URL(file.path)
            url.searchParams.set('quality', 'low')
            return <Image src={url.toString()} className='aspect-[1] rounded' />
          })}
        </div>
      </ScrollArea>
    </NavLink>
  )
}
