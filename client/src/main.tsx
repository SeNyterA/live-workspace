import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import SocketProvider from './SocketProvider.tsx'
import './index.css'
import store from './redux/store.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <SocketProvider>
        <MantineProvider>
          <App />
        </MantineProvider>
      </SocketProvider>
    </BrowserRouter>
  </Provider>
)
