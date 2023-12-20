export const removePassword = <T>(object: T): Omit<T, 'password'> => {
  delete (object as any)?.password
  return object
}
