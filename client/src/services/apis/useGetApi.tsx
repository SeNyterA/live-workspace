import { useQuery } from '@tanstack/react-query'
import http from './http'

export default function useGetApi() {
  const data = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => (await http.get('/repos/TanStack/query')).data
  })
  return data
}
