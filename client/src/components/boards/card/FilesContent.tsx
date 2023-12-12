import { CloseButton, Image } from '@mantine/core'

type FileInfo = {
  type?: string
  url: string
}

const detectFileType = (url: string): FileInfo => {
  const match = url.match(/\.([a-zA-Z0-9]+)$/)

  if (match && match[1]) {
    const extension = match[1].toLowerCase()
    return { type: extension, url }
  } else
    return {
      url
    }
}

type GroupedData = {
  images: FileInfo[]
  files: FileInfo[]
}

const groupByFileType = (urls: string[]): GroupedData => {
  const result: GroupedData = {
    images: [],
    files: []
  }

  urls.forEach(url => {
    const fileInfo = detectFileType(url)

    switch (fileInfo?.type) {
      case 'jpg':
      case 'jpeg':
      case 'png':
        result.images.push(fileInfo)
        break

      default:
        result.files.push(fileInfo)
        break
    }
  })

  return result
}

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
