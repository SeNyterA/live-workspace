import { Image } from '@mantine/core'
import { useAppSelector } from '../../../../redux/store'

export default function Attachments({ messageId }: { messageId: string }) {
  const files = useAppSelector(state => {
    const fileIds = Object.values(state.workspace.attachments)
      .filter(e => e.type === 'messageAttactment' && e.messageId === messageId)
      .map(e => e.fileId)

    return Object.values(state.workspace.files).filter(e =>
      fileIds.includes(e.id)
    )
  })

  return (
    <>
      {files?.map(img => (
        <Image
          mah={400}
          maw={400}
          key={img.path}
          className='mt-0.5 rounded'
          src={img.path}
        />
      ))}
    </>
  )
}
