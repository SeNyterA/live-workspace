import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import SocketProvider from './SocketProvider.tsx'
import './index.css'
import store from './redux/store.ts'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <MantineProvider>
            <App />
          </MantineProvider>
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
