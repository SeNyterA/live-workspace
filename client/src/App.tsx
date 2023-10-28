import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import YourComponent from './components/TestSocket'
import useRouteElements from './hooks/useRouteElements'
import { authActions } from './redux/slices/auth.slice'
import SocketProvider from './services/socket/SocketProvider'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const dispatch = useDispatch()

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', () => {
      dispatch(authActions.logout())
    })
  }, [dispatch])

  return <>{routeElements}</>
  return (
    <SocketProvider>
      <YourComponent />
    </SocketProvider>
  )
}

export default App
