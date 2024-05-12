import data from '@emoji-mart/data'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { init } from 'emoji-mart'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { routers } from './components/routers/routers.tsx'
import './index.scss'
import i18n from './locales/i18.ts'
import store from './redux/store.ts'

const queryClient = new QueryClient()
init({ data })
ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <RouterProvider router={routers} />
        </MantineProvider>
      </QueryClientProvider>
    </Provider>
  </I18nextProvider>
)
