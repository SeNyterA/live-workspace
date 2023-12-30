export const removeHtmlTags = (htmlString: string) => {
  return htmlString.replace(/<[^>]*>/g, ' ')
}

export const formatFileName = (
  url: string,
  startChars: number = 10,
  endChars: number = 10
): string => {
  const fileName: string = url.split('/').pop() || ''

  if (fileName.length <= startChars + endChars) {
    return fileName
  }

  const firstChars: string = fileName.substring(0, startChars)
  const lastChars: string = fileName.substring(fileName.length - endChars)

  return `${firstChars}...${lastChars}`
}

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

export const groupByFileType = (urls: string[]): GroupedData => {
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
