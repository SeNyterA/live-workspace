import { Avatar } from '@mantine/core'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'

export default function DropAvt(props: Partial<DropzoneProps>) {
  return (
    <Dropzone
      onDrop={files => console.log('accepted files', files)}
      onReject={files => console.log('rejected files', files)}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Avatar className='h-32 w-32 border border-dashed bg-gray-50' />
    </Dropzone>
  )
}
