import { CloseButton, Image } from '@mantine/core'
import { groupByFileType } from '../../new-message/helper'

export default function FilesContent({ urls }: { urls?: string[] }) {
  const { files, images } = groupByFileType(urls || [])

  return (
    <div className='my-2'>
      {images.map(image => (
        <div className='relative' key={image.url}>
          <CloseButton className='absolute right-1 top-1' />
          <Image className='mt-1' radius='md' src={image.url} fit='contain' />
        </div>
      ))}
      <div className='flex flex-wrap gap-2'>
        {files.map(file => (
          <div className='relative w-40 rounded bg-gray-100 p-1' key={file.url}>
            <p className='line-clamp-2 text-gray-400'>{file.url}</p>
            <p className=''>{file.type}</p>
            <CloseButton className='absolute right-1 top-1' />
          </div>
        ))}
      </div>
    </div>
  )
}
