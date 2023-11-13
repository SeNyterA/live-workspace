import { useState } from 'react'
import useAppParams from '../../hooks/useAppParams'
import { useAppQuery } from '../../services/apis/useAppQuery'
import {
  ApiSocketType,
  useAppOnSocket
} from '../../services/socket/useAppOnSocket'

export default function useDirectControl() {
  const { directUserName } = useAppParams()

  const { data } = useAppQuery({
    key: 'findUserByUserName',
    url: {
      baseUrl: '/user/by-username/:userName',
      urlParams: {
        userName: directUserName!
      }
    },
    options: {
      queryKey: [directUserName],
      enabled: !!directUserName
    }
  })

  const [userTypings, setUserTypings] =
    useState<ApiSocketType['typing']['response'][]>()
  useAppOnSocket({
    key: 'typing',
    resFunc: ({ targetId, userId, type }) => {
      setUserTypings([...(userTypings || []), { targetId, userId, type }])
    }
  })

  return {
    directUser: data?.user
  }
}
