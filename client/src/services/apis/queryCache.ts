import { QueryCache } from '@tanstack/react-query'

export const queryCache = new QueryCache({
  onError: error => {
    console.log(error)
  },
  onSuccess: data => {
    console.log(data)
  },
  onSettled: (data, error) => {
    console.log(data, error)
  }
})
