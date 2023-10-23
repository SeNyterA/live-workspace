import { useNavigate } from 'react-router-dom'

export default function useControlParams() {
  const navigate = useNavigate()

  return {
    switchTo: ({
      targetId,
      target
    }: {
      targetId: string
      target: 'board' | 'channel' | 'group' | 'direct-message'
    }) => navigate(`/${target}/${targetId}`)
  }
}
