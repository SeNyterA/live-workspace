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
