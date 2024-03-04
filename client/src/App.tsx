import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import useRouteElements from './hooks/useRouteElements'
import { authActions } from './redux/slices/auth.slice'
import { LocalStorageEventTarget } from './utils/auth'

init({ data })

function App() {
  const routeElements = useRouteElements()
  const dispatch = useDispatch()

  const t = useTranslation()

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', () => {
      dispatch(authActions.logout())
    })
  }, [dispatch])

  return <>{routeElements}</>
}

export default App
