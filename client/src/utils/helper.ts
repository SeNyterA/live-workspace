export const cleanObj = <T extends Record<string, any>>(
  params: T
): Record<string, string> =>
  Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== '' && value !== null
    )
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      },
      {} as Record<string, string>
    )

export const generateId = () => {
  return Math.random().toString(36).substring(7)
}
