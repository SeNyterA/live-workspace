export const replaceDynamicValues = (
  template: string,
  dynamicValues: { [key: string]: string | number }
) => {
  const dynamicKeys = Object.keys(dynamicValues)
  let replacedUrl = template

  dynamicKeys.forEach(key => {
    // Use a regex pattern that matches colons and the key
    const pattern = new RegExp(`:${key}`, 'g')
    replacedUrl = replacedUrl.replace(pattern, dynamicValues[key]?.toString())
  })

  return replacedUrl
}
