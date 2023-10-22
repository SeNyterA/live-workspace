import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useRouteElements from './hooks/useRouteElements'
import { userAction } from './redux/slices/auth.slice'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const dispatch = useDispatch()

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', () => {
      dispatch(userAction.logout())
    })
  }, [dispatch])

  return <>{routeElements}</>
}

export default App
